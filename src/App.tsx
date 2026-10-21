import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  seedInitialData,
  incrementItemStock,
  decrementItemStock,
  setItemStockDirect,
} from './db/db';
import { KiranaItem, ActiveTab } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SalesEntryScreen } from './components/SalesEntryScreen';
import { ReorderSheetScreen } from './components/ReorderSheetScreen';
import { NumpadSheet } from './components/NumpadSheet';
import { AddItemModal } from './components/AddItemModal';
import { Toaster, toast } from 'react-hot-toast';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sales');
  const [numpadItem, setNumpadItem] = useState<KiranaItem | null>(null);
  const [isNumpadOpen, setIsNumpadOpen] = useState<boolean>(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Monitor network connectivity dynamically
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize and seed Dexie database on first run
  useEffect(() => {
    seedInitialData().catch((err) => {
      console.error('Database seed error:', err);
    });
  }, []);

  // Real-time live query from Dexie IndexedDB
  const items = useLiveQuery(() => db.items.toArray(), []) || [];

  // Count items needing reorder for bottom nav badge
  const reorderCount = items.filter((item) => item.stock <= item.reorderThreshold).length;

  // Instant 1-Tap Increment (+1) directly in Dexie
  const handleIncrement = async (item: KiranaItem) => {
    if (item.id === undefined) return;
    const newStock = await incrementItemStock(item.id);

    toast.success(`+1 ${item.unit || ''} (${newStock} bacha)`, {
      duration: 1600,
      icon: '📦',
    });
  };

  // Instant 1-Tap Decrement (-1, min 0) directly in Dexie
  const handleDecrement = async (item: KiranaItem) => {
    if (item.id === undefined) return;
    if (item.stock <= 0) return;
    const newStock = await decrementItemStock(item.id);

    toast(`1 Bika! Abhi ${newStock} ${item.unit || ''} bacha`, {
      duration: 1600,
      icon: '💸',
    });
  };

  // Open Sliding Bottom Sheet Numpad for precise entry
  const handleOpenNumpad = (item: KiranaItem) => {
    setNumpadItem(item);
    setIsNumpadOpen(true);
  };

  // Save exact stock from Bottom Sheet Numpad ("Sale Log Karein")
  const handleSaveNumpad = async (itemId: number, newStock: number) => {
    await setItemStockDirect(itemId, newStock);
    toast.success(`Stock update ho gaya: ${newStock}`, {
      duration: 2000,
      icon: '✅',
    });
  };

  // Quick Restock helper from Reorder Screen
  const handleQuickRestock = async (item: KiranaItem) => {
    if (item.id === undefined) return;
    await setItemStockDirect(item.id, item.reorderThreshold);
    toast.success(`${item.name} stock pura ho gaya!`, {
      duration: 2000,
    });
  };

  // Add new item to DB
  const handleAddItem = async (newItem: Omit<KiranaItem, 'id'>) => {
    await db.items.add(newItem as KiranaItem);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-900 select-none overflow-hidden font-sans">
      {/* Mobile Frame Container */}
      <div className="flex-1 flex flex-col h-full max-w-md w-full mx-auto bg-slate-100 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <Header isOnline={isOnline} />

        {/* Main Screen Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative pb-16">
          {activeTab === 'sales' ? (
            <SalesEntryScreen
              items={items}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onOpenNumpad={handleOpenNumpad}
              onOpenAddItem={() => setIsAddItemOpen(true)}
            />
          ) : (
            <ReorderSheetScreen
              items={items}
              onOpenNumpad={handleOpenNumpad}
              onQuickRestock={handleQuickRestock}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation (Thumb-Zone) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reorderCount={reorderCount}
        />

        {/* Custom Sliding Bottom Sheet Numpad (Bans Native Android Keyboard) */}
        <NumpadSheet
          item={numpadItem}
          isOpen={isNumpadOpen}
          onClose={() => setIsNumpadOpen(false)}
          onSave={handleSaveNumpad}
        />

        {/* Quick Add Kirana Item Modal */}
        <AddItemModal
          isOpen={isAddItemOpen}
          onClose={() => setIsAddItemOpen(false)}
          onAdd={handleAddItem}
        />

        {/* Snappy Bottom-Center Micro-Interactions (Placed safely above Thumb Zone) */}
        <Toaster
          position="bottom-center"
          gutter={8}
          containerStyle={{
            bottom: 74, // just above the 64px bottom nav
          }}
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: '14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default App;
