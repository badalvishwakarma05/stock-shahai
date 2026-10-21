import Dexie, { Table } from 'dexie';
import { KiranaItem } from '../types';

export class KiranaDatabase extends Dexie {
  items!: Table<KiranaItem, number>;

  constructor() {
    super('KiranaKhataDB');
    this.version(1).stores({
      items: '++id, name, stock, reorderThreshold, category',
    });
  }
}

export const db = new KiranaDatabase();

/**
 * Seeder function: populates the DB with realistic Indian grocery items
 * ONLY if the database is currently empty.
 */
import { ITEM_NAME_TRANSLATIONS } from '../i18n/translations';

export const seedInitialData = async (): Promise<void> => {
  const count = await db.items.count();
  if (count === 0) {
    const today = new Date().toISOString().split('T')[0];

    const initialItems: Omit<KiranaItem, 'id'>[] = [
      {
        name: 'Aashirvaad Shudh Chakki Aata 10kg',
        nameHi: 'आशीर्वाद शुद्ध चक्की आटा 10 किलो',
        stock: 4,
        reorderThreshold: 6,
        category: 'Aata & Dals',
        unit: 'pkt',
        unitHi: 'पैकेट',
        lastSoldDate: today,
        pricePerUnit: 440,
      },
      {
        name: 'Tata Salt (Namak) 1kg',
        nameHi: 'टाटा नमक 1 किलो',
        stock: 14,
        reorderThreshold: 10,
        category: 'Masala & Spices',
        unit: 'pkt',
        unitHi: 'पैकेट',
        lastSoldDate: today,
        pricePerUnit: 28,
      },
      {
        name: 'Maggi Masala 2-Min Noodles 70g',
        nameHi: 'मैगी मसाला 2-मिनट नूडल्स 70 ग्राम',
        stock: 2,
        reorderThreshold: 20,
        category: 'Snacks',
        unit: 'pkt',
        unitHi: 'पैकेट',
        lastSoldDate: today,
        pricePerUnit: 14,
      },
      {
        name: 'Fortune Kachi Ghani Mustard Oil 1L',
        nameHi: 'फॉर्च्यून कच्ची घानी सरसों का तेल 1 लीटर',
        stock: 1.5, // Decimal stock supported (1.5 L)
        reorderThreshold: 8,
        category: 'Oils & Ghee',
        unit: 'L',
        unitHi: 'लीटर',
        lastSoldDate: getPastDateString(2),
        pricePerUnit: 155,
      },
      {
        name: 'Amul Pasteurised Butter 500g',
        nameHi: 'अमूल मक्खन (बटर) 500 ग्राम',
        stock: 0.5, // Decimal weight supported (0.5 kg)
        reorderThreshold: 3,
        category: 'Dairy',
        unit: 'kg',
        unitHi: 'किलो',
        lastSoldDate: today,
        pricePerUnit: 275,
      },
      {
        name: 'MDH Deggi Mirch Powder 100g',
        nameHi: 'एमडीएच देगी मिर्च पाउडर 100 ग्राम',
        stock: 9,
        reorderThreshold: 4,
        category: 'Masala & Spices',
        unit: 'pkt',
        unitHi: 'पैकेट',
        lastSoldDate: getPastDateString(35), // Dead stock (>20 days)
        pricePerUnit: 85,
      },
    ];

    await db.items.bulkAdd(initialItems as KiranaItem[]);
  } else {
    // Enrich existing items in DB with Hindi names if missing
    try {
      const existingItems = await db.items.toArray();
      for (const item of existingItems) {
        if (!item.nameHi && item.id !== undefined && ITEM_NAME_TRANSLATIONS[item.name]) {
          await db.items.update(item.id, { nameHi: ITEM_NAME_TRANSLATIONS[item.name] });
        }
      }
    } catch {
      // ignore
    }
  }
};

/**
 * Helper: Calculate past date YYYY-MM-DD
 */
function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

/**
 * Action Handler: Update specific item's stock +1 directly in Dexie
 */
export const incrementItemStock = async (id: number): Promise<number> => {
  return await db.transaction('rw', db.items, async () => {
    const item = await db.items.get(id);
    if (!item) return 0;
    const newStock = Math.round((item.stock + 1) * 100) / 100;
    await db.items.update(id, { stock: newStock });
    return newStock;
  });
};

/**
 * Action Handler: Update specific item's stock -1 directly in Dexie (prevent going below 0)
 */
export const decrementItemStock = async (id: number): Promise<number> => {
  return await db.transaction('rw', db.items, async () => {
    const item = await db.items.get(id);
    if (!item) return 0;
    const newStock = Math.max(0, Math.round((item.stock - 1) * 100) / 100);
    const today = new Date().toISOString().split('T')[0];
    await db.items.update(id, {
      stock: newStock,
      lastSoldDate: today,
    });
    return newStock;
  });
};

/**
 * Custom Numpad Action: Update exact stock quantity in Dexie
 * Handles decimal values and prevents NaN entries.
 */
export const setItemStockDirect = async (id: number, exactStock: number): Promise<void> => {
  const validStock = isNaN(exactStock) ? 0 : Math.max(0, Math.round(exactStock * 100) / 100);
  const today = new Date().toISOString().split('T')[0];

  await db.transaction('rw', db.items, async () => {
    const item = await db.items.get(id);
    if (!item) return;

    await db.items.update(id, {
      stock: validStock,
      ...(validStock < item.stock ? { lastSoldDate: today } : {}),
    });
  });
};

/**
 * Delta stock updater for backward compatibility
 */
export const updateItemStock = async (id: number, delta: number): Promise<number> => {
  if (delta > 0) {
    return await incrementItemStock(id);
  } else {
    return await decrementItemStock(id);
  }
};

/**
 * Helper: Check if item is dead stock (> 20 days since last sale)
 */
export const isDeadStock = (lastSoldDate?: string): boolean => {
  if (!lastSoldDate) return true;
  const sold = new Date(lastSoldDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - sold.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 20;
};

/**
 * Helper: Get days since last sale
 */
export const getDaysSinceSold = (lastSoldDate?: string): number => {
  if (!lastSoldDate) return 999;
  const sold = new Date(lastSoldDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - sold.getTime());
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};
