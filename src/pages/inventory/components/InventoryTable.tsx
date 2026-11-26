import { useState } from 'react';
import { Image as ImageIcon, PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { TablePagination } from '@/components/common/TablePagination';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { InventoryItem } from '@/types/inventory';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export interface InventoryTableProps {
  items: InventoryItem[];
  onSelectAddStock: (item: InventoryItem) => void;
  onSelectEdit: (item: InventoryItem) => void;
  onSelectDelete: (item: InventoryItem) => void;
}

const PAGE_SIZE = 7;

export function InventoryTable({
  items,
  onSelectAddStock,
  onSelectEdit,
  onSelectDelete,
}: InventoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedItems = items.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-lg border border-b-0 border-slate-300 bg-white">
      <div
        tabIndex={0}
        role="region"
        aria-label="Inventory items table"
        className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden focus-visible:outline-2 focus-visible:outline-[#1D6CE0]"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-[#1554B3] bg-[#1D6CE0] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th scope="col" className="w-28 px-4 py-3">
                Image
              </th>
              <th scope="col" className="px-4 py-3">
                Item Name
              </th>
              <th scope="col" className="px-4 py-3">
                Size
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Price
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Quantity
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No inventory items yet. Click &ldquo;Add Item&rdquo; to create one.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-2">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="block size-12 rounded-md border border-slate-200 object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex size-12 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-400"
                      >
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium whitespace-nowrap text-slate-900"
                  >
                    {item.name}
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {item.size ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-medium whitespace-nowrap text-slate-800 tabular-nums">
                    {CURRENCY_FORMATTER.format(item.price)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums">
                    <span
                      className={
                        item.quantity <= 5
                          ? 'inline-flex rounded-md bg-[#E5242A]/10 px-2 py-0.5 text-xs font-semibold text-[#B91C1C]'
                          : 'font-medium text-slate-800'
                      }
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Edit ${item.name}`}
                            onClick={() => onSelectEdit(item)}
                            className="size-8 rounded-md border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Add stock for ${item.name}`}
                            onClick={() => onSelectAddStock(item)}
                            className="size-8 rounded-md border-slate-300 bg-white text-[#1D6CE0] hover:border-[#1D6CE0] hover:bg-[#1D6CE0]/10 hover:text-[#1554B3]"
                          >
                            <PackagePlus className="size-3.5" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Stock</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Delete ${item.name}`}
                            onClick={() => onSelectDelete(item)}
                            className="size-8 rounded-md border-slate-300 bg-white text-[#DC2626] hover:border-[#DC2626] hover:bg-[#DC2626]/10 hover:text-[#B91C1C]"
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={safePage}
        totalItems={items.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
