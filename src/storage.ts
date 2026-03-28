import type { WishItem } from './types';

const KEY = 'wishlist_items';

export function loadItems(): WishItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WishItem[]) : [];
  } catch {
    return [];
  }
}

export function saveItems(items: WishItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}
