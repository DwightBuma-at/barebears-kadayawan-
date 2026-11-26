import { CircleAlert, Layers, Tag } from 'lucide-react';
import { ITEM_SIZES } from '@/data/inventory';
import { cn } from '@/lib/utils';
import type { InventoryItem, ItemSize } from '@/types/inventory';

export interface InventoryStatsBarProps {
  items: InventoryItem[];
  selectedSize: ItemSize | null;
  onSelectSize: (size: ItemSize | null) => void;
}

export function InventoryStatsBar({
  items,
  selectedSize,
  onSelectSize,
}: InventoryStatsBarProps) {
  const totalItems = items.length;
  const lowStockCount = items.filter((item) => item.quantity <= 5).length;

  const sizeCounts = ITEM_SIZES.reduce<Record<ItemSize, number>>(
    (acc, size) => {
      acc[size] = 0;
      return acc;
    },
    { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
  );

  for (const item of items) {
    if (item.size && item.size in sizeCounts) {
      sizeCounts[item.size] += 1;
    }
  }

  return (
    <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-12">
      {/* Total Items */}
      <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 sm:col-span-3">
        <div className="flex items-center gap-2.5">
          <Layers className="size-4 shrink-0 stroke-[1.75] text-slate-500" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-600">Total Items</span>
        </div>
        <span className="text-base font-bold text-slate-900 tabular-nums">{totalItems}</span>
      </div>

      {/* Low Stocks */}
      <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 sm:col-span-3">
        <div className="flex items-center gap-2.5">
          <CircleAlert
            className={cn(
              'size-4 shrink-0 stroke-[1.75]',
              lowStockCount > 0 ? 'text-[#DC2626]' : 'text-slate-500'
            )}
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-slate-600">Low Stocks</span>
        </div>
        <span
          className={cn(
            'text-base font-bold tabular-nums',
            lowStockCount > 0 ? 'text-[#B91C1C]' : 'text-slate-900'
          )}
        >
          {lowStockCount}
        </span>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 sm:col-span-6">
        <div className="flex items-center gap-2">
          <Tag className="size-4 shrink-0 stroke-[1.75] text-slate-500" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-600">Sizes</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {ITEM_SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectSize(isSelected ? null : size)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums transition-colors',
                  isSelected
                    ? 'border-[#1D6CE0] bg-[#1D6CE0] text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#1D6CE0] hover:bg-[#1D6CE0]/5'
                )}
              >
                <span className={isSelected ? 'text-white/85' : 'text-slate-500'}>{size}</span>
                <span className={cn('font-bold', isSelected ? 'text-white' : 'text-slate-900')}>
                  {sizeCounts[size]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
