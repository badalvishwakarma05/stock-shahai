export interface KiranaItem {
  id?: number;
  name: string;
  nameHi?: string;
  stock: number; // decimal allowed (e.g. 0.5, 1.5)
  reorderThreshold: number;
  category: string;
  unit?: string;  // e.g. 'kg', 'pkt', 'pcs', 'L'
  unitHi?: string; // e.g. 'किलो', 'पैकेट', 'पीस', 'लीटर'
  lastSoldDate?: string; // YYYY-MM-DD
  pricePerUnit?: number;
  soldToday?: number;
}

export type ActiveTab = 'sales' | 'reorder';

export interface NumpadTarget {
  item: KiranaItem;
  mode: 'set' | 'increment';
}
