import React from 'react';
import { PackageMinus, ClipboardList, AlertTriangle } from 'lucide-react';
import { ActiveTab } from '../types';

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
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 z-30 shadow-thumb select-none">
      <div className="grid grid-cols-2 h-16">
        {/* Tab 1: Sales Entry */}
        <button
          onClick={() => onTabChange('sales')}
          className={`flex flex-col items-center justify-center h-full min-h-14 transition-colors touch-active relative ${
            activeTab === 'sales'
              ? 'text-emerald-700 bg-emerald-50/70 font-bold border-t-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Sales Entry Tab"
        >
          <div className="relative">
            <PackageMinus className={`w-6 h-6 ${activeTab === 'sales' ? 'text-emerald-600 stroke-[2.4]' : 'text-slate-400'}`} />
          </div>
          <span className="text-[12px] mt-0.5 tracking-tight">
            📦 Sales Entry
          </span>
          <span className="text-[10px] text-slate-400 font-normal leading-none">
            Maal Becha
          </span>
        </button>

        {/* Tab 2: Reorder Sheet */}
        <button
          onClick={() => onTabChange('reorder')}
          className={`flex flex-col items-center justify-center h-full min-h-14 transition-colors touch-active relative ${
            activeTab === 'reorder'
              ? 'text-emerald-700 bg-emerald-50/70 font-bold border-t-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Reorder Sheet Tab"
        >
          <div className="relative">
            <ClipboardList className={`w-6 h-6 ${activeTab === 'reorder' ? 'text-emerald-600 stroke-[2.4]' : 'text-slate-400'}`} />
            {reorderCount > 0 && (
              <span className="absolute -top-1.5 -right-3.5 bg-rose-600 text-white text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-md border-2 border-white animate-pulse">
                {reorderCount}
              </span>
            )}
          </div>
          <span className="text-[12px] mt-0.5 tracking-tight flex items-center gap-1">
            📝 Reorder Sheet
          </span>
          <span className="text-[10px] text-slate-400 font-normal leading-none">
            Khatam Maal
          </span>
        </button>
      </div>
    </nav>
  );
};
