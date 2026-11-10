export interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: [number, number, number, number, number];
  feedback?: string;
  deviceToken?: string;
  submittedAt: string;
}

export interface SurveyStats {
  total: number;
  overallMean: number;
  overallSD: number;
  overallLevel: string;
  questionMeans: [number, number, number, number, number];
  questionSDs: [number, number, number, number, number];
  questionLevels: [string, string, string, string, string];
  distribution: number[][]; // [questionIdx][scoreIdx 0..4]
  recentFeedback: {
    id: string;
    feedback: string;
    timestamp: number;
    submittedAt: string;
    averageScore: number;
  }[];
}

export interface QuestionInfo {
  id: number;
  title: string;
  shortLabel: string;
  description: string;
}

export const QUESTIONS: QuestionInfo[] = [
  {
    id: 1,
    title: '1. เนื้อหาหลักสูตรมีความเหมาะสม ตรงตามวัตถุประสงค์ และเป็นประโยชน์',
    shortLabel: 'เนื้อหาหลักสูตร',
    description: 'ความครอบคลุม ความทันสมัย และคุณค่าของเนื้อหา',
  },
  {
    id: 2,
    title: '2. วิทยากรมีความรู้ความเชี่ยวชาญ และมีเทคนิคการถ่ายทอดที่ชัดเจนเข้าใจง่าย',
    shortLabel: 'วิทยากร & การสอน',
    description: 'ความรู้ความสามารถ การตอบคำถาม และการสร้างบรรยากาศ',
  },
  {
    id: 3,
    title: '3. เอกสาร สื่อ และอุปกรณ์ประกอบการอบรมมีคุณภาพและพร้อมใช้งาน',
    shortLabel: 'สื่อ & เอกสาร',
    description: 'ความสมบูรณ์และประโยชน์ของสไลด์/ไฟล์ประกอบ',
  },
  {
    id: 4,
    title: '4. การบริหารเวลา สถานที่ สิ่งอำนวยความสะดวก และการบริการมีความเหมาะสม',
    shortLabel: 'เวลา & สถานที่',
    description: 'ความตรงต่อเวลา สภาพแวดล้อม และการประสานงาน',
  },
  {
    id: 5,
    title: '5. ความรู้ความเข้าใจที่ได้รับสามารถนำไปประยุกต์ใช้ในการทำงานได้จริง',
    shortLabel: 'การนำไปประยุกต์ใช้',
    description: 'ความคุ้มค่าและผลลัพธ์ที่สามารถนำไปต่อยอดได้',
  },
];

export const LIKERT_LEVELS = [
  { min: 4.51, max: 5.0, label: 'มากที่สุด', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  { min: 3.51, max: 4.5, label: 'มาก', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
  { min: 2.51, max: 3.5, label: 'ปานกลาง', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  { min: 1.51, max: 2.5, label: 'น้อย', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800' },
  { min: 1.0, max: 1.5, label: 'น้อยที่สุด', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
];

export function getLikertInterpretation(mean: number) {
  if (mean >= 4.51) return LIKERT_LEVELS[0];
  if (mean >= 3.51) return LIKERT_LEVELS[1];
  if (mean >= 2.51) return LIKERT_LEVELS[2];
  if (mean >= 1.51) return LIKERT_LEVELS[3];
  if (mean >= 1.0) return LIKERT_LEVELS[4];
  return { min: 0, max: 0, label: 'ยังไม่มีข้อมูล', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
}
