import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadAuditLogs, loadStockAuditLogs } from '@/lib/auditLogger';
import { AuditLogsTable } from '@/pages/auditLogs/components/AuditLogsTable';
import { StockAuditTable } from '@/pages/auditLogs/components/StockAuditTable';
import type { SalesAuditEntry, StockAuditEntry } from '@/types/auditLog';

export function AuditLogs() {
  const [salesLogs] = useState<SalesAuditEntry[]>(loadAuditLogs);
  const [stockLogs] = useState<StockAuditEntry[]>(loadStockAuditLogs);

  return (
    <section className="flex h-[calc(100dvh-3.5rem)] flex-col p-4 sm:p-6">
      <Tabs defaultValue="sales" className="flex min-h-0 flex-1 flex-col gap-4">
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
        </TabsList>

        <TabsContent value="sales" className="mt-0 flex min-h-0 flex-1 flex-col">
          <AuditLogsTable logs={salesLogs} />
        </TabsContent>

        <TabsContent value="stocks" className="mt-0 flex min-h-0 flex-1 flex-col">
          <StockAuditTable logs={stockLogs} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
