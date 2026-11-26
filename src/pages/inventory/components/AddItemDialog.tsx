import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ITEM_SIZES } from '@/data/inventory';
import { cn } from '@/lib/utils';
import type { ItemSize, NewInventoryItemInput } from '@/types/inventory';

export interface AddItemDialogProps {
  onAddItem: (item: NewInventoryItemInput) => void;
}

export function AddItemDialog({ onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [size, setSize] = useState<ItemSize>('M');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setName('');
    setSize('M');
    setPrice('');
    setQuantity('');
    setImageUrl(undefined);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number.parseFloat(price);
    const parsedQty = Number.parseInt(quantity, 10);

    if (!name.trim() || Number.isNaN(parsedPrice) || Number.isNaN(parsedQty)) {
      return;
    }

    onAddItem({
      name: name.trim(),
      size,
      price: Math.max(0, parsedPrice),
      quantity: Math.max(0, parsedQty),
      imageUrl,
    });

    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="gap-2 rounded-md bg-[#1D6CE0] text-white hover:bg-[#1554B3]"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span>Add Item</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Add Inventory Item</DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter the item details below to add it to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="item-name" className="text-slate-700">
              Item Name
            </Label>
            <Input
              id="item-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic White Bear (23cm)"
              className="border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="item-price" className="text-slate-700">
                Price (₱)
              </Label>
              <Input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="border-slate-300 bg-white text-slate-900 tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-quantity" className="text-slate-700">
                Quantity
              </Label>
              <Input
                id="item-quantity"
                type="number"
                min="0"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="border-slate-300 bg-white text-slate-900 tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">Size</span>
            <div role="radiogroup" aria-label="Item size" className="grid grid-cols-6 gap-2">
              {ITEM_SIZES.map((option) => {
                const selected = size === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSize(option)}
                    className={cn(
                      'h-9 rounded-md border text-xs font-semibold transition-colors',
                      selected
                        ? 'border-[#1D6CE0] bg-[#1D6CE0] text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-[#1D6CE0] hover:text-[#1554B3]'
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-image" className="text-slate-700">
              Upload Image <span className="font-normal text-slate-500">(optional)</span>
            </Label>
            {imageUrl ? (
              <div className="relative inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <img src={imageUrl} alt="Preview" className="size-12 rounded-md object-cover" />
                <span className="text-xs font-medium text-slate-700">Image attached</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setImageUrl(undefined)}
                  aria-label="Remove uploaded image"
                  className="size-7 text-slate-500 hover:text-slate-900"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="item-image"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 px-4 py-4 text-sm text-slate-600 transition-colors hover:border-[#1D6CE0] hover:bg-slate-50"
              >
                <ImagePlus className="size-4 text-slate-500" aria-hidden="true" />
                <span>Choose an image</span>
                <input
                  id="item-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-slate-300 text-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1D6CE0] text-white hover:bg-[#1554B3]">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
