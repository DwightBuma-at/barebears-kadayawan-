import type { ItemSize } from '@/types/inventory';

export interface PackageInclusion {
  itemId: string;
  name: string;
  size: ItemSize;
  quantity: number;
  unitPrice: number;
}

export interface PackageRecord {
  id: string;
  title: string;
  description: string;
  price: number;
  inclusions: PackageInclusion[];
  createdAt: string;
}

export type NewPackageInput = Omit<PackageRecord, 'id' | 'createdAt'>;
