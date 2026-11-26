import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SalesAuditEntry } from '@/types/auditLog';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface AuditItemsDialogProps {
  log: SalesAuditEntry | null;
  onClose: () => void;
}

export function AuditItemsDialog({ log, onClose }: AuditItemsDialogProps) {
  return (
    <Dialog
      open={Boolean(log)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            {log ? `Items Sold — ${log.receiptNo}` : 'Items Sold'}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {log
              ? `${log.paymentMethod} · ${log.totalQty} ${log.totalQty === 1 ? 'pc' : 'pcs'}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        {log ? (
          <div className="space-y-4">
            {log.items && log.items.length > 0 ? (
              <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 border-b border-slate-200 bg-slate-100 text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                    <tr>
                      <th scope="col" className="px-3 py-2">
                        Item
                      </th>
                      <th scope="col" className="px-3 py-2 text-right">
                        Qty
                      </th>
                      <th scope="col" className="px-3 py-2 text-right">
                        Price
                      </th>
                      <th scope="col" className="px-3 py-2 text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {log.items.map((item, index) => (
                      <tr key={`${item.name}-${index}`}>
                        <th scope="row" className="px-3 py-2 font-medium text-slate-900">
                          {item.name}
                          {item.size ? (
                            <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                              {item.size}
                            </span>
                          ) : null}
                        </th>
                        <td className="px-3 py-2 text-right text-slate-700 tabular-nums">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-700 tabular-nums">
                          {CURRENCY_FORMATTER.format(item.price)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-slate-900 tabular-nums">
                          {CURRENCY_FORMATTER.format(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                {log.itemsSummary}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="text-base font-bold text-slate-950 tabular-nums">
                {CURRENCY_FORMATTER.format(log.totalAmount)}
              </span>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="bg-[#1D6CE0] text-white hover:bg-[#1554B3]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
