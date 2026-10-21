import React from 'react';
import { PackageMinus, ClipboardList } from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  reorderCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  reorderCount,
}) => {
  const { t } = useLanguage();

  const handleTabClick = (tab: ActiveTab) => {
    triggerHaptic(50);
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 shadow-thumb select-none transition-colors duration-150">
      <div className="grid grid-cols-2 h-16">
        {/* Tab 1: Sales Entry */}
        <button
          onClick={() => handleTabClick('sales')}
          className={`flex flex-col items-center justify-center h-full min-h-14 transition-colors touch-active active:scale-95 active:brightness-90 duration-150 relative ${
            activeTab === 'sales'
              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 font-bold border-t-2 border-emerald-600 dark:border-emerald-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label={t('salesEntry')}
        >
          <div className="relative">
            <PackageMinus className={`w-6 h-6 ${activeTab === 'sales' ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.4]' : 'text-slate-400 dark:text-slate-500'}`} />
          </div>
          <span className="text-[12px] mt-0.5 tracking-tight font-semibold">
            {t('salesTab')}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-none">
            {t('salesEntrySub')}
          </span>
        </button>

        {/* Tab 2: Reorder Sheet */}
        <button
          onClick={() => handleTabClick('reorder')}
          className={`flex flex-col items-center justify-center h-full min-h-14 transition-colors touch-active active:scale-95 active:brightness-90 duration-150 relative ${
            activeTab === 'reorder'
              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 font-bold border-t-2 border-emerald-600 dark:border-emerald-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label={t('reorderTab')}
        >
          <div className="relative">
            <ClipboardList className={`w-6 h-6 ${activeTab === 'reorder' ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.4]' : 'text-slate-400 dark:text-slate-500'}`} />
            {reorderCount > 0 && (
              <span className="absolute -top-1.5 -right-3.5 bg-rose-600 text-white text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 animate-pulse">
                {reorderCount}
              </span>
            )}
          </div>
          <span className="text-[12px] mt-0.5 tracking-tight font-semibold">
            {t('reorderTab')}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-none">
            {t('reorderSheetSub')}
          </span>
        </button>
      </div>
    </nav>
  );
};
