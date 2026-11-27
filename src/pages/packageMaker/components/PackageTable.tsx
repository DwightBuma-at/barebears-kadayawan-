import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PackageRecord } from '@/types/package';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface PackageTableProps {
  packages: PackageRecord[];
  onDeletePackage: (id: string) => void;
}

export function PackageTable({ packages, onDeletePackage }: PackageTableProps) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Packages table"
      className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-300 bg-white focus-visible:outline-2 focus-visible:outline-[#1D6CE0]"
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-xs font-semibold tracking-wide text-slate-700 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Title
            </th>
            <th scope="col" className="px-4 py-3">
              Description
            </th>
            <th scope="col" className="px-4 py-3">
              Inclusions
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {packages.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                No packages created yet. Click &ldquo;Create Package&rdquo; to bundle items
                together.
              </td>
            </tr>
          ) : (
            packages.map((pkg) => (
              <tr key={pkg.id} className="transition-colors hover:bg-slate-50/80">
                <th
                  scope="row"
                  className="px-4 py-3 align-top font-semibold whitespace-nowrap text-slate-900"
                >
                  {pkg.title}
                </th>
                <td className="max-w-xs px-4 py-3 align-top text-xs leading-relaxed text-slate-600">
                  {pkg.description || <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3 align-top">
                  <ul className="flex flex-wrap gap-1.5">
                    {pkg.inclusions.map((inc) => (
                      <li
                        key={`${pkg.id}-${inc.itemId}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800"
                      >
                        <span className="font-semibold text-[#1554B3] tabular-nums">
                          {inc.quantity}×
                        </span>
                        <span className="font-medium">{inc.name}</span>
                        <span className="rounded border border-slate-200 bg-white px-1 py-0.2 text-[10px] font-semibold text-slate-600">
                          {inc.size}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 align-top text-right font-semibold whitespace-nowrap text-slate-900 tabular-nums">
                  {CURRENCY_FORMATTER.format(pkg.price)}
                </td>
                <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onDeletePackage(pkg.id)}
                    aria-label={`Delete ${pkg.title}`}
                    className="h-7 gap-1.5 rounded-md bg-[#E5242A] px-2.5 text-xs font-semibold text-white hover:bg-[#B91C1C]"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    <span>Delete</span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
