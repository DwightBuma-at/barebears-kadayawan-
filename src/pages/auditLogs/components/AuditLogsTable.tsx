import { useState } from 'react';
import { Ban, Eye, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AuditItemsDialog } from '@/pages/auditLogs/components/AuditItemsDialog';
import { AuditReceiptDialog } from '@/pages/auditLogs/components/AuditReceiptDialog';
import { VoidSaleDialog } from '@/pages/auditLogs/components/VoidSaleDialog';
import type { PaymentMethod, SalesAuditEntry } from '@/types/auditLog';

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

const PAYMENT_BADGE_STYLES: Record<PaymentMethod, string> = {
  Cash: 'bg-[#169C46]/12 text-[#15803D]',
  Card: 'bg-[#8E24E5]/12 text-[#6B21A8]',
  QR: 'bg-[#1D6CE0]/12 text-[#1554B3]',
};

export interface AuditLogsTableProps {
  logs: SalesAuditEntry[];
  onVoidSale: (log: SalesAuditEntry) => void;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : DATE_TIME_FORMATTER.format(date);
}

export function AuditLogsTable({ logs, onVoidSale }: AuditLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<SalesAuditEntry | null>(null);
  const [receiptLog, setReceiptLog] = useState<SalesAuditEntry | null>(null);
  const [voidTarget, setVoidTarget] = useState<SalesAuditEntry | null>(null);

  return (
    <>
      <div
        tabIndex={0}
        role="region"
        aria-label="Sales audit logs table"
        className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-300 bg-white focus-visible:outline-2 focus-visible:outline-[#1D6CE0]"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-xs font-semibold tracking-wide text-slate-700 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                Timestamp
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                Receipt #
              </th>
              <th scope="col" className="px-4 py-3">
                Items Sold
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Qty
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                Payment
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Total
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Receipt
              </th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                  No sales recorded yet. Complete a checkout in POS to see it here.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 text-xs font-medium whitespace-nowrap text-slate-600 tabular-nums">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2.5 font-semibold whitespace-nowrap text-slate-900 tabular-nums"
                  >
                    {log.receiptNo}
                  </th>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="h-7 gap-1.5 rounded-md bg-[#1D6CE0] px-2.5 text-xs font-semibold text-white hover:bg-[#1554B3]"
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      <span>View items</span>
                    </Button>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap text-slate-800 tabular-nums">
                    {log.totalQty}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex rounded-md px-2 py-0.5 text-xs font-semibold',
                        PAYMENT_BADGE_STYLES[log.paymentMethod]
                      )}
                    >
                      {log.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold whitespace-nowrap text-slate-900 tabular-nums">
                    {CURRENCY_FORMATTER.format(log.totalAmount)}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setReceiptLog(log)}
                      className="h-7 gap-1.5 rounded-md border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-700 hover:border-[#1D6CE0] hover:bg-[#1D6CE0]/5 hover:text-[#1554B3]"
                    >
                      <ReceiptText className="size-3.5" aria-hidden="true" />
                      <span>View</span>
                    </Button>
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setVoidTarget(log)}
                      className="h-7 gap-1.5 rounded-md bg-[#E5242A] px-2.5 text-xs font-semibold text-white hover:bg-[#B91C1C]"
                    >
                      <Ban className="size-3.5" aria-hidden="true" />
                      <span>Void</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AuditItemsDialog log={selectedLog} onClose={() => setSelectedLog(null)} />
      <AuditReceiptDialog log={receiptLog} onClose={() => setReceiptLog(null)} />
      <VoidSaleDialog
        log={voidTarget}
        onClose={() => setVoidTarget(null)}
        onConfirmVoid={onVoidSale}
      />
    </>
  );
}
