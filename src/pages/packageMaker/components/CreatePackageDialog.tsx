import { useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, ImageOff, Loader2, Minus, PackagePlus, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ITEM_SIZES } from '@/data/inventory';
import { cn } from '@/lib/utils';
import type { InventoryItem, ItemSize } from '@/types/inventory';
import type { NewPackageInput, PackageInclusion } from '@/types/package';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface CreatePackageDialogProps {
  open: boolean;
  inventory: InventoryItem[];
  onClose: () => void;
  onCreatePackage: (input: NewPackageInput) => void;
}

export function CreatePackageDialog({
  open,
  inventory,
  onClose,
  onCreatePackage,
}: CreatePackageDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<ItemSize | null>(null);
  const [inclusions, setInclusions] = useState<PackageInclusion[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdPackage, setCreatedPackage] = useState<NewPackageInput | null>(null);

  const filteredInventory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return inventory.filter((item) => {
      if (selectedSize && item.size !== selectedSize) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) || item.size.toLowerCase().includes(query)
      );
    });
  }, [inventory, searchQuery, selectedSize]);

  const inclusionMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const inc of inclusions) {
      map[inc.itemId] = inc.quantity;
    }
    return map;
  }, [inclusions]);

  const itemsRetailTotal = useMemo(
    () => inclusions.reduce((sum, inc) => sum + inc.unitPrice * inc.quantity, 0),
    [inclusions]
  );

  const resetForm = () => {
    setSearchQuery('');
    setSelectedSize(null);
    setInclusions([]);
    setTitle('');
    setDescription('');
    setPrice('');
    setIsCreating(false);
    setCreatedPackage(null);
  };

  const handleClose = () => {
    if (isCreating) return;
    resetForm();
    onClose();
  };

  const handleAddItem = (item: InventoryItem) => {
    setInclusions((prev) => {
      const existing = prev.find((inc) => inc.itemId === item.id);
      if (existing) {
        return prev.map((inc) =>
          inc.itemId === item.id ? { ...inc, quantity: inc.quantity + 1 } : inc
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          size: item.size,
          quantity: 1,
          unitPrice: item.price,
        },
      ];
    });
  };

  const handleIncrement = (itemId: string) => {
    setInclusions((prev) =>
      prev.map((inc) => (inc.itemId === itemId ? { ...inc, quantity: inc.quantity + 1 } : inc))
    );
  };

  const handleDecrement = (itemId: string) => {
    setInclusions((prev) =>
      prev
        .map((inc) => (inc.itemId === itemId ? { ...inc, quantity: inc.quantity - 1 } : inc))
        .filter((inc) => inc.quantity > 0)
    );
  };

  const handleRemove = (itemId: string) => {
    setInclusions((prev) => prev.filter((inc) => inc.itemId !== itemId));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number.parseFloat(price);
    if (isCreating || !title.trim() || Number.isNaN(parsedPrice) || inclusions.length === 0) {
      return;
    }

    const payload: NewPackageInput = {
      title: title.trim(),
      description: description.trim(),
      price: Math.max(0, parsedPrice),
      inclusions,
    };

    setIsCreating(true);
    window.setTimeout(() => {
      onCreatePackage(payload);
      setIsCreating(false);
      setCreatedPackage(payload);
    }, 650);
  };

  const canSubmit =
    Boolean(title.trim()) &&
    price.trim() !== '' &&
    !Number.isNaN(Number.parseFloat(price)) &&
    inclusions.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent
        className={cn(
          'bg-white',
          createdPackage
            ? 'sm:max-w-md'
            : 'flex h-[88dvh] max-w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl'
        )}
      >
        {createdPackage ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#169C46]/12 text-[#15803D]">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </div>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-slate-900">Package Created</DialogTitle>
              <DialogDescription className="text-slate-600">
                <span className="font-semibold text-slate-900">{createdPackage.title}</span> has
                been added to Package Maker.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-600">
              <div className="flex items-center justify-between py-1">
                <span>Package Price</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {CURRENCY_FORMATTER.format(createdPackage.price)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Total Items Included</span>
                <span className="font-semibold text-[#1554B3] tabular-nums">
                  {createdPackage.inclusions.reduce((sum, inc) => sum + inc.quantity, 0)} pcs
                </span>
              </div>
            </div>

            <DialogFooter className="mt-6 w-full sm:justify-center">
              <Button
                type="button"
                onClick={handleClose}
                className="w-full bg-[#1D6CE0] text-white hover:bg-[#1554B3] sm:w-32"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader className="shrink-0 border-b border-slate-200 px-6 py-4">
          <DialogTitle className="text-slate-900">Create Package</DialogTitle>
          <DialogDescription className="text-slate-600">
            Select items from the left catalog to automatically add them to the package inclusions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-slate-200 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left side: POS-style Item Catalog */}
          <div className="flex min-h-0 flex-col bg-slate-50/60 p-4 lg:col-span-7">
            <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  aria-label="Search catalog items"
                  className="h-9 rounded-lg border-slate-300 bg-white pr-8 pl-9 text-sm text-slate-900 placeholder:text-slate-400"
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

              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedSize(null)}
                  className={cn(
                    'h-8 rounded-md border px-2.5 text-xs font-semibold transition-colors',
                    selectedSize === null
                      ? 'border-[#1D6CE0] bg-[#1D6CE0] text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-[#1D6CE0]'
                  )}
                >
                  All
                </button>
                {ITEM_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize((prev) => (prev === size ? null : size))}
                    className={cn(
                      'h-8 rounded-md border px-2 text-xs font-semibold transition-colors',
                      selectedSize === size
                        ? 'border-[#1D6CE0] bg-[#1D6CE0] text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-[#1D6CE0]'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {filteredInventory.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                  No inventory items found.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {filteredInventory.map((item) => {
                    const addedQty = inclusionMap[item.id] ?? 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAddItem(item)}
                        className={cn(
                          'group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all hover:border-[#1D6CE0] hover:shadow-sm',
                          addedQty > 0
                            ? 'border-[#1D6CE0] ring-1 ring-[#1D6CE0]/25'
                            : 'border-slate-200'
                        )}
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-slate-300">
                              <ImageOff className="size-8" aria-hidden="true" />
                            </div>
                          )}

                          <span className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-xs backdrop-blur-xs">
                            {item.size}
                          </span>

                          {addedQty > 0 ? (
                            <span className="absolute top-2 right-2 rounded-full bg-[#1D6CE0] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs tabular-nums">
                              {addedQty} added
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-2.5">
                          <span className="line-clamp-1 text-sm font-semibold text-slate-900">
                            {item.name}
                          </span>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#1554B3] tabular-nums">
                              {CURRENCY_FORMATTER.format(item.price)}
                            </span>
                            <span className="text-[11px] text-slate-500 tabular-nums">
                              {item.quantity} left
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right side: Package Builder & Automated Inclusions */}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-col bg-white p-4 lg:col-span-5">
            <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <Label htmlFor="package-title" className="text-xs font-semibold text-slate-700">
                  Package Title
                </Label>
                <Input
                  id="package-title"
                  type="text"
                  required
                  placeholder="e.g. Kadayawan Bundle A"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 border-slate-300 bg-white text-sm text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="package-description"
                  className="text-xs font-semibold text-slate-700"
                >
                  Description
                </Label>
                <Textarea
                  id="package-description"
                  rows={2}
                  placeholder="Short description of this package..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none border-slate-300 bg-white text-sm text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="package-price" className="text-xs font-semibold text-slate-700">
                    Package Price (₱)
                  </Label>
                  {itemsRetailTotal > 0 ? (
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      Items value: {CURRENCY_FORMATTER.format(itemsRetailTotal)}
                    </span>
                  ) : null}
                </div>
                <Input
                  id="package-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-9 border-slate-300 bg-white text-sm text-slate-900 tabular-nums"
                />
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
                    Automated Inclusions
                  </span>
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    {inclusions.reduce((sum, inc) => sum + inc.quantity, 0)} pcs
                  </span>
                </div>

                {inclusions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/70 px-4 py-8 text-center">
                    <PackagePlus className="mb-2 size-5 text-slate-400" aria-hidden="true" />
                    <p className="text-xs font-medium text-slate-600">No items selected yet</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Click items on the left to add them to this package.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/50">
                    {inclusions.map((inc) => (
                      <li
                        key={inc.itemId}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold text-slate-900">
                              {inc.name}
                            </span>
                            <span className="shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                              {inc.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDecrement(inc.itemId)}
                            aria-label={`Decrease quantity of ${inc.name}`}
                            className="flex size-6 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center font-semibold text-slate-900 tabular-nums">
                            {inc.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrement(inc.itemId)}
                            aria-label={`Increase quantity of ${inc.name}`}
                            className="flex size-6 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                          >
                            <Plus className="size-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(inc.itemId)}
                            aria-label={`Remove ${inc.name}`}
                            className="ml-1 flex size-6 items-center justify-center rounded text-slate-400 hover:bg-[#E5242A]/10 hover:text-[#B91C1C]"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4 shrink-0 border-t border-slate-200 pt-3">
              <Button
                type="button"
                variant="outline"
                disabled={isCreating}
                onClick={handleClose}
                className="border-slate-300 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit || isCreating}
                className="gap-1.5 bg-[#1D6CE0] text-white hover:bg-[#1554B3]"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Package</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
