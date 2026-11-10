import React from 'react';
import { QrCode, FileText, Monitor, CheckSquare, Download } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'survey' | 'qr' | 'code-guide';
  onSelectTab: (tab: 'dashboard' | 'survey' | 'qr' | 'code-guide') => void;
  onExportCSV: () => void;
  isProjectorMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onExportCSV,
  isProjectorMode,
}) => {
  if (isProjectorMode) {
    return null; // In dedicated projector fullscreen mode, header is hidden for maximum slide area
  }

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            TS
          </div>
          <span className="hidden sm:inline">ระบบประเมินความพึงพอใจการอบรม</span>
          <span className="sm:hidden">ระบบประเมิน</span>
        </div>

        {/* Zone 2: 4 clean single-line navigation tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Dashboard สด</span>
          </button>

          <button
            onClick={() => onSelectTab('survey')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'survey'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>หน้าแบบสอบถาม</span>
          </button>

          <button
            onClick={() => onSelectTab('qr')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'qr'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR &amp; ลิงก์ตอบ</span>
          </button>

          <button
            onClick={() => onSelectTab('code-guide')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'code-guide'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>โค้ด 2 ไฟล์ &amp; Firebase</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            title="ดาวน์โหลดผลการประเมินเป็นไฟล์ CSV สำหรับ Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ดาวน์โหลด CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
