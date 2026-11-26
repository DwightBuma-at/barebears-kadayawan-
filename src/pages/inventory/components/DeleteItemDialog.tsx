import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { InventoryItem } from '@/types/inventory';

export interface DeleteItemDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirmDelete: (itemId: string) => void;
}

export function DeleteItemDialog({ item, onClose, onConfirmDelete }: DeleteItemDialogProps) {
  const handleDelete = () => {
    if (!item) return;
    onConfirmDelete(item.id);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Delete item?</DialogTitle>
          <DialogDescription className="text-slate-600">
            {item ? `Remove "${item.name}" from your inventory?` : ''}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
