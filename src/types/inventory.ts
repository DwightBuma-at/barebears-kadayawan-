export type ItemSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface InventoryItem {
  id: string;
  name: string;
  size: ItemSize;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface NewInventoryItemInput {
  name: string;
  size: ItemSize;
  price: number;
  quantity: number;
  imageUrl?: string;
}
