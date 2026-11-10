export const SURVEY_HTML_CODE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>แบบประเมินความพึงพอใจการฝึกอบรม</title>
  <!-- Google Fonts & Tailwind CSS CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Prompt', 'sans-serif'],
          }
        }
      }
    }
  <\/script>
  <!-- Firebase SDK (Compat Version - ใช้ง่ายในไฟล์เดียว ไม่ต้อง Build) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"><\/script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"><\/script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen font-sans antialiased py-6 px-4">
  <div class="max-w-md mx-auto">
    <!-- Header -->
    <header class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-md mb-3">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h1 class="text-xl font-bold text-slate-900 tracking-tight">แบบประเมินความพึงพอใจการอบรม</h1>
      <p class="text-xs text-slate-500 mt-1">โปรดตอบตามความเป็นจริง ข้อมูลนี้ไม่ระบุตัวตนและไม่เก็บชื่อ</p>
    </header>

    <!-- Success Screen (ซ่อนเป็นค่าเริ่มต้น) -->
    <div id="successCard" class="hidden bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="text-lg font-bold text-slate-900 mb-1">ส่งแบบประเมินสำเร็จแล้ว!</h2>
      <p class="text-sm text-slate-600 mb-6">ขอขอบคุณที่สละเวลาให้ข้อเสนอแนะอันมีค่าเพื่อพัฒนาการฝึกอบรมในครั้งต่อไป</p>
      
      <div class="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 text-xs text-slate-600 space-y-1 mb-6">
        <p class="font-medium text-slate-700">เกณฑ์ระดับคะแนน:</p>
        <p>5 = มากที่สุด · 4 = มาก · 3 = ปานกลาง · 2 = น้อย · 1 = น้อยที่สุด</p>
      </div>

      <button id="btnResetTest" class="text-xs text-indigo-600 hover:text-indigo-800 underline">
        (สำหรับทดสอบ) กดที่นี่หากต้องการส่งใหม่อีกครั้ง
      </button>
    </div>

    <!-- Survey Form -->
    <form id="surveyForm" class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>ความคืบหน้า</span>
          <span id="progressText" class="font-medium text-indigo-600">0/5 ข้อ</span>
        </div>
        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div id="progressBar" class="bg-indigo-600 h-full w-0 transition-all duration-300"></div>
        </div>
      </div>

      <!-- Question 1 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <label class="block font-medium text-slate-800 text-sm mb-3">
          1. เนื้อหาหลักสูตรมีความเหมาะสม ตรงตามวัตถุประสงค์ และเป็นประโยชน์
        </label>
        <div class="grid grid-cols-5 gap-2" data-question="1">
          <button type="button" data-val="1" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">1</button>
          <button type="button" data-val="2" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">2</button>
          <button type="button" data-val="3" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">3</button>
          <button type="button" data-val="4" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">4</button>
          <button type="button" data-val="5" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">5</button>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>1 = น้อยที่สุด</span>
          <span>5 = มากที่สุด</span>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <label class="block font-medium text-slate-800 text-sm mb-3">
          2. วิทยากรมีความรู้ความเชี่ยวชาญ และถ่ายทอดเนื้อหาได้เข้าใจชัดเจน
        </label>
        <div class="grid grid-cols-5 gap-2" data-question="2">
          <button type="button" data-val="1" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">1</button>
          <button type="button" data-val="2" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">2</button>
          <button type="button" data-val="3" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">3</button>
          <button type="button" data-val="4" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">4</button>
          <button type="button" data-val="5" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">5</button>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>1 = น้อยที่สุด</span>
          <span>5 = มากที่สุด</span>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <label class="block font-medium text-slate-800 text-sm mb-3">
          3. เอกสาร สื่อ และอุปกรณ์ประกอบการอบรมมีคุณภาพและพร้อมใช้งาน
        </label>
        <div class="grid grid-cols-5 gap-2" data-question="3">
          <button type="button" data-val="1" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">1</button>
          <button type="button" data-val="2" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">2</button>
          <button type="button" data-val="3" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">3</button>
          <button type="button" data-val="4" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">4</button>
          <button type="button" data-val="5" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">5</button>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>1 = น้อยที่สุด</span>
          <span>5 = มากที่สุด</span>
        </div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <label class="block font-medium text-slate-800 text-sm mb-3">
          4. การบริหารเวลา สถานที่ สิ่งอำนวยความสะดวก และการบริการมีความเหมาะสม
        </label>
        <div class="grid grid-cols-5 gap-2" data-question="4">
          <button type="button" data-val="1" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">1</button>
          <button type="button" data-val="2" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">2</button>
          <button type="button" data-val="3" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">3</button>
          <button type="button" data-val="4" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">4</button>
          <button type="button" data-val="5" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">5</button>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>1 = น้อยที่สุด</span>
          <span>5 = มากที่สุด</span>
        </div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <label class="block font-medium text-slate-800 text-sm mb-3">
          5. ความรู้ความเข้าใจที่ได้รับสามารถนำไปประยุกต์ใช้ในการทำงานได้จริง
        </label>
        <div class="grid grid-cols-5 gap-2" data-question="5">
          <button type="button" data-val="1" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">1</button>
          <button type="button" data-val="2" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">2</button>
          <button type="button" data-val="3" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">3</button>
          <button type="button" data-val="4" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">4</button>
          <button type="button" data-val="5" class="score-btn h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base transition-colors hover:border-indigo-400">5</button>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>1 = น้อยที่สุด</span>
          <span>5 = มากที่สุด</span>
        </div>
      </div>

      <!-- Feedback -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <label for="feedback" class="block font-medium text-slate-800 text-sm mb-2">
          ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
        </label>
        <textarea id="feedback" rows="3" placeholder="ระบุสิ่งที่ประทับใจ หรือสิ่งที่ควรปรับปรุงในการจัดอบรมครั้งต่อไป..." class="w-full text-sm rounded-xl border border-slate-200 p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="btnSubmit" class="w-full h-13 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2">
        <span>ส่งแบบประเมินความพึงพอใจ</span>
      </button>

      <p id="errorMsg" class="hidden text-xs text-rose-500 text-center font-medium"></p>
    </form>
  </div>

  <script>
    // 1. ตั้งค่า Firebase Realtime Database ของคุณ
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let db = null;
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
      } catch (e) {
        console.warn("Firebase Init Error:", e);
      }
    }

    const scores = { 1: null, 2: null, 3: null, 4: null, 5: null };
    const LOCAL_STORAGE_KEY = 'training_survey_submitted_token';

    function checkAlreadySubmitted() {
      const token = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (token) {
        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('successCard').classList.remove('hidden');
      }
    }
    checkAlreadySubmitted();

    document.getElementById('btnResetTest').addEventListener('click', () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      location.reload();
    });

    document.querySelectorAll('.score-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = btn.closest('[data-question]');
        const qNum = parent.getAttribute('data-question');
        const val = parseInt(btn.getAttribute('data-val'), 10);

        parent.querySelectorAll('.score-btn').forEach(b => {
          b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600', 'shadow-sm');
          b.classList.add('border-slate-200', 'text-slate-700');
        });

        btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600', 'shadow-sm');
        btn.classList.remove('border-slate-200', 'text-slate-700');

        scores[qNum] = val;
        updateProgress();
      });
    });

    function updateProgress() {
      const answered = Object.values(scores).filter(v => v !== null).length;
      document.getElementById('progressText').textContent = answered + '/5 ข้อ';
      document.getElementById('progressBar').style.width = (answered / 5 * 100) + '%';
    }

    document.getElementById('surveyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorMsg = document.getElementById('errorMsg');
      errorMsg.classList.add('hidden');

      const unanswered = [1, 2, 3, 4, 5].filter(q => scores[q] === null);
      if (unanswered.length > 0) {
        errorMsg.textContent = 'กรุณาให้คะแนนข้อที่ ' + unanswered.join(', ') + ' ให้ครบถ้วน';
        errorMsg.classList.remove('hidden');
        return;
      }

      const feedback = document.getElementById('feedback').value.trim();
      const payload = {
        scores: [scores[1], scores[2], scores[3], scores[4], scores[5]],
        feedback: feedback,
        timestamp: Date.now(),
        submittedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };

      const btnSubmit = document.getElementById('btnSubmit');
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<span>กำลังบันทึกข้อมูล...</span>';

      try {
        if (db) {
          const newRef = db.ref('surveys').push();
          await newRef.set(payload);
        } else {
          await new Promise(r => setTimeout(r, 600));
        }

        const token = 'submitted_' + Date.now();
        localStorage.setItem(LOCAL_STORAGE_KEY, token);

        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('successCard').classList.remove('hidden');
      } catch (err) {
        console.error(err);
        errorMsg.textContent = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + err.message;
        errorMsg.classList.remove('hidden');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>ส่งแบบประเมินความพึงพอใจ</span>';
      }
    });
  <\/script>
</body>
</html>`;

export const DASHBOARD_HTML_CODE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard แสดงผลความพึงพอใจการอบรม (Realtime)</title>
  <!-- Google Fonts & Tailwind CSS CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <!-- Chart.js CDN for clean, sharp bar chart -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"><\/script>
  <!-- Firebase SDK (Compat Version) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"><\/script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"><\/script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Prompt', 'Plus Jakarta Sans', 'sans-serif'],
          }
        }
      }
    }
  <\/script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased p-4 lg:p-8">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Top Bar suitable for Projector -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            LIVE REALTIME
          </span>
          <span id="firebaseStatus" class="text-xs text-slate-400">โหมด: ตัวอย่างจำลอง (รอการต่อ Firebase)</span>
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold tracking-tight text-white mt-1">
          ผลการประเมินความพึงพอใจการฝึกอบรม
        </h1>
        <p class="text-xs lg:text-sm text-slate-400">
          คำนวณคะแนนเฉลี่ย (x̄) และส่วนเบี่ยงเบนมาตรฐาน (S.D.) อัปเดตทันทีที่มีการส่งคำตอบ
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-3">
        <button id="btnExportCSV" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          ดาวน์โหลด CSV
        </button>
        <button id="btnToggleQR" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
          </svg>
          แสดง QR Code ให้ผู้ตอบ
        </button>
      </div>
    </header>

    <!-- Stat Cards Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-400">จำนวนผู้ตอบทั้งหมด</p>
        <div class="flex items-baseline gap-2 mt-2">
          <span id="statTotal" class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono">0</span>
          <span class="text-xs text-slate-400">คน</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-2">อัปเดตแบบเรียลไทม์</p>
      </div>

      <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-400">คะแนนเฉลี่ยรวม (x̄)</p>
        <div class="flex items-baseline gap-2 mt-2">
          <span id="statMean" class="text-3xl lg:text-4xl font-extrabold text-indigo-400 tracking-tight font-mono">0.00</span>
          <span class="text-xs text-slate-400">/ 5.00</span>
        </div>
        <div class="mt-2 flex items-center gap-1.5">
          <span class="text-[11px] text-slate-400">ระดับ:</span>
          <span id="statLevelBadge" class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
            ยังไม่มีข้อมูล
          </span>
        </div>
      </div>

      <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-400">ส่วนเบี่ยงเบนมาตรฐาน (S.D.)</p>
        <div class="flex items-baseline gap-2 mt-2">
          <span id="statSD" class="text-3xl lg:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono">0.00</span>
          <span class="text-xs text-slate-400">ค่ากระจาย</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">ความสม่ำเสมอของความคิดเห็น</p>
      </div>

      <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-400">คิดเป็นร้อยละความพึงพอใจ</p>
        <div class="flex items-baseline gap-2 mt-2">
          <span id="statPercent" class="text-3xl lg:text-4xl font-extrabold text-amber-400 tracking-tight font-mono">0%</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">เทียบเต็ม 100%</p>
      </div>
    </div>

    <!-- Main Content: Chart & Likert Rubric -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-white">กราฟแท่งค่าเฉลี่ยรายข้อ (1 - 5)</h2>
            <p class="text-xs text-slate-400">เปรียบเทียบผลคะแนนเฉลี่ยทั้ง 5 ด้านของการฝึกอบรม</p>
          </div>
          <span class="text-xs text-slate-500 font-mono">เกณฑ์เต็ม 5.00</span>
        </div>

        <div class="h-80 w-full relative">
          <canvas id="satisfactionChart"></canvas>
        </div>

        <div class="mt-6 space-y-3 pt-4 border-t border-slate-700/60 text-xs">
          <div class="grid grid-cols-12 gap-2 text-slate-400 font-medium px-2 pb-1">
            <span class="col-span-7">หัวข้อประเมิน</span>
            <span class="col-span-2 text-center">ค่าเฉลี่ย (x̄)</span>
            <span class="col-span-1 text-center">S.D.</span>
            <span class="col-span-2 text-right">การแปลผล</span>
          </div>
          <div id="questionBreakdown" class="space-y-2"></div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
          <h3 class="text-sm font-semibold text-white mb-2">เกณฑ์การแปลผล Likert 5 ระดับ</h3>
          <ul class="text-xs space-y-1.5 text-slate-300">
            <li class="flex justify-between items-center py-1 border-b border-slate-700/40">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-400"></span>4.51 - 5.00</span>
              <span class="font-semibold text-emerald-400">มากที่สุด</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-slate-700/40">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-400"></span>3.51 - 4.50</span>
              <span class="font-semibold text-blue-400">มาก</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-slate-700/40">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-400"></span>2.51 - 3.50</span>
              <span class="font-semibold text-amber-400">ปานกลาง</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-slate-700/40">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-orange-400"></span>1.51 - 2.50</span>
              <span class="font-semibold text-orange-400">น้อย</span>
            </li>
            <li class="flex justify-between items-center py-1">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-400"></span>1.00 - 1.50</span>
              <span class="font-semibold text-rose-400">น้อยที่สุด</span>
            </li>
          </ul>
        </div>

        <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-white">ข้อเสนอแนะล่าสุด</h3>
            <span id="feedbackCount" class="text-xs text-slate-400">0 รายการ</span>
          </div>
          <div id="feedbackList" class="space-y-3 max-h-80 overflow-y-auto pr-1">
            <p class="text-xs text-slate-500 text-center py-6">ยังไม่มีข้อเสนอแนะจากผู้เข้าอบรม</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- QR Code Modal -->
  <div id="qrModal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white text-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
      <button id="btnCloseQR" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h3 class="text-xl font-bold text-slate-900 mb-1">สแกนเพื่อทำแบบประเมิน</h3>
      <p class="text-xs text-slate-500 mb-6">เปิดกล้องมือถือแล้วสแกน QR Code ด้านล่างนี้</p>
      
      <div class="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-200 mb-4 shadow-inner">
        <img id="qrImage" src="" alt="QR Code" class="w-56 h-56 mx-auto rounded-lg" />
      </div>

      <div class="space-y-2">
        <input type="text" id="surveyUrlInput" readonly class="w-full text-xs bg-slate-100 rounded-lg p-2.5 text-slate-600 text-center font-mono border border-slate-200" />
        <button id="btnCopyUrl" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors">
          คัดลอกลิงก์
        </button>
      </div>
    </div>
  </div>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const questionLabels = [
      "1. ด้านเนื้อหาหลักสูตร",
      "2. ด้านวิทยากรและการถ่ายทอด",
      "3. ด้านเอกสารและสื่อประกอบ",
      "4. ด้านการบริหารเวลาและสถานที่",
      "5. ด้านการนำไปประยุกต์ใช้"
    ];

    let surveyData = [];
    let myChart = null;

    function getLikertLevel(score) {
      if (score >= 4.51) return { text: "มากที่สุด", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
      if (score >= 3.51) return { text: "มาก", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
      if (score >= 2.51) return { text: "ปานกลาง", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
      if (score >= 1.51) return { text: "น้อย", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
      if (score >= 1.00) return { text: "น้อยที่สุด", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" };
      return { text: "ยังไม่มีข้อมูล", color: "text-slate-400", bg: "bg-slate-700 border-slate-600" };
    }

    function initChart() {
      const ctx = document.getElementById('satisfactionChart').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['เนื้อหา', 'วิทยากร', 'เอกสาร/สื่อ', 'เวลา/สถานที่', 'การนำไปใช้'],
          datasets: [{
            label: 'คะแนนเฉลี่ย (เต็ม 5.00)',
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              'rgba(99, 102, 241, 0.85)',
              'rgba(16, 185, 129, 0.85)',
              'rgba(14, 165, 233, 0.85)',
              'rgba(245, 158, 11, 0.85)',
              'rgba(168, 85, 247, 0.85)'
            ],
            borderColor: ['#818cf8', '#34d399', '#38bdf8', '#fbbf24', '#c084fc'],
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: { color: '#94a3b8', stepSize: 1 },
              grid: { color: 'rgba(51, 65, 85, 0.4)' }
            },
            x: {
              ticks: { color: '#cbd5e1' },
              grid: { display: false }
            }
          }
        }
      });
    }

    function renderDashboard(items) {
      surveyData = items;
      const total = items.length;
      document.getElementById('statTotal').textContent = total;

      if (total === 0) {
        document.getElementById('statMean').textContent = '0.00';
        document.getElementById('statSD').textContent = '0.00';
        document.getElementById('statPercent').textContent = '0%';
        document.getElementById('statLevelBadge').textContent = 'ยังไม่มีข้อมูล';
        if (myChart) {
          myChart.data.datasets[0].data = [0, 0, 0, 0, 0];
          myChart.update();
        }
        return;
      }

      const qSums = [0, 0, 0, 0, 0];
      items.forEach(r => {
        r.scores.forEach((s, idx) => { qSums[idx] += s; });
      });
      const qMeans = qSums.map(sum => sum / total);

      const qSDs = [0, 1, 2, 3, 4].map(idx => {
        if (total <= 1) return 0;
        const mean = qMeans[idx];
        const v = items.reduce((acc, r) => acc + Math.pow(r.scores[idx] - mean, 2), 0) / (total - 1);
        return Math.sqrt(v);
      });

      const overallMean = qMeans.reduce((a, b) => a + b, 0) / 5;
      document.getElementById('statMean').textContent = overallMean.toFixed(2);
      
      const level = getLikertLevel(overallMean);
      const badge = document.getElementById('statLevelBadge');
      badge.textContent = level.text;
      badge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded border ' + level.bg + ' ' + level.color;

      const allScores = [];
      items.forEach(r => allScores.push(...r.scores));
      const overallSD = total > 1
        ? Math.sqrt(allScores.reduce((acc, s) => acc + Math.pow(s - overallMean, 2), 0) / (allScores.length - 1))
        : 0;
      document.getElementById('statSD').textContent = overallSD.toFixed(2);

      const percent = Math.round((overallMean / 5) * 100);
      document.getElementById('statPercent').textContent = percent + '%';

      if (myChart) {
        myChart.data.datasets[0].data = qMeans.map(m => Number(m.toFixed(2)));
        myChart.update();
      }

      const breakdownEl = document.getElementById('questionBreakdown');
      breakdownEl.innerHTML = qMeans.map((m, idx) => {
        const qLvl = getLikertLevel(m);
        return '<div class="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">' +
          '<span class="col-span-7 font-medium text-slate-200 truncate">' + questionLabels[idx] + '</span>' +
          '<span class="col-span-2 text-center font-mono font-bold text-white">' + m.toFixed(2) + '</span>' +
          '<span class="col-span-1 text-center font-mono text-slate-400">' + qSDs[idx].toFixed(2) + '</span>' +
          '<span class="col-span-2 text-right">' +
            '<span class="text-[11px] font-semibold px-2 py-0.5 rounded ' + qLvl.bg + ' ' + qLvl.color + '">' + qLvl.text + '</span>' +
          '</span>' +
        '</div>';
      }).join('');

      const feedbackItems = items.filter(r => r.feedback && r.feedback.trim().length > 0).slice(-20).reverse();
      document.getElementById('feedbackCount').textContent = feedbackItems.length + ' รายการ';
      const feedbackList = document.getElementById('feedbackList');
      if (feedbackItems.length === 0) {
        feedbackList.innerHTML = '<p class="text-xs text-slate-500 text-center py-6">ยังไม่มีข้อเสนอแนะจากผู้เข้าอบรม</p>';
      } else {
        feedbackList.innerHTML = feedbackItems.map(f => {
          const avg = (f.scores.reduce((a, b) => a + b, 0) / 5).toFixed(1);
          return '<div class="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1">' +
            '<div class="flex items-center justify-between text-[11px] text-slate-400">' +
              '<span>คะแนนที่ให้เฉลี่ย: <strong class="text-indigo-400">' + avg + '★</strong></span>' +
              '<span>' + (f.submittedAt || '') + '</span>' +
            '</div>' +
            '<p class="text-xs text-slate-200 leading-relaxed">"' + f.feedback + '"</p>' +
          '</div>';
        }).join('');
      }
    }

    document.getElementById('btnExportCSV').addEventListener('click', () => {
      if (surveyData.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }
      const bom = '\\uFEFF';
      const headers = ['ลำดับ', 'วันเวลาที่ส่ง', 'ข้อ 1 (เนื้อหา)', 'ข้อ 2 (วิทยากร)', 'ข้อ 3 (เอกสาร/สื่อ)', 'ข้อ 4 (เวลา/สถานที่)', 'ข้อ 5 (การนำไปใช้)', 'คะแนนเฉลี่ย', 'การแปลผล', 'ข้อเสนอแนะ'];
      const rows = surveyData.map((r, i) => {
        const avg = (r.scores.reduce((a, b) => a + b, 0) / 5).toFixed(2);
        const lvl = getLikertLevel(parseFloat(avg)).text;
        const cleanFeedback = (r.feedback || '').replace(/"/g, '""');
        return [
          i + 1,
          r.submittedAt || new Date(r.timestamp).toLocaleTimeString(),
          r.scores[0],
          r.scores[1],
          r.scores[2],
          r.scores[3],
          r.scores[4],
          avg,
          lvl,
          '"' + cleanFeedback + '"'
        ].join(',');
      });

      const csvContent = bom + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'survey_results_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
    });

    const surveyUrl = window.location.href.replace('dashboard.html', 'survey.html');
    document.getElementById('surveyUrlInput').value = surveyUrl;
    document.getElementById('qrImage').src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(surveyUrl);

    document.getElementById('btnToggleQR').addEventListener('click', () => {
      document.getElementById('qrModal').classList.remove('hidden');
    });
    document.getElementById('btnCloseQR').addEventListener('click', () => {
      document.getElementById('qrModal').classList.add('hidden');
    });
    document.getElementById('btnCopyUrl').addEventListener('click', () => {
      navigator.clipboard.writeText(surveyUrl);
      alert('คัดลอกลิงก์สำเร็จ!');
    });

    initChart();
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      try {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        document.getElementById('firebaseStatus').textContent = '🟢 เชื่อมต่อ Firebase Realtime สำเร็จ';
        document.getElementById('firebaseStatus').className = 'text-xs text-emerald-400';

        db.ref('surveys').on('value', (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list = Object.keys(val).map(k => val[k]);
            renderDashboard(list);
          } else {
            renderDashboard([]);
          }
        });
      } catch (err) {
        console.error("Firebase Connection Error:", err);
      }
    } else {
      const sample = [
        { scores: [5, 5, 4, 4, 5], feedback: "วิทยากรสอนดีมาก ได้ความรู้ที่นำไปใช้ได้จริงทันที", timestamp: Date.now() - 600000, submittedAt: "10:15" },
        { scores: [4, 5, 5, 4, 4], feedback: "เอกสารประกอบชัดเจน อยากให้เพิ่มเวลา workshop", timestamp: Date.now() - 400000, submittedAt: "10:22" },
        { scores: [5, 4, 4, 5, 5], feedback: "สถานที่และการบริการดีมากค่ะ", timestamp: Date.now() - 100000, submittedAt: "10:35" }
      ];
      renderDashboard(sample);
    }
  <\/script>
</body>
</html>`;
