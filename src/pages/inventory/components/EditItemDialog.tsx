import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
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
import { ITEM_SIZES } from '@/data/inventory';
import { cn } from '@/lib/utils';
import type { InventoryItem, ItemSize } from '@/types/inventory';

export interface EditItemDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSaveItem: (updated: InventoryItem) => void;
}

interface EditItemFormProps {
  item: InventoryItem;
  onClose: () => void;
  onSaveItem: (updated: InventoryItem) => void;
}

function EditItemForm({ item, onClose, onSaveItem }: EditItemFormProps) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [size, setSize] = useState<ItemSize>(item.size ?? 'M');
  const [imageUrl, setImageUrl] = useState<string | undefined>(item.imageUrl);

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

    onSaveItem({
      ...item,
      name: name.trim(),
      price: Math.max(0, parsedPrice),
      quantity: Math.max(0, parsedQty),
      size,
      imageUrl,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="edit-item-name" className="text-slate-700">
          Item Name
        </Label>
        <Input
          id="edit-item-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-slate-300 bg-white text-slate-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-item-price" className="text-slate-700">
            Price (₱)
          </Label>
          <Input
            id="edit-item-price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border-slate-300 bg-white text-slate-900 tabular-nums"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-item-quantity" className="text-slate-700">
            Quantity
          </Label>
          <Input
            id="edit-item-quantity"
            type="number"
            min="0"
            step="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border-slate-300 bg-white text-slate-900 tabular-nums"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-slate-700">Size</span>
        <div role="radiogroup" aria-label="Edit item size" className="grid grid-cols-6 gap-2">
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
        <Label htmlFor="edit-item-image" className="text-slate-700">
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
            htmlFor="edit-item-image"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 px-4 py-4 text-sm text-slate-600 transition-colors hover:border-[#1D6CE0] hover:bg-slate-50"
          >
            <ImagePlus className="size-4 text-slate-500" aria-hidden="true" />
            <span>Choose an image</span>
            <input
              id="edit-item-image"
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
          onClick={onClose}
          className="border-slate-300 text-slate-700"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1D6CE0] text-white hover:bg-[#1554B3]">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditItemDialog({ item, onClose, onSaveItem }: EditItemDialogProps) {
  return (
    <Dialog
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Edit Inventory Item</DialogTitle>
          <DialogDescription className="text-slate-600">
            Update the item details below.
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <EditItemForm key={item.id} item={item} onClose={onClose} onSaveItem={onSaveItem} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
