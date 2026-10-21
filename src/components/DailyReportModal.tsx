import React from 'react';
import { X } from 'lucide-react';
import { KiranaItem } from '../types';
import { resetDailySales } from '../db/db';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';
import toast from 'react-hot-toast';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: KiranaItem[];
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const { getItemName, formatUnit } = useLanguage();

  if (!isOpen) return null;

  const soldItems = items.filter((item) => (item.soldToday || 0) > 0);

  const handleEndDay = async () => {
    triggerHaptic(50);
    await resetDailySales();
    toast.success('दिन समाप्त किया गया! आज की बिक्री रीसेट हो गई।', { icon: '🌙' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-4 shadow-xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>📊</span> आज की रिपोर्ट
          </h3>
          <button
            onClick={() => {
              triggerHaptic(50);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Sold Items */}
        <div className="py-2">
          {soldItems.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center font-medium">
              आज कोई बिक्री नहीं हुई
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 py-1 pr-1 no-scrollbar">
              {soldItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 px-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-sm border border-slate-100 dark:border-slate-700/60"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                    {getItemName(item)}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-xs bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
                    {item.soldToday} {formatUnit(item.unit)} बिका
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Day Button */}
        <button
          onClick={handleEndDay}
          className="w-full mt-2 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
        >
          दिन समाप्त करें
        </button>
      </div>
    </div>
  );
};
