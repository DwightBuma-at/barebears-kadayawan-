import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
}

export function TablePagination({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
  className,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);
  const visiblePages = getVisiblePages(safePage, totalPages);

  return (
    <div
      className={cn(
        'flex min-h-[60px] flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-600 sm:flex-row',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <p className="tabular-nums">
          {totalItems === 0 ? (
            'Showing 0 items'
          ) : (
            <>
              Showing <span className="font-semibold text-slate-900">{startItem}</span>–
              <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
              <span className="font-semibold text-slate-900">{totalItems}</span>
            </>
          )}
        </p>

        {onPageSizeChange ? (
          <label className="inline-flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-800 focus-visible:outline-2 focus-visible:outline-[#1D6CE0]"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <nav aria-label="Table pagination" className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
          className="h-8 gap-1 rounded-md border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {visiblePages.map((entry, index) =>
          entry === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1.5 text-slate-400 select-none"
            >
              ...
            </span>
          ) : (
            <Button
              key={entry}
              type="button"
              variant={entry === safePage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(entry)}
              aria-current={entry === safePage ? 'page' : undefined}
              className={cn(
                'h-8 min-w-8 rounded-md px-2 text-xs tabular-nums',
                entry === safePage
                  ? 'bg-[#1D6CE0] font-semibold text-white hover:bg-[#1554B3]'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              {entry}
            </Button>
          )
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
          className="h-8 gap-1 rounded-md border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
