import type { InventoryItem } from '@/types/inventory';

export interface PosCartItem {
  item: InventoryItem;
  quantity: number;
}
