/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SurveyView } from './components/SurveyView';
import { QrCodeModal } from './components/QrCodeModal';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { SurveyStats } from './types';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const INITIAL_STATS: SurveyStats = {
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'survey' | 'qr' | 'code-guide'>('dashboard');
  const [stats, setStats] = useState<SurveyStats>(INITIAL_STATS);
  const [isLive, setIsLive] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine survey URL for QR code (using origin + ?view=survey)
  const [surveyUrl, setSurveyUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'survey');
      setSurveyUrl(url.toString());

      // If user landed with ?view=survey, default directly to survey tab!
      const initialView = new URLSearchParams(window.location.search).get('view');
      if (initialView === 'survey') {
        setCurrentTab('survey');
      } else if (initialView === 'qr') {
        setCurrentTab('qr');
      } else if (initialView === 'code-guide') {
        setCurrentTab('code-guide');
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // SSE Real-time Subscription
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimer: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          setIsLive(true);
        };

        eventSource.addEventListener('init', (e: any) => {
          try {
            const data = JSON.parse(e.data);
            if (data.stats) setStats(data.stats);
          } catch (err) {
            console.error('Error parsing init event', err);
          }
        });

        eventSource.addEventListener('new_response', (e: any) => {
          try {
            const data = JSON.parse(e.data);
            if (data.stats) {
              setStats(data.stats);
              showToast('🎉 มีผู้ตอบแบบประเมินรายใหม่เข้ามาแล้ว!');
            }
          } catch (err) {
            console.error('Error parsing new_response event', err);
          }
        });

        eventSource.addEventListener('reset', (e: any) => {
          try {
            const data = JSON.parse(e.data);
            if (data.stats) setStats(data.stats);
          } catch (err) {
            console.error('Error parsing reset event', err);
          }
        });

        eventSource.addEventListener('seed', (e: any) => {
          try {
            const data = JSON.parse(e.data);
            if (data.stats) setStats(data.stats);
          } catch (err) {
            console.error('Error parsing seed event', err);
          }
        });

        eventSource.onerror = () => {
          setIsLive(false);
          eventSource?.close();
          retryTimer = setTimeout(connectSSE, 4000);
        };
      } catch (e) {
        setIsLive(false);
        retryTimer = setTimeout(connectSSE, 5000);
      }
    };

    connectSSE();

    // Initial fetch fallback
    fetch('/api/responses')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.warn('Initial fetch error', err));

    return () => {
      if (eventSource) eventSource.close();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // Handlers
  const handleExportCSV = useCallback(() => {
    window.open('/api/export-csv', '_blank');
  }, []);

  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 12 }),
      });
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      showToast('เพิ่มข้อมูลตัวอย่าง 12 รายการเรียบร้อยแล้ว');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเพิ่มข้อมูลตัวอย่าง');
    }
  };

  const handleResetData = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      setShowResetConfirm(false);
      showToast('ล้างข้อมูลแบบประเมินทั้งหมดเรียบร้อยแล้ว');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการล้างข้อมูล');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors ${isProjectorMode ? 'dark' : ''}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onExportCSV={handleExportCSV}
        isProjectorMode={isProjectorMode}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            surveyUrl={surveyUrl}
            isLive={isLive}
            onOpenQR={() => setIsQrModalOpen(true)}
            onExportCSV={handleExportCSV}
            onSeedData={handleSeedData}
            onResetData={() => setShowResetConfirm(true)}
            isProjectorMode={isProjectorMode}
            onToggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
          />
        )}

        {currentTab === 'survey' && (
          <SurveyView
            onSubmitSuccess={() => {
              showToast('ส่งแบบประเมินสำเร็จ! ขอบคุณสำหรับการมีส่วนร่วม');
            }}
          />
        )}

        {currentTab === 'qr' && (
          <div className="max-w-md mx-auto py-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                QR Code สำหรับผู้เข้าร่วมอบรม
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ฉายภาพ QR Code นี้บนจอโปรเจกเตอร์เพื่อให้ผู้เข้าอบรมสแกนตอบแบบประเมินผ่านสมาร์ทโฟน
              </p>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
              >
                เปิดหน้าต่าง QR Code ขยายใหญ่
              </button>
              <div className="pt-2 text-xs text-slate-400 font-mono break-all">
                ลิงก์ตรง: {surveyUrl}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'code-guide' && <FirebaseGuideView />}
      </main>

      {/* QR Code Popup Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen || currentTab === 'qr'}
        onClose={() => {
          setIsQrModalOpen(false);
          if (currentTab === 'qr') setCurrentTab('dashboard');
        }}
        surveyUrl={surveyUrl}
      />

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ยืนยันการล้างข้อมูลทั้งหมด?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ข้อมูลการตอบแบบสอบถามทั้งหมด ({stats.total} รายการ) จะถูกลบทันที การกระทำนี้ไม่สามารถย้อนกลับได้
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleResetData}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                ล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
