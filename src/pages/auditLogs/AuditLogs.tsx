import { useState } from 'react';
import { Download } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  loadAuditLogs,
  loadInventoryChangeAuditLogs,
  loadStockAuditLogs,
  loadVoidAuditLogs,
  voidSalesAuditLog,
} from '@/lib/auditLogger';
import {
  exportChangesAuditPdf,
  exportSalesAuditPdf,
  exportStocksAuditPdf,
  exportVoidAuditPdf,
} from '@/lib/auditPdfExport';
import { AuditLogsTable } from '@/pages/auditLogs/components/AuditLogsTable';
import { ChangesAuditTable } from '@/pages/auditLogs/components/ChangesAuditTable';
import { StockAuditTable } from '@/pages/auditLogs/components/StockAuditTable';
import { VoidAuditTable } from '@/pages/auditLogs/components/VoidAuditTable';
import type {
  InventoryChangeAuditEntry,
  SalesAuditEntry,
  StockAuditEntry,
  VoidAuditEntry,
} from '@/types/auditLog';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

const VALID_TABS = new Set(['sales', 'stocks', 'changes', 'void']);

export function AuditLogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam && VALID_TABS.has(tabParam) ? tabParam : 'sales';

  const setActiveTab = (nextTab: string) => {
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  const [salesLogs, setSalesLogs] = useState<SalesAuditEntry[]>(loadAuditLogs);
  const [stockLogs, setStockLogs] = useState<StockAuditEntry[]>(loadStockAuditLogs);
  const [changeLogs] = useState<InventoryChangeAuditEntry[]>(loadInventoryChangeAuditLogs);
  const [voidLogs, setVoidLogs] = useState<VoidAuditEntry[]>(loadVoidAuditLogs);

  const handleVoidSale = (log: SalesAuditEntry) => {
    const result = voidSalesAuditLog(log.id);
    if (!result) return;

    setSalesLogs(result.salesLogs);
    setStockLogs(result.stockLogs);
    setVoidLogs(result.voidLogs);

    toast.success(
      `Voided ${log.receiptNo}. Refunded ${CURRENCY_FORMATTER.format(log.totalAmount)} and restored stock to Inventory.`
    );
  };

  const handleDownloadData = () => {
    if (activeTab === 'sales') {
      if (salesLogs.length === 0) {
        toast.info('No sales data to download.');
        return;
      }
      exportSalesAuditPdf(salesLogs);
      toast.success('Downloaded Sales Audit Report PDF.');
      return;
    }

    if (activeTab === 'stocks') {
      if (stockLogs.length === 0) {
        toast.info('No stock movement data to download.');
        return;
      }
      exportStocksAuditPdf(stockLogs);
      toast.success('Downloaded Stock Movements Report PDF.');
      return;
    }

    if (activeTab === 'changes') {
      if (changeLogs.length === 0) {
        toast.info('No inventory changes data to download.');
        return;
      }
      exportChangesAuditPdf(changeLogs);
      toast.success('Downloaded Inventory Changes Report PDF.');
      return;
    }

    if (activeTab === 'void') {
      if (voidLogs.length === 0) {
        toast.info('No voided transactions data to download.');
        return;
      }
      exportVoidAuditPdf(voidLogs);
      toast.success('Downloaded Voided Transactions Report PDF.');
    }
  };

  const totalChangeRows = changeLogs.reduce((sum, log) => sum + log.changes.length, 0);
  const transactionCount =
    activeTab === 'sales'
      ? salesLogs.length
      : activeTab === 'stocks'
        ? stockLogs.length
        : activeTab === 'changes'
          ? totalChangeRows
          : voidLogs.length;

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] flex-col p-4 sm:p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col gap-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="w-fit bg-slate-100 p-1">
            <TabsTrigger
              value="sales"
              className="px-4 text-xs font-semibold data-[state=active]:bg-[#1D6CE0] data-[state=active]:text-white"
            >
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="stocks"
              className="px-4 text-xs font-semibold data-[state=active]:bg-[#1D6CE0] data-[state=active]:text-white"
            >
              Stocks
            </TabsTrigger>
            <TabsTrigger
              value="changes"
              className="px-4 text-xs font-semibold data-[state=active]:bg-[#1D6CE0] data-[state=active]:text-white"
            >
              Changes
            </TabsTrigger>
            <TabsTrigger
              value="void"
              className="px-4 text-xs font-semibold data-[state=active]:bg-[#1D6CE0] data-[state=active]:text-white"
            >
              Void
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
              <span>Total Transactions</span>
              <span className="font-bold text-slate-900 tabular-nums">{transactionCount}</span>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadData}
              className="h-8 gap-1.5 rounded-lg bg-[#1D6CE0] px-3 text-xs font-semibold text-white hover:bg-[#1554B3]"
            >
              <Download className="size-3.5" aria-hidden="true" />
              <span>Download Data</span>
            </Button>
          </div>
        </div>

        <TabsContent value="sales" className="mt-0 flex min-h-0 flex-1 flex-col">
          <AuditLogsTable logs={salesLogs} onVoidSale={handleVoidSale} />
        </TabsContent>

        <TabsContent value="stocks" className="mt-0 flex min-h-0 flex-1 flex-col">
          <StockAuditTable logs={stockLogs} />
        </TabsContent>

        <TabsContent value="changes" className="mt-0 flex min-h-0 flex-1 flex-col">
          <ChangesAuditTable logs={changeLogs} />
        </TabsContent>

        <TabsContent value="void" className="mt-0 flex min-h-0 flex-1 flex-col">
          <VoidAuditTable logs={voidLogs} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
