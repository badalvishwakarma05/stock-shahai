import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { ItemCard } from './ItemCard';
import { KiranaItem } from '../types';
import { PlusCircle, CheckCircle2 } from 'lucide-react';

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
  // Live reactive query directly from Dexie IndexedDB
  const liveItems = useLiveQuery(() => db.items.toArray(), []) || [];
  const items = propItems ?? liveItems;

  const [activeCategory, setActiveCategory] = useState<string>('Sabhi');

  // Categories extracted from items + special filters
  const categories = ['Sabhi', '⚠️ Kam Stock', 'Aata & Dals', 'Snacks', 'Masala & Spices', 'Oils & Ghee', 'Dairy'];

  // Filter items without needing an on-screen keyboard
  const filteredItems = items.filter((item) => {
    if (activeCategory === 'Sabhi') return true;
    if (activeCategory === '⚠️ Kam Stock') return item.stock <= item.reorderThreshold;
    return item.category === activeCategory;
  });

  const lowStockCount = items.filter((i) => i.stock <= i.reorderThreshold).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Top Quick Status Strip (No action buttons to preserve Thumb-Zone) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div>
          <span className="text-xs text-slate-500 font-medium">Kul Maal (Items):</span>
          <span className="ml-1.5 text-sm font-bold text-slate-800">{items.length} Items</span>
        </div>
        <div className="flex items-center text-xs">
          {lowStockCount > 0 ? (
            <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-full border border-rose-200 flex items-center">
              ⚠️ {lowStockCount} Maal Khatam Hone Wala
            </span>
          ) : (
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Sab Pura Hai
            </span>
          )}
        </div>
      </div>

      {/* Thumb-friendly Category Filter Chips (Zero Native Keyboard!) */}
      <div className="bg-white px-3 py-2 border-b border-slate-200 flex space-x-2 overflow-x-auto no-scrollbar flex-shrink-0">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-active flex-shrink-0 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Scrollable Item Cards List */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-24 space-y-2.5 no-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 mt-4">
            <p className="text-base font-bold text-slate-700">Koi Maal Nahi Mila</p>
            <p className="text-xs text-slate-400 mt-1">
              Is category mein koi item nahi hai ya stock pura hai.
            </p>
            <button
              onClick={() => setActiveCategory('Sabhi')}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl touch-active"
            >
              Sabhi Maal Dekhein
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
            onClick={onOpenAddItem}
            className="w-full h-14 min-h-14 bg-white hover:bg-slate-50 border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center space-x-2 text-emerald-700 font-bold text-sm touch-active shadow-sm"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>+ Naya Kirana Item Jodein</span>
          </button>
        </div>
      </div>
    </div>
  );
};
