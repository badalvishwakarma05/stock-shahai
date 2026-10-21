import React, { useState, useEffect } from 'react';
import { Store, WifiOff } from 'lucide-react';

interface HeaderProps {
  isOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isOnline: propIsOnline }) => {
  const [internalOnline, setInternalOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setInternalOnline(true);
    const handleOffline = () => setInternalOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOnline = propIsOnline ?? internalOnline;

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

        {/* Dynamic Online / Offline Indicator Badge */}
        {isOnline ? (
          <div
            className="flex items-center bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-full shadow-inner"
            title="Online"
          >
            <span className="relative flex h-2 w-2 mr-1.5">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-300 tracking-wide">
              Online
            </span>
          </div>
        ) : (
          <div
            className="flex items-center bg-amber-500/20 border border-amber-500/50 px-2.5 py-1.5 rounded-full shadow-inner animate-pulse"
            title="App is Offline - Working Locally"
          >
            <WifiOff className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300 tracking-tight">
              App is Offline - Working Locally
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
