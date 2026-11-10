import React, { useState } from 'react';
import { SURVEY_HTML_CODE, DASHBOARD_HTML_CODE } from '../data/standaloneTemplates';
import { 
  Copy, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Database, 
  Cloud, 
  CheckSquare, 
  Monitor, 
  ShieldCheck, 
  Code2,
  Terminal,
  BookOpen
} from 'lucide-react';

export const FirebaseGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const sampleRules = `{
  "rules": {
    "surveys": {
      ".read": true,
      ".write": true
    }
  }
}`;

  const handleCopy = (text: string, type: 'survey' | 'dashboard' | 'rules') => {
    navigator.clipboard.writeText(text);
    if (type === 'survey') {
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } else if (type === 'dashboard') {
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    } else {
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2000);
    }
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Title Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML + JavaScript + Firebase Realtime Database</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              ซอร์สโค้ดแยก 2 ไฟล์ &amp; คู่มือติดตั้ง Firebase ทีละสเต็ป
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              โค้ดแบบ Standalone HTML พร้อมใช้งานทันที ไม่ต้องรัน Node.js / Build Tools คัดลอกหรือดาวน์โหลดไปใช้ได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadFile('survey.html', SURVEY_HTML_CODE)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด survey.html</span>
            </button>
            <button
              onClick={() => handleDownloadFile('dashboard.html', DASHBOARD_HTML_CODE)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>ดาวน์โหลด dashboard.html</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'survey'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>1. โค้ด survey.html (สำหรับมือถือ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>2. โค้ด dashboard.html (สำหรับโปรเจกเตอร์)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. คู่มือตั้งค่า Firebase &amp; Deploy (5 ขั้นตอน)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: survey.html Code */}
      {activeTab === 'survey' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ไฟล์ที่ 1: survey.html</span>
                <span className="text-xs font-normal text-slate-500">
                  (หน้าแบบสอบถามสำหรับผู้เข้าร่วมอบรม)
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ดีไซน์ Mobile-First ปุ่มใหญ่ สเกล 1-5 ป้องกันการตอบซ้ำด้วย LocalStorage
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(SURVEY_HTML_CODE, 'survey')}
                className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {copiedSurvey ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSurvey ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('survey.html', SURVEY_HTML_CODE)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
              <a
                href="/standalone/survey.html"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิดดูไฟล์ตัวอย่าง</span>
              </a>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-[550px] border border-slate-800 leading-relaxed selection:bg-indigo-500 selection:text-white">
              <code>{SURVEY_HTML_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: dashboard.html Code */}
      {activeTab === 'dashboard' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ไฟล์ที่ 2: dashboard.html</span>
                <span className="text-xs font-normal text-slate-500">
                  (หน้า Dashboard สำหรับขึ้นจอโปรเจกเตอร์)
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                มี Chart.js กราฟแท่ง, สรุปสถิติ x̄, S.D., ข้อเสนอแนะสด, และดาวน์โหลด CSV
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(DASHBOARD_HTML_CODE, 'dashboard')}
                className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {copiedDashboard ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedDashboard ? 'คัดลอกโค้ดแล้ว' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('dashboard.html', DASHBOARD_HTML_CODE)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์</span>
              </button>
              <a
                href="/standalone/dashboard.html"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>เปิดดูไฟล์ตัวอย่าง</span>
              </a>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-[550px] border border-slate-800 leading-relaxed selection:bg-indigo-500 selection:text-white">
              <code>{DASHBOARD_HTML_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Step-by-Step Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                สร้าง Firebase Project (ฟรี 100% บน Spark Plan)
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-11">
              <p>
                1.1 ไปที่เว็บไซต์ <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Firebase Console</a> และล็อกอินด้วยบัญชี Google ของคุณ
              </p>
              <p>
                1.2 กดปุ่ม <strong>"Add project"</strong> (สร้างโปรเจกต์)
              </p>
              <p>
                1.3 ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-400">training-satisfaction</code> แล้วกดยอมรับเงื่อนไข
              </p>
              <p>
                1.4 หน้า Google Analytics สามารถเลือกเปิดหรือปิดก็ได้ จากนั้นกด <strong>"Create project"</strong> และรอระบบเตรียมพื้นที่ประมาณ 10 วินาที
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                เปิดใช้งาน Firebase Realtime Database
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-11">
              <p>
                2.1 ในเมนูด้านซ้าย ให้คลิกที่ <strong>Build</strong> &rarr; เลือก <strong>Realtime Database</strong>
              </p>
              <p>
                2.2 กดปุ่มสีส้ม <strong>"Create Database"</strong>
              </p>
              <p>
                2.3 <strong>เลือก Realtime Database Location:</strong> แนะนำให้เลือก <strong className="text-emerald-600 dark:text-emerald-400">Singapore (asia-southeast1)</strong> เพื่อให้การส่งและอัปเดตข้อมูลในประเทศไทยมีความรวดเร็วที่สุด
              </p>
              <p>
                2.4 ในหน้า Security Rules ให้เลือก <strong>"Start in test mode"</strong> หรือเลือก Locked mode ก่อนก็ได้ (เราจะตั้งค่ากฎในขั้นตอนถัดไป)
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                ตั้งค่า Database Security Rules (เปิดให้ผู้ตอบไม่ต้องล็อกอิน)
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3 pl-11">
              <p>
                เพื่อให้ตรงตามข้อกำหนด (ไม่ต้องล็อกอิน ไม่เก็บชื่อผู้ตอบ) ให้เข้าไปที่แท็บ <strong>"Rules"</strong> ใน Realtime Database แล้ววางกฎด้านล่างนี้:
              </p>

              <div className="relative">
                <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{sampleRules}</code>
                </pre>
                <button
                  onClick={() => handleCopy(sampleRules, 'rules')}
                  className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-mono flex items-center gap-1"
                >
                  {copiedRules ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRules ? 'คัดลอกแล้ว' : 'คัดลอก Rules'}</span>
                </button>
              </div>

              <p>
                จากนั้นกดปุ่ม <strong>"Publish"</strong> มุมขวาบนเพื่อบันทึกกฎ
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                4
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                นำค่า Firebase Config มาใส่ในโค้ดทั้ง 2 ไฟล์
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-11">
              <p>
                4.1 คลิกที่ไอคอน <strong>ฟันเฟือง (Project Settings)</strong> บริเวณเมนูซ้ายบนข้าง Project Overview
              </p>
              <p>
                4.2 เลื่อนลงมาที่หัวข้อ <strong>"Your apps"</strong> แล้วกดที่ไอคอนรูปเว็บ <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600">&lt;/&gt;</code>
              </p>
              <p>
                4.3 ตั้งชื่อแอป เช่น <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">Training App</code> แล้วกด <strong>"Register app"</strong>
              </p>
              <p>
                4.4 คัดลอกบล็อก <strong>firebaseConfig</strong> ที่ปรากฏ เช่น:
              </p>

              <div className="bg-slate-950 text-slate-300 p-4 rounded-xl text-xs font-mono border border-slate-800 space-y-1">
                <span className="text-slate-500">// ตัวอย่าง config ที่ได้:</span>
                <div>const firebaseConfig = &#123;</div>
                <div className="pl-4 text-emerald-400">apiKey: "AIzaSy...",</div>
                <div className="pl-4 text-emerald-400">authDomain: "training-satisfaction.firebaseapp.com",</div>
                <div className="pl-4 text-emerald-400">databaseURL: "https://training-satisfaction-default-rtdb.asia-southeast1.firebasedatabase.app",</div>
                <div className="pl-4 text-emerald-400">projectId: "training-satisfaction",</div>
                <div className="pl-4 text-emerald-400">storageBucket: "training-satisfaction.appspot.com",</div>
                <div className="pl-4 text-emerald-400">messagingSenderId: "958146648...",</div>
                <div className="pl-4 text-emerald-400">appId: "1:958146648:web:..."</div>
                <div>&#125;;</div>
              </div>

              <p>
                4.5 เปิดไฟล์ <strong>survey.html</strong> และ <strong>dashboard.html</strong> ด้วย Text Editor (เช่น VS Code หรือ Notepad) แล้วนำค่าดังกล่าวไปวางแทนที่ <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600">const firebaseConfig = &#123; ... &#125;;</code> ที่เตรียมไว้
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                5
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                วิธีเปิดใช้งาน &amp; นำไป Deploy ฟรี (Free Hosting Options)
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 pl-11">
              {/* Option A */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ตัวเลือก A: ทดสอบในเครื่องได้ทันที (ไม่ต้องติดตั้ง Server)</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  ดับเบิ้ลคลิกเปิดไฟล์ <code className="font-mono text-indigo-600 dark:text-indigo-400">dashboard.html</code> และ <code className="font-mono text-indigo-600 dark:text-indigo-400">survey.html</code> ด้วย Google Chrome ได้ทันที ข้อมูลจะส่งข้ามหน้าจอผ่าน Firebase Realtime Database ได้อย่างสมบูรณ์
                </p>
              </div>

              {/* Option B */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ตัวเลือก B: Deploy ผ่าน Firebase Hosting (ฟรี 100%)</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  1. ติดตั้ง Firebase CLI: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">npm install -g firebase-tools</code>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  2. พิมพ์ <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">firebase login</code> เพื่อเชื่อมโยงบัญชี
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  3. พิมพ์ <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">firebase init hosting</code> แล้วเลือกโฟลเดอร์ที่มีไฟล์ทั้งสอง
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  4. พิมพ์ <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">firebase deploy</code> จะได้ URL เว็บไซต์จริงแบบ HTTPS นำไปสร้าง QR Code และฉายโปรเจกเตอร์ได้เลย!
                </p>
              </div>

              {/* Option C */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ตัวเลือก C: GitHub Pages / Vercel / Netlify (ง่ายที่สุด ไม่ต้องใช้ Command Line)</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  เพียงนำโฟลเดอร์ที่มี <code className="font-mono text-indigo-600 dark:text-indigo-400">survey.html</code> และ <code className="font-mono text-indigo-600 dark:text-indigo-400">dashboard.html</code> ไปลากวางใน Vercel.com หรืออัปโหลดขึ้น GitHub Repository แล้วเปิด GitHub Pages จะได้ลิงก์ออนไลน์ฟรีทันทีตลอดชีพ
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
