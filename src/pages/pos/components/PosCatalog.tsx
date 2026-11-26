import { useMemo, useState } from 'react';
import { Image as ImageIcon, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { InventoryItem } from '@/types/inventory';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface PosCatalogProps {
  items: InventoryItem[];
  cartQuantities: Record<string, number>;
  onAddToCounter: (item: InventoryItem) => void;
}

export function PosCatalog({ items, cartQuantities, onAddToCounter }: PosCatalogProps) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.size && item.size.toLowerCase().includes(q)) ||
        String(item.price).includes(q)
    );
  }, [items, query]);

  return (
    <section
      aria-label="POS product catalog"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white"
    >
      {/* Top search header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <div className="relative w-full max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search POS products"
            enterKeyHint="search"
            className="h-9 rounded-lg border-slate-300 bg-white pr-8 pl-9 text-sm text-slate-900 placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <span className="shrink-0 text-xs font-medium text-slate-500 tabular-nums">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Scrollable tall product cards grid */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center text-center text-sm text-slate-500">
            <p className="font-medium text-slate-700">No items available</p>
            <p className="mt-1 text-xs text-slate-500">
              Add items in Inventory to display them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const inCart = cartQuantities[item.id] ?? 0;
              const remaining = Math.max(0, item.quantity - inCart);
              const isOutOfStock = remaining <= 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onAddToCounter(item)}
                  aria-label={`Add ${item.name} to counter`}
                  className={cn(
                    'group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition-all hover:border-[#1D6CE0] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#1D6CE0] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-slate-200 disabled:hover:shadow-none'
                  )}
                >
                  {/* Tall image area */}
                  <div className="relative aspect-[4/4] w-full overflow-hidden bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center text-slate-400"
                      >
                        <ImageIcon className="size-8" />
                      </div>
                    )}
                    {item.size ? (
                      <span className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-slate-800 shadow-2xs">
                        {item.size}
                      </span>
                    ) : null}
                    {inCart > 0 ? (
                      <span className="absolute top-2 right-2 rounded-full bg-[#1D6CE0] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums shadow-2xs">
                        {inCart}
                      </span>
                    ) : null}
                  </div>

                  {/* Card body */}
                  <div className="flex w-full flex-1 flex-col justify-between gap-1.5 p-3">
                    <span className="line-clamp-2 text-sm leading-snug font-semibold text-slate-900">
                      {item.name}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1554B3] tabular-nums">
                        {CURRENCY_FORMATTER.format(item.price)}
                      </span>
                      <span
                        className={cn(
                          'text-[11px] font-medium tabular-nums',
                          remaining <= 5 ? 'text-[#B91C1C]' : 'text-slate-500'
                        )}
                      >
                        {remaining > 0 ? `${remaining} left` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
