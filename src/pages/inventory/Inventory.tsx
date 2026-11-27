import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { INITIAL_INVENTORY_ITEMS, INVENTORY_STORAGE_KEY } from '@/data/inventory';
import { appendInventoryChangeAuditLog, appendStockAuditLog } from '@/lib/auditLogger';
import { AddItemDialog } from '@/pages/inventory/components/AddItemDialog';
import { AddStockDialog } from '@/pages/inventory/components/AddStockDialog';
import { DeleteItemDialog } from '@/pages/inventory/components/DeleteItemDialog';
import { EditItemDialog } from '@/pages/inventory/components/EditItemDialog';
import { InventoryStatsBar } from '@/pages/inventory/components/InventoryStatsBar';
import { InventoryTable } from '@/pages/inventory/components/InventoryTable';
import type { InventoryFieldChange } from '@/types/auditLog';
import type { InventoryItem, ItemSize, NewInventoryItemInput } from '@/types/inventory';

function formatPrice(value: number): string {
  return `₱${value.toFixed(2)}`;
}

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

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(loadInventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<ItemSize | null>(null);
  const [stockTarget, setStockTarget] = useState<InventoryItem | null>(null);
  const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const normalizedQuery = query.replace(/[₱,\s]/g, '');
    return items.filter((item) => {
      if (selectedSize && item.size !== selectedSize) return false;
      if (!query) return true;
      const nameMatch = item.name.toLowerCase().includes(query);
      const sizeMatch = Boolean(item.size && item.size.toLowerCase().includes(query));
      const quantityMatch = String(item.quantity).includes(normalizedQuery);
      const priceMatch =
        String(item.price).includes(normalizedQuery) ||
        item.price.toFixed(2).includes(normalizedQuery);
      return nameMatch || sizeMatch || quantityMatch || priceMatch;
    });
  }, [items, searchQuery, selectedSize]);

  useEffect(() => {
    try {
      window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    } catch {
      toast.error('Could not save inventory to local storage.');
    }
  }, [items]);

  const handleAddItem = (newItem: NewInventoryItemInput) => {
    const created: InventoryItem = {
      id: `inv-${Date.now()}`,
      ...newItem,
    };
    setItems((prev) => [created, ...prev]);
    if (created.quantity > 0) {
      appendStockAuditLog({
        itemName: created.name,
        size: created.size,
        type: 'STOCK_IN',
        quantityChange: created.quantity,
        stockAfter: created.quantity,
        source: 'Inventory (New Item)',
      });
    }
    toast.success(`Added "${created.name}" to inventory.`);
  };

  const handleConfirmStock = (itemId: string, amount: number) => {
    const target = items.find((item) => item.id === itemId);
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + amount } : item
      )
    );
    if (target) {
      appendStockAuditLog({
        itemName: target.name,
        size: target.size,
        type: 'STOCK_IN',
        quantityChange: amount,
        stockAfter: target.quantity + amount,
        source: 'Inventory (Add Stock)',
      });
    }
    toast.success(`Added +${amount} stock.`);
  };

  const handleSaveItem = (updated: InventoryItem) => {
    const previous = items.find((item) => item.id === updated.id);
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));

    if (previous) {
      const changes: InventoryFieldChange[] = [];
      if (previous.name !== updated.name) {
        changes.push({ field: 'Name', from: previous.name, to: updated.name });
      }
      if (previous.price !== updated.price) {
        changes.push({
          field: 'Price',
          from: formatPrice(previous.price),
          to: formatPrice(updated.price),
        });
      }
      if (previous.quantity !== updated.quantity) {
        changes.push({
          field: 'Quantity',
          from: String(previous.quantity),
          to: String(updated.quantity),
        });
      }
      if (previous.size !== updated.size) {
        changes.push({ field: 'Size', from: previous.size, to: updated.size });
      }
      if (previous.imageUrl !== updated.imageUrl) {
        changes.push({
          field: 'Image',
          from: previous.imageUrl ? 'Attached' : 'None',
          to: updated.imageUrl ? 'Attached' : 'None',
        });
      }

      if (changes.length > 0) {
        appendInventoryChangeAuditLog({
          itemName: updated.name,
          size: updated.size,
          changes,
          source: 'Inventory (Edit Item)',
        });
      }
    }

    toast.success(`Updated "${updated.name}".`);
  };

  const handleConfirmDelete = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success('Item deleted.');
  };

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] flex-col gap-4 px-4 pt-4 pb-0 sm:px-6 sm:pt-6 sm:pb-0">
      <div className="flex shrink-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full shrink-0 xl:w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            aria-label="Search inventory items"
            enterKeyHint="search"
            className="h-10 rounded-lg border-slate-300 bg-white pr-8 pl-9 text-sm text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <InventoryStatsBar
          items={items}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />
        <div className="flex shrink-0 justify-end">
          <AddItemDialog onAddItem={handleAddItem} />
        </div>
      </div>

      <InventoryTable
        items={filteredItems}
        onSelectAddStock={setStockTarget}
        onSelectEdit={setEditTarget}
        onSelectDelete={setDeleteTarget}
      />

      <AddStockDialog
        item={stockTarget}
        onClose={() => setStockTarget(null)}
        onConfirmStock={handleConfirmStock}
      />

      <EditItemDialog
        item={editTarget}
        onClose={() => setEditTarget(null)}
        onSaveItem={handleSaveItem}
      />

      <DeleteItemDialog
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </section>
  );
}
