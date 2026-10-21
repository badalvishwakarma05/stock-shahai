import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, isDeadStock, getDaysSinceSold } from '../db/db';
import { KiranaItem } from '../types';
import { sendWhatsAppOrder } from '../utils/whatsapp';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  PackageCheck,
  RotateCcw,
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
  // 1. Reactive live query from Dexie IndexedDB
  const liveItems = useLiveQuery(() => db.items.toArray(), []) || [];
  const items = propItems ?? liveItems;

  // 2. Filter items into Khatam Maal (low stock) and Dead Stock
  const lowStockItems = items.filter((item) => item.stock <= item.reorderThreshold);
  const deadStockItems = items.filter((item) => isDeadStock(item.lastSoldDate));

  // 3. Trigger WhatsApp Deep Link Order
  const handleWhatsAppClick = () => {
    sendWhatsAppOrder(lowStockItems);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100 relative">
      {/* Scrollable Content Container (pb-36 ensures content is not hidden behind fixed WhatsApp button) */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-36 space-y-5 no-scrollbar">
        {/* SECTION A: Khatam Maal (Low Stock Analytics) */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                Section A: Khatam Maal ({lowStockItems.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
              Stock ≤ Target
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 flex items-center space-x-3 shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800">Badhai Ho! Sab Maal Pura Hai</p>
                <p className="text-xs text-slate-500">Koi bhi item reorder limit se neeche nahi hai.</p>
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
                    className="bg-white rounded-2xl p-3.5 border-2 border-rose-200/90 bg-rose-50/30 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs mt-1">
                        <span className="text-rose-600 font-bold">
                          Bacha: {item.stock} {item.unit || ''}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                          Target: {item.reorderThreshold} {item.unit || ''}
                        </span>
                      </div>
                      <div className="mt-1.5 inline-block bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-md shadow-xs">
                        Mangwana Hai: +{deficit} {item.unit || 'pkt'}
                      </div>
                    </div>

                    {/* Fat Refill Button (Minimum 56px touch target) */}
                    <button
                      onClick={() => onOpenNumpad(item)}
                      className="h-14 min-h-14 px-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center touch-active flex-shrink-0 shadow-sm"
                      aria-label={`${item.name} stock refill karein`}
                    >
                      <span>Naya Maal</span>
                      <span className="text-emerald-400 text-[10px]">Aaya? Tap</span>
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
              <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                Section B: Ruka Hua Maal ({deadStockItems.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              &gt;20 Din Se Na Bika
            </span>
          </div>

          {deadStockItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center space-x-3 shadow-sm">
              <PackageCheck className="w-6 h-6 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-700">Koi Dead Stock Nahi Hai</p>
                <p className="text-xs text-slate-400">Sabhi items pichle 20 din ke andar bike hain.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {deadStockItems.map((item) => {
                const daysIdle = getDaysSinceSold(item.lastSoldDate);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3.5 border border-amber-200 bg-amber-50/20 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold uppercase bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                          {daysIdle} Din Puraana
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mt-1 truncate">
                        {item.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Dukan par atka stock: <strong className="text-amber-800">{item.stock} {item.unit || ''}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenNumpad(item)}
                      className="h-12 min-h-12 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs flex items-center justify-center touch-active flex-shrink-0 border border-amber-300"
                    >
                      Update
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* MASSIVE FIXED BOTTOM DEEP LINK BUTTON (Safely positioned above the 64px bottom nav) */}
      <button
        onClick={handleWhatsAppClick}
        disabled={lowStockItems.length === 0}
        className={`fixed bottom-16 w-[90%] left-[5%] max-w-[calc(28rem*0.9)] right-[5%] mx-auto h-14 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg touch-active z-20 text-base transition-all ${
          lowStockItems.length === 0
            ? 'opacity-50 cursor-not-allowed bg-slate-300 shadow-none'
            : 'shadow-green-500/30'
        }`}
        aria-label="WhatsApp pe Order Bhejein"
      >
        <span>WhatsApp pe Order Bhejein 🚀</span>
      </button>
    </div>
  );
};
