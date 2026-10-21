import React, { useState, useEffect } from 'react';
import { Store, WifiOff, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  isOnline?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOnline: propIsOnline, userName, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

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

  const handleThemeClick = () => {
    triggerHaptic(50);
    toggleTheme();
  };

  const handleLanguageClick = () => {
    triggerHaptic(50);
    toggleLanguage();
  };

  const handleLogout = () => {
    triggerHaptic(50);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 pt-2.5 pb-2.5 border-b border-slate-800 dark:border-slate-800/80 shadow-md flex-shrink-0 z-20 transition-colors duration-150">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand & Shop Title */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md flex-shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            {userName ? (
              <>
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white leading-none truncate">
                  {t('greetingPrefix')} {userName}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium mt-0.5 truncate">
                  {t('appSubtitle')}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white leading-none truncate">
                  {t('appName')}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium mt-0.5 truncate">
                  {t('appSubtitle')}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: Tactile Quick Controls & Offline Indicator */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {/* Language Toggle Button - Fat-Finger Friendly */}
          <button
            onClick={handleLanguageClick}
            className="h-10 min-w-[56px] px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center space-x-1.5 shadow-sm touch-active active:scale-95 active:brightness-90 transition-all duration-150"
            aria-label={t('langToggleAria')}
            title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
          >
            <span className="text-emerald-400 font-extrabold text-xs">A/अ</span>
            <span className="font-bold text-xs tracking-tight text-slate-100">
              {language === 'en' ? 'हिंदी' : 'EN'}
            </span>
          </button>

          {/* Theme Toggle Button (Sun/Moon - Fat-Finger Friendly) */}
          <button
            onClick={handleThemeClick}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 flex items-center justify-center shadow-sm touch-active active:scale-95 active:brightness-90 transition-all duration-150"
            aria-label={t('themeToggleAria')}
            title={theme === 'dark' ? t('themeDarkTooltip') : t('themeLightTooltip')}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 stroke-[2.2]" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-300 stroke-[2.2]" />
            )}
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-900/40 active:bg-red-800/50 border border-slate-700 hover:border-red-700/50 text-slate-400 hover:text-red-400 flex items-center justify-center shadow-sm active:scale-95 active:brightness-90 transition-all duration-150"
              aria-label={t('logoutBtn')}
              title={t('logoutBtn')}
            >
              <LogOut className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>
          )}

          {/* Dynamic Online / Offline Indicator Badge */}
          {isOnline ? (
            <div
              className="flex items-center bg-slate-800/90 border border-slate-700 px-2 py-1.5 rounded-xl shadow-inner"
              title={t('online')}
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-semibold text-slate-300 hidden xs:inline">
                {t('online')}
              </span>
            </div>
          ) : (
            <div
              className="flex items-center bg-amber-500/20 border border-amber-500/50 px-2 py-1.5 rounded-xl shadow-inner animate-pulse"
              title={t('offline')}
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

