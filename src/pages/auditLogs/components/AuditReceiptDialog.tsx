import { Printer } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
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

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface AuditReceiptDialogProps {
  log: SalesAuditEntry | null;
  onClose: () => void;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : DATE_TIME_FORMATTER.format(date);
}

export function AuditReceiptDialog({ log, onClose }: AuditReceiptDialogProps) {
  return (
    <Dialog
      open={Boolean(log)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{log ? `Official Receipt ${log.receiptNo}` : 'Official Receipt'}</DialogTitle>
          <DialogDescription>Itemized official studio sales receipt</DialogDescription>
        </DialogHeader>

        {log ? (
          <div className="space-y-5 rounded-xl border border-slate-300 bg-white p-6">
            {/* Top receipt header */}
            <div className="flex flex-col justify-between gap-4 border-b border-dashed border-slate-300 pb-5 sm:flex-row sm:items-start">
              <div className="space-y-1">
                <BrandLogo />
                <p className="text-xs text-slate-500">Davao City · Fluid Bear Art Studio</p>
              </div>

              <div className="space-y-1 text-left sm:text-right">
                <p className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                  Official Receipt
                </p>
                <p className="text-xs font-semibold text-[#1554B3] tabular-nums">
                  {log.receiptNo}
                </p>
                <p className="text-xs text-slate-500 tabular-nums">
                  {formatTimestamp(log.timestamp)}
                </p>
                <p className="text-xs text-slate-600">
                  Payment: <span className="font-semibold text-slate-900">{log.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Itemized receipt table */}
            {log.items && log.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                    <tr>
                      <th scope="col" className="px-3 py-2.5">
                        Item Description
                      </th>
                      <th scope="col" className="px-3 py-2.5">
                        Size
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right">
                        Qty
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right">
                        Unit Price
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {log.items.map((item, index) => (
                      <tr key={`${item.name}-${index}`}>
                        <th scope="row" className="px-3 py-2.5 font-medium text-slate-900">
                          {item.name}
                        </th>
                        <td className="px-3 py-2.5 text-slate-600">{item.size ?? '—'}</td>
                        <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                          {CURRENCY_FORMATTER.format(item.price)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-900 tabular-nums">
                          {CURRENCY_FORMATTER.format(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                {log.itemsSummary}
              </p>
            )}

            {/* Totals & footer */}
            <div className="flex flex-col justify-between gap-4 border-t border-dashed border-slate-300 pt-4 sm:flex-row sm:items-end">
              <div className="space-y-0.5 text-xs text-slate-500">
                <p className="font-medium text-slate-700">
                  Thank you for creating with Bare Bears!
                </p>
                <p>This serves as your official studio sales receipt.</p>
              </div>

              <div className="w-full space-y-1.5 text-xs sm:w-56">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Items</span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    {log.totalQty} {log.totalQty === 1 ? 'pc' : 'pcs'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    {CURRENCY_FORMATTER.format(log.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-slate-900">TOTAL</span>
                  <span className="text-lg font-bold text-slate-950 tabular-nums">
                    {CURRENCY_FORMATTER.format(log.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="gap-1.5 border-slate-300 text-slate-700"
          >
            <Printer className="size-3.5" aria-hidden="true" />
            <span>Print Receipt</span>
          </Button>
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
