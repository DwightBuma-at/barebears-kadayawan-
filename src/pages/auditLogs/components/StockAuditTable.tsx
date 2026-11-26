import { cn } from '@/lib/utils';
import type { StockAuditEntry } from '@/types/auditLog';

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export interface StockAuditTableProps {
  logs: StockAuditEntry[];
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : DATE_TIME_FORMATTER.format(date);
}

function resolveReceiptNo(log: StockAuditEntry): string {
  if (log.receiptNo) return log.receiptNo;
  const match = log.source.match(/POS-\d+/);
  return match ? match[0] : '—';
}

export function StockAuditTable({ logs }: StockAuditTableProps) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Stock audit logs table"
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
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Item Name
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Type
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Qty Change
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Stock After
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Source
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                No stock movements recorded yet. Adding stock in Inventory or checking out in POS
                will appear here.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const isStockIn = log.type === 'STOCK_IN';
              return (
                <tr key={log.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 text-xs font-medium whitespace-nowrap text-slate-600 tabular-nums">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-2.5 font-semibold whitespace-nowrap text-slate-900 tabular-nums">
                    {resolveReceiptNo(log)}
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2.5 font-medium whitespace-nowrap text-slate-900"
                  >
                    {log.itemName}
                    {log.size ? (
                      <span className="ml-2 inline-flex rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {log.size}
                      </span>
                    ) : null}
                  </th>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex rounded-md px-2 py-0.5 text-xs font-semibold',
                        isStockIn
                          ? 'bg-[#169C46]/12 text-[#15803D]'
                          : 'bg-[#E5242A]/12 text-[#B91C1C]'
                      )}
                    >
                      {isStockIn ? 'Stock In' : 'Stock Out'}
                    </span>
                  </td>
                  <td
                    className={cn(
                      'px-4 py-2.5 text-right font-semibold whitespace-nowrap tabular-nums',
                      isStockIn ? 'text-[#15803D]' : 'text-[#B91C1C]'
                    )}
                  >
                    {isStockIn ? `+${log.quantityChange}` : `-${log.quantityChange}`}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap text-slate-800 tabular-nums">
                    {log.stockAfter}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">{log.source}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
