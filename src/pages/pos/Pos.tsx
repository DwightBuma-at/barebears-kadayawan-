import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { INITIAL_INVENTORY_ITEMS, INVENTORY_STORAGE_KEY } from '@/data/inventory';
import { appendSalesAuditLog, appendStockAuditLog } from '@/lib/auditLogger';
import { PosCatalog } from '@/pages/pos/components/PosCatalog';
import { PosCheckoutDialog } from '@/pages/pos/components/PosCheckoutDialog';
import { PosCounter } from '@/pages/pos/components/PosCounter';
import type { PaymentMethod, SalesAuditEntry } from '@/types/auditLog';
import type { InventoryItem } from '@/types/inventory';
import type { PosCartItem } from '@/types/pos';

function loadInventoryItems(): InventoryItem[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY_ITEMS;
  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return INITIAL_INVENTORY_ITEMS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventoryItem[]) : INITIAL_INVENTORY_ITEMS;
  } catch {
    return INITIAL_INVENTORY_ITEMS;
  }
}

export function Pos() {
  const [inventory, setInventory] = useState<InventoryItem[]>(loadInventoryItems);
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of cart) {
      map[entry.item.id] = entry.quantity;
    }
    return map;
  }, [cart]);

  const handleAddToCounter = (item: InventoryItem) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.quantity) return prev;
        return prev.map((entry) =>
          entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      if (item.quantity <= 0) return prev;
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleIncrement = (itemId: string) => {
    setCart((prev) =>
      prev.map((entry) =>
        entry.item.id === itemId && entry.quantity < entry.item.quantity
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry
      )
    );
  };

  const handleDecrement = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemove = (itemId: string) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const handleClear = () => {
    setCart([]);
  };

  const handleCompleteSale = (customer: string, paymentMethod: PaymentMethod): SalesAuditEntry => {
    const updatedInventory = inventory.map((invItem) => {
      const bought = cartQuantities[invItem.id] ?? 0;
      if (bought <= 0) return invItem;
      return { ...invItem, quantity: Math.max(0, invItem.quantity - bought) };
    });

    setInventory(updatedInventory);
    try {
      window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
    } catch {
      toast.error('Could not update inventory stock.');
    }

    const totalQty = cart.reduce((sum, entry) => sum + entry.quantity, 0);
    const totalAmount = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
    const itemsSummary = cart
      .map(
        (entry) =>
          `${entry.quantity}× ${entry.item.name}${entry.item.size ? ` (${entry.item.size})` : ''}`
      )
      .join(', ');

    const items = cart.map(({ item, quantity }) => ({
      itemId: item.id,
      name: item.name,
      size: item.size,
      price: item.price,
      quantity,
    }));

    const record = appendSalesAuditLog({
      customer,
      itemsSummary,
      items,
      totalQty,
      paymentMethod,
      totalAmount,
    });

    for (const entry of cart) {
      const updated = updatedInventory.find((inv) => inv.id === entry.item.id);
      appendStockAuditLog({
        receiptNo: record.receiptNo,
        itemName: entry.item.name,
        size: entry.item.size,
        type: 'STOCK_OUT',
        quantityChange: entry.quantity,
        stockAfter: updated?.quantity ?? Math.max(0, entry.item.quantity - entry.quantity),
        source: 'POS Checkout',
      });
    }

    setCart([]);
    return record;
  };

  return (
    <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-12">
      <div className="flex min-h-0 flex-col lg:col-span-8">
        <PosCatalog
          items={inventory}
          cartQuantities={cartQuantities}
          onAddToCounter={handleAddToCounter}
        />
      </div>
      <div className="flex min-h-0 flex-col lg:col-span-4">
        <PosCounter
          cart={cart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
          onClear={handleClear}
          onCheckout={() => setCheckoutOpen(true)}
        />
      </div>

      <PosCheckoutDialog
        open={checkoutOpen}
        cart={cart}
        onClose={() => setCheckoutOpen(false)}
        onCompleteSale={handleCompleteSale}
      />
    </div>
  );
}
