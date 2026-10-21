import React from 'react';
import { Plus, Minus, Edit3, AlertCircle } from 'lucide-react';
import { KiranaItem } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { useLanguage } from '../context/LanguageContext';

interface ItemCardProps {
  item: KiranaItem;
  onIncrement: (item: KiranaItem) => void;
  onDecrement: (item: KiranaItem) => void;
  onOpenNumpad: (item: KiranaItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onIncrement,
  onDecrement,
  onOpenNumpad,
}) => {
  const { t } = useLanguage();
  // Dynamically calculate low stock status
  const isLowStock = item.stock <= item.reorderThreshold;

  const handleIncrementClick = () => {
    triggerHaptic(50);
    onIncrement(item);
  };

  const handleDecrementClick = () => {
    triggerHaptic(50);
    onDecrement(item);
  };

  const handleStockClick = () => {
    triggerHaptic(50);
    onOpenNumpad(item);
  };

  return (
    <div
      className={`rounded-2xl p-3.5 shadow-sm border transition-all ${
        isLowStock
          ? 'border-rose-300 dark:border-rose-800/90 bg-rose-50/20 dark:bg-rose-950/25'
          : 'bg-white dark:bg-slate-800/95 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Item Info & Tappable Stock Counter */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
              {item.name}
            </h2>
          </div>

          <div className="mt-1.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs">
            {/* Reorder limit pill */}
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {t('reorderLimit')} <strong className="text-slate-700 dark:text-slate-200">{item.reorderThreshold} {item.unit || ''}</strong>
            </span>

            {/* Low stock badge: Dynamic "Kam Hai!" tag */}
            {isLowStock ? (
              <span className="inline-flex items-center text-[11px] font-bold text-rose-600 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200/80 dark:border-rose-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                {t('outOfStock')}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                {t('inStock')}
              </span>
            )}
          </div>

          {/* Tappable Stock Badge - Opens Custom Sliding Numpad */}
          <button
            onClick={handleStockClick}
            className="mt-2.5 inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 active:brightness-90 transition-all duration-150 px-3 py-1.5 rounded-xl border border-slate-300/80 dark:border-slate-600 touch-active"
            title={t('tapToEdit')}
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('stockLabel')}</span>
            <span
              className={`text-lg font-black tracking-tight ${
                isLowStock ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {item.stock}
            </span>
            {item.unit && (
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {item.unit}
              </span>
            )}
            <Edit3 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 ml-1" />
          </button>
        </div>

        {/* Right Side: Fat Finger Targets for Instant 1-Tap (+ / -) Updates */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Decrement Button (-) Minimum 56px (h-14 w-14) */}
          <button
            onClick={handleDecrementClick}
            disabled={item.stock <= 0}
            className={`w-14 h-14 min-w-14 min-h-14 rounded-2xl flex items-center justify-center shadow-md touch-active active:scale-95 active:brightness-90 transition-all duration-150 ${
              item.stock <= 0
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-800 active:bg-rose-600 active:text-white'
            }`}
            aria-label={`${item.name} ${t('decrementAria')}`}
          >
            <Minus className="w-7 h-7 stroke-[2.8]" />
          </button>

          {/* Increment Button (+) Minimum 56px (h-14 w-14) */}
          <button
            onClick={handleIncrementClick}
            className="w-14 h-14 min-w-14 min-h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 touch-active active:scale-95 active:brightness-90 transition-all duration-150 border-2 border-emerald-500 dark:border-emerald-400"
            aria-label={`${item.name} ${t('incrementAria')}`}
          >
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </button>
        </div>
      </div>
    </div>
  );
};
