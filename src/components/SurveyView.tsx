import React, { useState, useEffect } from 'react';
import { QUESTIONS } from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, Sparkles, AlertCircle, RefreshCw, Star } from 'lucide-react';

interface SurveyViewProps {
  onSubmitSuccess?: () => void;
}

const LOCAL_STORAGE_KEY = 'training_survey_submitted_token';

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmitSuccess }) => {
  const [scores, setScores] = useState<Record<number, number | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState('');
  const [submittedScores, setSubmittedScores] = useState<number[]>([]);

  // Check duplicate submission on mount
  useEffect(() => {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existing) {
      setIsSubmitted(true);
      try {
        const parsed = JSON.parse(existing);
        if (parsed.submittedAt) setSubmissionTime(parsed.submittedAt);
        if (parsed.scores) setSubmittedScores(parsed.scores);
      } catch {
        // legacy string token
      }
    }
  }, []);

  const answeredCount = Object.values(scores).filter((val) => val !== null).length;
  const progressPct = (answeredCount / 5) * 100;

  const handleSelectScore = (questionId: number, scoreVal: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: scoreVal,
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check all 5 questions answered
    const unanswered = [1, 2, 3, 4, 5].filter((q) => scores[q] === null);
    if (unanswered.length > 0) {
      setErrorMessage(`กรุณาตอบคำถามข้อที่ ${unanswered.join(', ')} ให้ครบทั้ง 5 ข้อ`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get or create unique device token
      let deviceToken = localStorage.getItem('device_unique_token');
      if (!deviceToken) {
        deviceToken = 'dev_' + Math.random().toString(36).substring(2) + Date.now();
        localStorage.setItem('device_unique_token', deviceToken);
      }

      const scoreArray = [scores[1]!, scores[2]!, scores[3]!, scores[4]!, scores[5]!];

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: scoreArray,
          feedback: feedback.trim(),
          deviceToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      // Record in localStorage to prevent duplicate submissions
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          submittedAt: nowStr,
          scores: scoreArray,
        })
      );

      setSubmissionTime(nowStr);
      setSubmittedScores(scoreArray);
      setIsSubmitted(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas not supported
      }

      onSubmitSuccess?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsSubmitted(false);
    setScores({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setFeedback('');
    setErrorMessage('');
  };

  // Completion / Already Submitted Screen
  if (isSubmitted) {
    const avgScore = submittedScores.length === 5 
      ? (submittedScores.reduce((a, b) => a + b, 0) / 5).toFixed(2)
      : null;

    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 my-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              ส่งแบบประเมินเรียบร้อยแล้ว
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {submissionTime ? `บันทึกเมื่อเวลา ${submissionTime} น.` : 'ระบบได้รับข้อมูลของคุณแล้ว'}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ขอขอบพระคุณที่สละเวลาให้ข้อเสนอแนะอันมีค่า ข้อมูลนี้จะนำไปใช้ในการพัฒนาและปรับปรุงหลักสูตรการฝึกอบรมในอนาคตให้ดียิ่งขึ้น
          </p>

          {avgScore && (
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-200 space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span>คะแนนความพึงพอใจเฉลี่ยที่คุณให้:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-base font-mono">
                  {avgScore} / 5.00
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {submittedScores.map((s, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-1.5 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">ข้อ {idx + 1}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{s}★</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleResetForTesting}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>(สำหรับผู้จัด/ผู้ทดสอบ) ล้างการส่งเพื่อตอบใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Survey Form (Mobile-First)
  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-5">
      {/* Questionnaire Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              แบบประเมินความพึงพอใจการฝึกอบรม
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ไม่ต้องระบุชื่อ ไม่เก็บข้อมูลส่วนบุคคล ตอบได้ง่ายใน 1 นาที
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>ความคืบหน้าการตอบ</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
              {answeredCount} จาก 5 ข้อ ({Math.round(progressPct)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Rating Scale Legend */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 flex justify-between text-center">
          <div><strong className="text-slate-800 dark:text-slate-100">1</strong> = น้อยที่สุด</div>
          <div><strong className="text-slate-800 dark:text-slate-100">2</strong> = น้อย</div>
          <div><strong className="text-slate-800 dark:text-slate-100">3</strong> = ปานกลาง</div>
          <div><strong className="text-slate-800 dark:text-slate-100">4</strong> = มาก</div>
          <div><strong className="text-slate-800 dark:text-slate-100">5</strong> = มากที่สุด</div>
        </div>
      </div>

      {/* Questions List */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {QUESTIONS.map((q) => {
          const selectedVal = scores[q.id];

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
                selectedVal !== null
                  ? 'border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.title}
                  </h3>
                  {selectedVal !== null && (
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {q.description}
                </p>
              </div>

              {/* 5 Thumb-Friendly Touch Buttons */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = selectedVal === val;

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectScore(q.id, val)}
                      className={`h-13 sm:h-14 rounded-xl font-bold text-base sm:text-lg flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102 ring-2 ring-indigo-300 dark:ring-indigo-800'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <span className="font-mono">{val}</span>
                      <span className="text-[9px] font-normal opacity-80 leading-none mt-0.5">
                        {val === 1 && 'น้อยสุด'}
                        {val === 2 && 'น้อย'}
                        {val === 3 && 'ปานกลาง'}
                        {val === 4 && 'มาก'}
                        {val === 5 && 'มากที่สุด'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Feedback Section (Optional) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
          <label htmlFor="feedbackInput" className="block text-sm font-semibold text-slate-900 dark:text-white">
            ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ระบุข้อคิดเห็น สิ่งที่ชื่นชอบ หรือสิ่งที่ควรปรับปรุงสำหรับการจัดอบรมในครั้งต่อไป
          </p>
          <textarea
            id="feedbackInput"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="พิมพ์ข้อเสนอแนะที่นี่..."
            maxLength={1000}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-right text-[11px] text-slate-400 font-mono">
            {feedback.length}/1000 ตัวอักษร
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold text-base shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
        >
          {isSubmitting ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบประเมินความพึงพอใจ'}</span>
        </button>

        <p className="text-center text-[11px] text-slate-400 pb-4">
          กดส่งแล้วข้อมูลจะแสดงบนหน้าจอของผู้จัดอบรมแบบเรียลไทม์ทันที
        </p>
      </form>
    </div>
  );
};
