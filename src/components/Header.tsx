import React from 'react';
import { Store, WifiOff, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white px-4 pt-3 pb-3 border-b border-slate-800 shadow-md flex-shrink-0 z-20">
      <div className="flex items-center justify-between">
        {/* Brand & Shop Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-bold tracking-tight text-white leading-none">
                Apna Digital Khata
              </h1>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Kirana Stock & Reorder Sheet
            </p>
          </div>
        </div>

        {/* Static Green Offline Badge */}
        <div className="flex items-center bg-emerald-950/80 border border-emerald-600/50 px-2.5 py-1.5 rounded-full shadow-inner">
          <span className="relative flex h-2.5 w-2.5 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-300 tracking-wide">
            Offline Mode
          </span>
        </div>
      </div>
    </header>
  );
};
