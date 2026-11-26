import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PosCartItem } from '@/types/pos';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface PosCounterProps {
  cart: PosCartItem[];
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function PosCounter({
  cart,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCheckout,
}: PosCounterProps) {
  const totalCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalAmount = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  return (
    <aside
      aria-label="POS Counter"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white"
    >
      {/* Counter header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-[#1D6CE0]" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-slate-900">Counter</h2>
          <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-xs font-semibold text-slate-700 tabular-nums">
            {totalCount}
          </span>
        </div>

        {cart.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-[#DC2626] hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Scrollable counter items */}
      <div className="min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto p-3">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center text-center text-sm text-slate-500">
            <p className="font-medium text-slate-700">Counter is empty</p>
            <p className="mt-1 text-xs text-slate-500">
              Click any item on the left to add it here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {cart.map(({ item, quantity }) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {item.size ? `${item.size} · ` : ''}
                    {CURRENCY_FORMATTER.format(item.price)} × {quantity} ={' '}
                    <span className="font-semibold text-slate-700">
                      {CURRENCY_FORMATTER.format(item.price * quantity)}
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Decrease quantity for ${item.name}`}
                    onClick={() => onDecrement(item.id)}
                    className="size-7 rounded-md border-slate-300 bg-white text-slate-700"
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-xs font-semibold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={quantity >= item.quantity}
                    aria-label={`Increase quantity for ${item.name}`}
                    onClick={() => onIncrement(item.id)}
                    className="size-7 rounded-md border-slate-300 bg-white text-slate-700"
                  >
                    <Plus className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemove(item.id)}
                    className="ml-0.5 size-7 text-[#DC2626] hover:bg-[#DC2626]/10 hover:text-[#B91C1C]"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Counter breakdown & checkout footer */}
      <div className="shrink-0 space-y-3 border-t border-slate-200 bg-slate-50/70 p-4">
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Items</span>
            <span className="font-medium text-slate-800 tabular-nums">
              {totalCount} {totalCount === 1 ? 'pc' : 'pcs'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium text-slate-800 tabular-nums">
              {CURRENCY_FORMATTER.format(totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-sm">
          <span className="font-semibold text-slate-800">Total</span>
          <span className="text-lg font-bold text-slate-950 tabular-nums">
            {CURRENCY_FORMATTER.format(totalAmount)}
          </span>
        </div>

        <Button
          type="button"
          disabled={cart.length === 0}
          onClick={onCheckout}
          className="h-10 w-full rounded-lg bg-[#1D6CE0] text-sm font-semibold text-white hover:bg-[#1554B3]"
        >
          Checkout
        </Button>
      </div>
    </aside>
  );
}
