import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: [number, number, number, number, number];
  feedback?: string;
  deviceToken?: string;
  submittedAt: string;
}

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'responses.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory store initialized from disk if available
let responses: SurveyResponse[] = [];

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    responses = JSON.parse(raw);
  }
} catch (e) {
  console.warn('Could not read existing responses file, starting fresh', e);
  responses = [];
}

const saveResponsesToDisk = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(responses, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save responses to disk', err);
  }
};

app.use(express.json());

// SSE Clients list
type SseClient = {
  id: number;
  res: Response;
};
let sseClients: SseClient[] = [];

const broadcastUpdate = (type: string, data: any) => {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client disconnected
    }
  });
};

// Calculate summary stats
const computeStats = () => {
  const total = responses.length;
  if (total === 0) {
    return {
      total: 0,
      overallMean: 0,
      overallSD: 0,
      overallLevel: 'ยังไม่มีข้อมูล',
      questionMeans: [0, 0, 0, 0, 0],
      questionSDs: [0, 0, 0, 0, 0],
      questionLevels: ['ยังไม่มีข้อมูล', 'ยังไม่มีข้อมูล', 'ยังไม่มีข้อมูล', 'ยังไม่มีข้อมูล', 'ยังไม่มีข้อมูล'],
      distribution: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      recentFeedback: [],
    };
  }

  const questionSums = [0, 0, 0, 0, 0];
  const distribution = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  responses.forEach((r) => {
    r.scores.forEach((score, qIdx) => {
      questionSums[qIdx] += score;
      const scoreIndex = Math.max(0, Math.min(4, Math.round(score) - 1));
      distribution[qIdx][scoreIndex]++;
    });
  });

  const questionMeans = questionSums.map((sum) => Number((sum / total).toFixed(2)));

  // Standard Deviations
  const questionSDs = [0, 1, 2, 3, 4].map((qIdx) => {
    if (total <= 1) return 0;
    const mean = questionMeans[qIdx];
    const variance =
      responses.reduce((acc, r) => acc + Math.pow(r.scores[qIdx] - mean, 2), 0) / (total - 1);
    return Number(Math.sqrt(variance).toFixed(2));
  });

  const getLikertLevel = (mean: number) => {
    if (mean >= 4.51) return 'มากที่สุด';
    if (mean >= 3.51) return 'มาก';
    if (mean >= 2.51) return 'ปานกลาง';
    if (mean >= 1.51) return 'น้อย';
    if (mean >= 1.0) return 'น้อยที่สุด';
    return 'ยังไม่มีข้อมูล';
  };

  const questionLevels = questionMeans.map(getLikertLevel);

  const overallMean = Number(
    (questionMeans.reduce((acc, val) => acc + val, 0) / questionMeans.length).toFixed(2)
  );

  // Overall SD
  const allScores: number[] = [];
  responses.forEach((r) => allScores.push(...r.scores));
  const overallSD =
    allScores.length > 1
      ? Number(
          Math.sqrt(
            allScores.reduce((acc, val) => acc + Math.pow(val - overallMean, 2), 0) /
              (allScores.length - 1)
          ).toFixed(2)
        )
      : 0;

  const overallLevel = getLikertLevel(overallMean);

  const recentFeedback = responses
    .filter((r) => r.feedback && r.feedback.trim().length > 0)
    .slice(-30)
    .reverse()
    .map((r) => ({
      id: r.id,
      feedback: r.feedback!,
      timestamp: r.timestamp,
      submittedAt: r.submittedAt,
      averageScore: Number(
        (r.scores.reduce((a, b) => a + b, 0) / r.scores.length).toFixed(2)
      ),
    }));

  return {
    total,
    overallMean,
    overallSD,
    overallLevel,
    questionMeans,
    questionSDs,
    questionLevels,
    distribution,
    recentFeedback,
  };
};

// API: Server-Sent Events
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = Date.now();
  const newClient: SseClient = { id: clientId, res };
  sseClients.push(newClient);

  // Immediately push initial data
  const initialPayload = `event: init\ndata: ${JSON.stringify({
    responses,
    stats: computeStats(),
  })}\n\n`;
  res.write(initialPayload);

  // Heartbeat every 25s
  const interval = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(interval);
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// API: Get current data
app.get('/api/responses', (_req: Request, res: Response) => {
  res.json({
    responses,
    stats: computeStats(),
  });
});

// API: Submit a response
app.post('/api/responses', (req: Request, res: Response) => {
  const { scores, feedback, deviceToken } = req.body;

  if (!scores || !Array.isArray(scores) || scores.length !== 5) {
    return res.status(400).json({ error: 'กรุณาให้คะแนนครบทั้ง 5 ข้อ (1-5)' });
  }

  const validScores = scores.map((s) => Number(s));
  const isAllValid = validScores.every((s) => !isNaN(s) && s >= 1 && s <= 5);
  if (!isAllValid) {
    return res.status(400).json({ error: 'คะแนนต้องอยู่ในช่วง 1 ถึง 5' });
  }

  // Check duplicate device submission if deviceToken provided
  if (deviceToken && typeof deviceToken === 'string') {
    const existing = responses.find((r) => r.deviceToken === deviceToken);
    if (existing) {
      return res.status(409).json({
        error: 'อุปกรณ์นี้ได้ส่งแบบสอบถามไปแล้ว ขอบคุณสำหรับการมีส่วนร่วม',
        submittedAt: existing.submittedAt,
      });
    }
  }

  const now = new Date();
  const newResponse: SurveyResponse = {
    id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: now.getTime(),
    submittedAt: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    scores: validScores as [number, number, number, number, number],
    feedback: feedback ? String(feedback).trim().slice(0, 1000) : '',
    deviceToken: deviceToken || '',
  };

  responses.push(newResponse);
  saveResponsesToDisk();

  const stats = computeStats();
  broadcastUpdate('new_response', {
    newResponse,
    stats,
  });

  return res.status(201).json({
    success: true,
    message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
    responseId: newResponse.id,
    stats,
  });
});

// API: Reset all responses
app.post('/api/reset', (_req: Request, res: Response) => {
  responses = [];
  saveResponsesToDisk();
  const stats = computeStats();
  broadcastUpdate('reset', { stats });
  res.json({ success: true, message: 'ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว', stats });
});

// API: Seed sample responses for demo/testing
app.post('/api/seed', (req: Request, res: Response) => {
  const count = Math.min(50, Math.max(1, Number(req.body.count) || 12));
  const sampleComments = [
    'วิทยากรถ่ายทอดได้เข้าใจง่ายมาก ยกตัวอย่างเห็นภาพชัดเจน',
    'เนื้อหาเข้มข้นตรงตามที่คาดหวัง สามารถนำไปใช้จริงในงานได้ทันที',
    'อยากให้เพิ่มเวลาในการทำเวิร์กชอปปฏิบัติจริงอีกนิดครับ',
    'เอกสารประกอบการสอนจัดทำดีมาก สะดวกและสวยงาม',
    'สถานที่และอาหารว่างจัดได้ยอดเยี่ยม เจ้าหน้าที่ดูแลดีมากค่ะ',
    'เป็นการอบรมที่คุ้มค่ามาก แนะนำให้จัดหลักสูตรขั้นสูงต่อเลยครับ',
    'ประทับใจความใส่ใจและคำตอบของวิทยากรในทุกข้อซักถาม',
    'ควรมีเวลาพักระหว่างช่วงมากขึ้นเล็กน้อย นอกนั้นดีมาก',
  ];

  const now = Date.now();
  for (let i = 0; i < count; i++) {
    // Generate realistic high-satisfaction distribution
    const genScore = () => {
      const r = Math.random();
      if (r < 0.5) return 5;
      if (r < 0.85) return 4;
      if (r < 0.95) return 3;
      return 4;
    };
    const s: [number, number, number, number, number] = [
      genScore(),
      genScore(),
      genScore(),
      genScore(),
      genScore(),
    ];
    const hasComment = Math.random() > 0.4;
    const timeOffset = (count - i) * 1000 * 60 * 3; // 3 min intervals
    const t = new Date(now - timeOffset);

    responses.push({
      id: `resp_seed_${Date.now()}_${i}`,
      timestamp: t.getTime(),
      submittedAt: t.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      scores: s,
      feedback: hasComment
        ? sampleComments[Math.floor(Math.random() * sampleComments.length)]
        : '',
      deviceToken: `seed_token_${i}`,
    });
  }

  saveResponsesToDisk();
  const stats = computeStats();
  broadcastUpdate('seed', { stats });
  res.json({ success: true, message: `เพิ่มข้อมูลตัวอย่าง ${count} รายการเรียบร้อยแล้ว`, stats });
});

// API: Export CSV
app.get('/api/export-csv', (_req: Request, res: Response) => {
  // UTF-8 BOM for proper Thai rendering in Excel
  const bom = '\uFEFF';
  const headers = [
    'ลำดับ',
    'รหัสการตอบ',
    'วันเวลาที่ส่ง',
    'ข้อ 1 (เนื้อหา)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (เอกสาร/สื่อ)',
    'ข้อ 4 (เวลา/สถานที่)',
    'ข้อ 5 (การนำไปใช้)',
    'คะแนนเฉลี่ย',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะ',
  ];

  const rows = responses.map((r, idx) => {
    const avg = (r.scores.reduce((a, b) => a + b, 0) / 5).toFixed(2);
    let level = 'ปานกลาง';
    const numAvg = parseFloat(avg);
    if (numAvg >= 4.51) level = 'มากที่สุด';
    else if (numAvg >= 3.51) level = 'มาก';
    else if (numAvg >= 2.51) level = 'ปานกลาง';
    else if (numAvg >= 1.51) level = 'น้อย';
    else level = 'น้อยที่สุด';

    const cleanFeedback = (r.feedback || '').replace(/"/g, '""');
    return [
      idx + 1,
      r.id,
      new Date(r.timestamp).toLocaleString('th-TH'),
      r.scores[0],
      r.scores[1],
      r.scores[2],
      r.scores[3],
      r.scores[4],
      avg,
      level,
      `"${cleanFeedback}"`,
    ].join(',');
  });

  const csvContent = bom + [headers.join(','), ...rows].join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="survey_results.csv"');
  res.send(csvContent);
});

// Mount Vite or static
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
