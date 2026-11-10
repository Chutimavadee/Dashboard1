import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, CheckCircle2, Download, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  surveyUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [trainingTitle, setTrainingTitle] = useState('การฝึกอบรมพัฒนาทักษะและการทำงาน');

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        surveyUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'training_survey_qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition-colors"
          title="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mx-auto">
            <QrIcon className="w-3.5 h-3.5" />
            <span>สแกนทำแบบสอบถาม</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            สแกน QR Code ผ่านมือถือ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ผู้เข้าร่วมอบรมสามารถเปิดกล้องมือถือแล้วสแกนเพื่อทำแบบสอบถามได้ทันที
          </p>
        </div>

        {/* Editable Title for Projector Display */}
        <div className="text-left bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            หัวข้อการอบรม (แก้ไขได้):
          </label>
          <input
            type="text"
            value={trainingTitle}
            onChange={(e) => setTrainingTitle(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>

        {/* High Resolution QR Canvas */}
        <div className="bg-white p-4 rounded-2xl shadow-inner inline-block border border-slate-200 dark:border-slate-700">
          <canvas ref={canvasRef} className="mx-auto max-w-full rounded-lg" />
        </div>

        {/* Survey URL Display & Copy */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              readOnly
              value={surveyUrl}
              className="bg-transparent text-xs text-slate-600 dark:text-slate-300 font-mono flex-1 outline-none px-1 truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDownloadQR}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>ดาวน์โหลด QR (PNG)</span>
            </button>
            <a
              href={surveyUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              <span>เปิดหน้าตอบในแท็บใหม่</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
