import { useState } from 'react';
import { Ban, CheckCircle2, Loader2 } from 'lucide-react';
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

export interface VoidSaleDialogProps {
  log: SalesAuditEntry | null;
  onClose: () => void;
  onConfirmVoid: (log: SalesAuditEntry) => void;
}

export function VoidSaleDialog({ log, onClose, onConfirmVoid }: VoidSaleDialogProps) {
  const [isVoiding, setIsVoiding] = useState(false);
  const [voidedLog, setVoidedLog] = useState<SalesAuditEntry | null>(null);

  const activeLog = voidedLog ?? log;
  const isOpen = Boolean(activeLog);

  const handleClose = () => {
    if (isVoiding) return;
    setVoidedLog(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!log || isVoiding) return;
    setIsVoiding(true);
    window.setTimeout(() => {
      onConfirmVoid(log);
      setIsVoiding(false);
      setVoidedLog(log);
    }, 650);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        {voidedLog ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#169C46]/12 text-[#15803D]">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </div>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-slate-900">Transaction Voided</DialogTitle>
              <DialogDescription className="text-slate-600">
                Receipt <span className="font-semibold text-slate-900">{voidedLog.receiptNo}</span>{' '}
                has been voided successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-600">
              <div className="flex items-center justify-between py-1">
                <span>Refunded Amount</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {CURRENCY_FORMATTER.format(voidedLog.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Items Restored to Inventory</span>
                <span className="font-semibold text-[#15803D] tabular-nums">
                  +{voidedLog.totalQty} {voidedLog.totalQty === 1 ? 'pc' : 'pcs'}
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
            <DialogHeader>
              <DialogTitle className="text-slate-900">
                {log ? `Void Transaction — ${log.receiptNo}` : 'Void Transaction'}
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
                  <span className="font-semibold text-slate-800">Refund Total</span>
                  <span className="text-base font-bold text-[#B91C1C] tabular-nums">
                    {CURRENCY_FORMATTER.format(log.totalAmount)}
                  </span>
                </div>

                <p className="rounded-lg border border-[#E5242A]/20 bg-[#E5242A]/5 px-3 py-2 text-xs text-[#B91C1C]">
                  Voiding this transaction will return all item stocks to Inventory, refund{' '}
                  <span className="font-semibold">{CURRENCY_FORMATTER.format(log.totalAmount)}</span>{' '}
                  to the customer, and move this record to the Void tab.
                </p>
              </div>
            ) : null}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isVoiding}
                onClick={handleClose}
                className="border-slate-300 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isVoiding}
                onClick={handleConfirm}
                className="gap-1.5 bg-[#E5242A] text-white hover:bg-[#B91C1C]"
              >
                {isVoiding ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    <span>Voiding...</span>
                  </>
                ) : (
                  <>
                    <Ban className="size-3.5" aria-hidden="true" />
                    <span>Void Transaction</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
