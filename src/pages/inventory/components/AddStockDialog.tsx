import { useState, type FormEvent } from 'react';
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
import type { InventoryItem } from '@/types/inventory';

export interface AddStockDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirmStock: (itemId: string, amount: number) => void;
}

export function AddStockDialog({ item, onClose, onConfirmStock }: AddStockDialogProps) {
  const [amount, setAmount] = useState('1');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!item) return;
    const parsed = Number.parseInt(amount, 10);
    if (Number.isNaN(parsed) || parsed <= 0) return;

    onConfirmStock(item.id, parsed);
    setAmount('1');
    onClose();
  };

  return (
    <Dialog
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) {
          setAmount('1');
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Add Stock</DialogTitle>
          <DialogDescription className="text-slate-600">
            {item ? `${item.name} (Current stock: ${item.quantity})` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="stock-amount" className="text-slate-700">
              Quantity to Add
            </Label>
            <Input
              id="stock-amount"
              type="number"
              min="1"
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-slate-300 bg-white text-slate-900 tabular-nums"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
