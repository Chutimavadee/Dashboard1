import React, { useState } from 'react';
import { SurveyStats, QUESTIONS, getLikertInterpretation } from '../types';
import { 
  Users, 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  QrCode, 
  Download, 
  RotateCcw, 
  PlusCircle, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  HelpCircle,
  Copy
} from 'lucide-react';

interface DashboardViewProps {
  stats: SurveyStats;
  surveyUrl: string;
  isLive: boolean;
  onOpenQR: () => void;
  onExportCSV: () => void;
  onSeedData: () => void;
  onResetData: () => void;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  surveyUrl,
  isLive,
  onOpenQR,
  onExportCSV,
  onSeedData,
  onResetData,
  isProjectorMode,
  onToggleProjectorMode,
}) => {
  const [showDistribution, setShowDistribution] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const overallInterpretation = getLikertInterpretation(stats.overallMean);
  const satisfactionPct = stats.total > 0 ? Math.round((stats.overallMean / 5) * 100) : 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredFeedback = stats.recentFeedback.filter((item) =>
    item.feedback.toLowerCase().includes(feedbackSearch.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'p-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen bg-slate-950 text-white' : ''}`}>
      {/* Top Banner / Projector Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isLive ? 'เชื่อมต่อสดแบบเรียลไทม์ (Live SSE)' : 'ออฟไลน์ (กำลังเชื่อมต่อใหม่)'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {stats.total > 0 ? `อัปเดตล่าสุด: ${stats.recentFeedback[0]?.submittedAt || 'เมื่อสักครู่'}` : 'พร้อมรับคำตอบ'}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
            สรุปผลการประเมินความพึงพอใจการฝึกอบรม
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            แสดงผลคะแนนเฉลี่ย (x̄) และค่าเบี่ยงเบนมาตรฐาน (S.D.) อัปเดตขึ้นจอทันทีที่มีผู้ส่งแบบสอบถาม
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleProjectorMode}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="สลับโหมดจอโปรเจกเตอร์ขนาดใหญ่"
          >
            {isProjectorMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isProjectorMode ? 'ย่อหน้าจอ' : 'จอโปรเจกเตอร์'}</span>
          </button>

          <button
            onClick={onOpenQR}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>เปิด QR Code ใหญ่</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={onSeedData}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="เพิ่มข้อมูลตัวอย่าง 12 รายการเพื่อทดสอบการแสดงผลสด"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>+ ข้อมูลทดสอบ</span>
          </button>

          <button
            onClick={onResetData}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="ล้างข้อมูลทั้งหมดเพื่อเริ่มรอบใหม่"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Quick QR & Link Bar (Helpful for in-room projector presentation) */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div 
            onClick={onOpenQR}
            className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
          >
            <QrCode className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              สแกน QR Code หรือเปิดลิงก์เพื่อทำแบบสอบถาม
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all line-clamp-1">
              {surveyUrl}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
          </button>
          <button
            onClick={onOpenQR}
            className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>ขยาย QR เต็มจอ</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Respondents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">จำนวนผู้ตอบแบบประเมิน</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">คน</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {stats.total > 0 ? 'บันทึกคำตอบอัตโนมัติ' : 'รอรับการส่งคำตอบแรก'}
          </div>
        </div>

        {/* Card 2: Overall Mean Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">คะแนนเฉลี่ยรวม (x̄)</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums tracking-tight">
              {stats.overallMean.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 5.00</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">ระดับ:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${overallInterpretation.bg} ${overallInterpretation.color}`}>
              {overallInterpretation.label}
            </span>
          </div>
        </div>

        {/* Card 3: Overall Standard Deviation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">ส่วนเบี่ยงเบนมาตรฐาน (S.D.)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">
              {stats.overallSD.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ค่ากระจาย</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {stats.overallSD <= 0.5 ? 'ความคิดเห็นเป็นเอกฉันท์สูง' : 'ความคิดเห็นมีความหลากหลาย'}
          </div>
        </div>

        {/* Card 4: Satisfaction Percent */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">ร้อยละความพึงพอใจ</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-mono tabular-nums tracking-tight">
              {satisfactionPct}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">เทียบเต็ม 100%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${satisfactionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Bar Chart & Likert Rubric (2 Columns Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Bar Chart & Questions Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                เปรียบเทียบคะแนนเฉลี่ยรายข้อ (สเกล 1 - 5)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                วิเคราะห์ความพึงพอใจใน 5 มิติของการจัดการฝึกอบรม
              </p>
            </div>
            
            <button
              onClick={() => setShowDistribution(!showDistribution)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
            >
              {showDistribution ? 'ซ่อนการแจกแจงดาว' : 'ดูการแจกแจงดาว (1-5)'}
            </button>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="space-y-4 pt-2">
            {QUESTIONS.map((q, idx) => {
              const mean = stats.questionMeans[idx];
              const sd = stats.questionSDs[idx];
              const level = getLikertInterpretation(mean);
              const barWidthPct = stats.total > 0 ? (mean / 5) * 100 : 0;
              const dist = stats.distribution[idx] || [0, 0, 0, 0, 0];

              return (
                <div key={q.id} className="space-y-2 p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {q.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                        x̄ = {mean.toFixed(2)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] tabular-nums">
                        (S.D. = {sd.toFixed(2)})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${level.bg} ${level.color}`}>
                        {level.label}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Track */}
                  <div className="relative w-full h-4 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    {/* Tick markers for 1, 2, 3, 4, 5 */}
                    <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10 opacity-30">
                      <div className="w-0.5 h-full bg-slate-400" />
                      <div className="w-0.5 h-full bg-slate-400" />
                      <div className="w-0.5 h-full bg-slate-400" />
                      <div className="w-0.5 h-full bg-slate-400" />
                      <div className="w-0.5 h-full bg-slate-400" />
                    </div>

                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>

                  {/* Distribution breakdown */}
                  {showDistribution && stats.total > 0 && (
                    <div className="pt-2 flex items-center justify-between gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      {[1, 2, 3, 4, 5].map((star, sIdx) => {
                        const count = dist[sIdx] || 0;
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={star} className="text-center flex-1">
                            <span className="text-amber-500 font-semibold">{star}★:</span> {count} คน ({pct}%)
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state prompt if total is 0 */}
          {stats.total === 0 && (
            <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <BarChart3 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                ยังไม่มีการส่งแบบประเมิน
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                สแกน QR Code จากมือถือ หรือกดปุ่ม <strong>"+ ข้อมูลทดสอบ"</strong> ด้านบนเพื่อทดสอบการแสดงผลและกราฟ
              </p>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Likert Scale Rubric & Real-Time Feedback */}
        <div className="space-y-6">
          {/* Likert Scale Reference Standard */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                เกณฑ์การแปลผล Likert 5 ระดับ
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  4.51 - 5.00
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">มากที่สุด (Highest)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  3.51 - 4.50
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">มาก (High)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  2.51 - 3.50
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">ปานกลาง (Moderate)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  1.51 - 2.50
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400">น้อย (Low)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  1.00 - 1.50
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">น้อยที่สุด (Lowest)</span>
              </div>
            </div>
          </div>

          {/* Real-time Suggestions Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะล่าสุด
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {stats.recentFeedback.length} ข้อความ
              </span>
            </div>

            {stats.recentFeedback.length > 3 && (
              <input
                type="text"
                placeholder="ค้นหาข้อเสนอแนะ..."
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            )}

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                        เฉลี่ย {item.averageScore.toFixed(1)} ★
                      </span>
                      <span className="font-mono">{item.submittedAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                      "{item.feedback}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  {stats.recentFeedback.length === 0
                    ? 'ยังไม่มีข้อเสนอแนะจากผู้ตอบ'
                    : 'ไม่พบข้อความที่ตรงกับการค้นหา'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
