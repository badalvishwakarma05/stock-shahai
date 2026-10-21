import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, isDeadStock, getDaysSinceSold } from '../db/db';
import { KiranaItem } from '../types';
import { sendWhatsAppOrder } from '../utils/whatsapp';
import { triggerHaptic } from '../utils/haptics';
import { useLanguage } from '../context/LanguageContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  PackageCheck,
} from 'lucide-react';

interface ReorderSheetScreenProps {
  items?: KiranaItem[];
  onOpenNumpad: (item: KiranaItem) => void;
  onQuickRestock?: (item: KiranaItem) => void;
}

export const ReorderSheetScreen: React.FC<ReorderSheetScreenProps> = ({
  items: propItems,
  onOpenNumpad,
}) => {
  const { t } = useLanguage();

  // 1. Reactive live query from Dexie IndexedDB
  const liveItems = useLiveQuery(() => db.items.toArray(), []) || [];
  const items = propItems ?? liveItems;

  // 2. Filter items into Khatam Maal (low stock) and Dead Stock
  const lowStockItems = items.filter((item) => item.stock <= item.reorderThreshold);
  const deadStockItems = items.filter((item) => isDeadStock(item.lastSoldDate));

  // 3. Trigger WhatsApp Deep Link Order with instant haptic feedback
  const handleWhatsAppClick = () => {
    triggerHaptic(50);
    sendWhatsAppOrder(
      lowStockItems,
      t('whatsappGreeting'),
      t('whatsappFallbackToast'),
      t('allStockPresentToast')
    );
  };

  const handleRefillClick = (item: KiranaItem) => {
    triggerHaptic(50);
    onOpenNumpad(item);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100 dark:bg-slate-950 relative transition-colors duration-150">
      {/* Scrollable Content Container (pb-36 ensures content is not hidden behind fixed WhatsApp button) */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-36 space-y-5 no-scrollbar">
        {/* SECTION A: Khatam Maal (Low Stock Analytics) */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-rose-950 dark:text-rose-200 uppercase tracking-wide">
                {t('sectionA')} ({lowStockItems.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
              {t('targetStock')}
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800/80 flex items-center space-x-3 shadow-sm transition-colors duration-150">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('allStockFull')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('allStockFullSub')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockItems.map((item) => {
                const deficit = Math.max(
                  1,
                  Math.round((item.reorderThreshold - item.stock) * 100) / 100
                );
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-800/95 rounded-2xl p-3.5 border-2 border-rose-200/90 dark:border-rose-800/80 bg-rose-50/30 dark:bg-rose-950/20 shadow-sm flex items-center justify-between gap-3 transition-colors duration-150"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs mt-1">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          {t('remainingStock')} {item.stock} {item.unit || ''}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {t('targetLimit')} {item.reorderThreshold} {item.unit || ''}
                        </span>
                      </div>
                      <div className="mt-1.5 inline-block bg-rose-600 dark:bg-rose-700 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-md shadow-xs">
                        {t('requireToOrder')} +{deficit} {item.unit || 'pkt'}
                      </div>
                    </div>

                    {/* Fat Refill Button (Minimum 56px touch target) */}
                    <button
                      onClick={() => handleRefillClick(item)}
                      className="h-14 min-h-14 px-3.5 bg-slate-900 dark:bg-slate-700 hover:dark:bg-slate-600 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center touch-active active:scale-95 active:brightness-90 transition-all duration-150 flex-shrink-0 shadow-sm"
                      aria-label={`${item.name} ${t('refillBtn')}`}
                    >
                      <span>{t('refillBtn')}</span>
                      <span className="text-emerald-400 text-[10px]">{t('refillSub')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION B: Dead Stock / Ruka Hua Maal (>20 days idle) */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                {t('sectionB')} ({deadStockItems.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              &gt;20 {t('daysIdle')}
            </span>
          </div>

          {deadStockItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm transition-colors duration-150">
              <PackageCheck className="w-6 h-6 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('noDeadStock')}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t('noDeadStockSub')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {deadStockItems.map((item) => {
                const daysIdle = getDaysSinceSold(item.lastSoldDate);
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-800/95 rounded-2xl p-3.5 border border-amber-200 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm flex items-center justify-between gap-3 transition-colors duration-150"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold uppercase bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-300/40 dark:border-amber-700/60">
                          {daysIdle} {t('daysOldSuffix')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                        {item.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('idleInShop')} <strong className="text-amber-800 dark:text-amber-400">{item.stock} {item.unit || ''}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRefillClick(item)}
                      className="h-12 min-h-12 px-3 bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center touch-active active:scale-95 active:brightness-90 transition-all duration-150 flex-shrink-0 border border-amber-300 dark:border-amber-700"
                    >
                      {t('updateBtn')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* MASSIVE FIXED BOTTOM DEEP LINK BUTTON */}
      <button
        onClick={handleWhatsAppClick}
        disabled={lowStockItems.length === 0}
        className={`fixed bottom-16 w-[90%] left-[5%] max-w-[calc(28rem*0.9)] right-[5%] mx-auto h-14 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg touch-active active:scale-95 active:brightness-90 transition-all duration-150 z-20 text-base ${
          lowStockItems.length === 0
            ? 'opacity-50 cursor-not-allowed bg-slate-300 dark:bg-slate-800 dark:text-slate-500 shadow-none'
            : 'shadow-green-500/30'
        }`}
        aria-label={t('whatsappBtn')}
      >
        <span>{t('whatsappBtn')}</span>
      </button>
    </div>
  );
};
