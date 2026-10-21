import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { ItemCard } from './ItemCard';
import { KiranaItem } from '../types';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';
import { DailyReportModal } from './DailyReportModal';

interface SalesEntryScreenProps {
  items?: KiranaItem[];
  onIncrement: (item: KiranaItem) => void;
  onDecrement: (item: KiranaItem) => void;
  onOpenNumpad: (item: KiranaItem) => void;
  onOpenAddItem: () => void;
}

export const SalesEntryScreen: React.FC<SalesEntryScreenProps> = ({
  items: propItems,
  onIncrement,
  onDecrement,
  onOpenNumpad,
  onOpenAddItem,
}) => {
  const { t } = useLanguage();
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Live reactive query directly from Dexie IndexedDB
  const liveItems = useLiveQuery(() => db.items.toArray(), []) || [];
  const items = propItems ?? liveItems;

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Categories with localized labels
  const categories = [
    { id: 'ALL', label: t('catAll') },
    { id: 'LOW', label: t('catLowStock') },
    { id: 'Aata & Dals', label: t('catAataDals') },
    { id: 'Snacks', label: t('catSnacks') },
    { id: 'Masala & Spices', label: t('catMasala') },
    { id: 'Oils & Ghee', label: t('catOilGhee') },
    { id: 'Dairy', label: t('catDairy') },
  ];

  // Filter items without needing an on-screen keyboard
  const filteredItems = items.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'LOW') return item.stock <= item.reorderThreshold;
    return item.category === activeCategory;
  });

  const lowStockCount = items.filter((i) => i.stock <= i.reorderThreshold).length;

  const handleCategorySelect = (id: string) => {
    triggerHaptic(50);
    setActiveCategory(id);
  };

  const handleAddClick = () => {
    triggerHaptic(50);
    onOpenAddItem();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-150">
      {/* Top Quick Status Strip & Daily Report Button */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3.5 py-2 flex items-center justify-between flex-shrink-0 transition-colors duration-150 gap-2">
        <button
          onClick={() => {
            triggerHaptic(50);
            setIsReportOpen(true);
          }}
          className="h-9 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
        >
          <span>📊</span>
          <span>आज की रिपोर्ट</span>
        </button>
        <div className="flex items-center text-xs">
          {lowStockCount > 0 ? (
            <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800 flex items-center">
              ⚠️ {lowStockCount} {t('itemsEndingSoon')}
            </span>
          ) : (
            <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> {t('allStockGood')}
            </span>
          )}
        </div>
      </div>

      {/* Thumb-friendly Category Filter Chips */}
      <div className="bg-white dark:bg-slate-900 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex space-x-2 overflow-x-auto no-scrollbar flex-shrink-0 transition-colors duration-150">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-active active:scale-95 active:brightness-90 duration-150 flex-shrink-0 border ${
                isSelected
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Item Cards List */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-24 space-y-2.5 no-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-4 transition-colors duration-150">
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">{t('noItems')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t('noItemsSub')}
            </p>
            <button
              onClick={() => handleCategorySelect('ALL')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl touch-active active:scale-95 duration-150"
            >
              {t('viewAllItems')}
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onOpenNumpad={onOpenNumpad}
            />
          ))
        )}

        {/* Quick Add Item Card at bottom of list */}
        <div className="pt-2">
          <button
            onClick={handleAddClick}
            className="w-full h-14 min-h-14 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-dashed border-emerald-400/80 dark:border-emerald-500/60 rounded-2xl flex items-center justify-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm touch-active active:scale-95 active:brightness-90 duration-150 shadow-sm transition-all"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('addNewItem')}</span>
          </button>
        </div>
      </div>

      {/* Lightweight Daily Sales Report Modal */}
      <DailyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        items={items}
      />
    </div>
  );
};
