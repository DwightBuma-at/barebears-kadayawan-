import type { InventoryChangeAuditEntry } from '@/types/auditLog';

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export interface ChangesAuditTableProps {
  logs: InventoryChangeAuditEntry[];
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : DATE_TIME_FORMATTER.format(date);
}

export function ChangesAuditTable({ logs }: ChangesAuditTableProps) {
  const rows = logs.flatMap((log) =>
    log.changes.map((change, index) => ({
      key: `${log.id}-${change.field}-${index}`,
      timestamp: log.timestamp,
      itemName: log.itemName,
      size: log.size,
      field: change.field,
      from: change.from,
      to: change.to,
      source: log.source,
    }))
  );

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Inventory changes audit logs table"
      className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-300 bg-white focus-visible:outline-2 focus-visible:outline-[#1D6CE0]"
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-xs font-semibold tracking-wide text-slate-700 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Timestamp
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Item Name
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Size
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              From
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              To
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Source
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                No inventory changes recorded yet. Editing an item in Inventory will appear here.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.key} className="transition-colors hover:bg-slate-50/80">
                <td className="px-4 py-2.5 text-xs font-medium whitespace-nowrap text-slate-600 tabular-nums">
                  {formatTimestamp(row.timestamp)}
                </td>
                <th
                  scope="row"
                  className="px-4 py-2.5 font-medium whitespace-nowrap text-slate-900"
                >
                  {row.itemName}
                </th>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  {row.size ? (
                    <span className="inline-flex rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {row.size}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-slate-500 line-through">
                  {row.from}
                </td>
                <td className="px-4 py-2.5 font-semibold whitespace-nowrap text-slate-900">
                  {row.to}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">{row.source}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
