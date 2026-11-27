import { INITIAL_INVENTORY_ITEMS, INVENTORY_STORAGE_KEY } from '@/data/inventory';
import type {
  InventoryChangeAuditEntry,
  SalesAuditEntry,
  StockAuditEntry,
  VoidAuditEntry,
} from '@/types/auditLog';
import type { InventoryItem } from '@/types/inventory';

export const AUDIT_LOGS_STORAGE_KEY = 'bare-bears-sales-audit-logs';
export const STOCK_AUDIT_LOGS_STORAGE_KEY = 'bare-bears-stock-audit-logs';
export const INVENTORY_CHANGES_AUDIT_LOGS_STORAGE_KEY = 'bare-bears-inventory-changes-audit-logs';
export const VOID_AUDIT_LOGS_STORAGE_KEY = 'bare-bears-void-audit-logs';

export function loadAuditLogs(): SalesAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SalesAuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function loadVoidAuditLogs(): VoidAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(VOID_AUDIT_LOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VoidAuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendSalesAuditLog(
  entry: Omit<SalesAuditEntry, 'id' | 'timestamp' | 'receiptNo'>
): SalesAuditEntry {
  const existing = loadAuditLogs();
  const voided = loadVoidAuditLogs();
  const nextNumber = 1001 + existing.length + voided.length;
  const created: SalesAuditEntry = {
    id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    receiptNo: `POS-${nextNumber}`,
    ...entry,
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify([created, ...existing]));
    } catch {
      // Ignore storage quota errors
    }
  }

  return created;
}

export function loadStockAuditLogs(): StockAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STOCK_AUDIT_LOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StockAuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendStockAuditLog(
  entry: Omit<StockAuditEntry, 'id' | 'timestamp'>
): StockAuditEntry {
  const existing = loadStockAuditLogs();
  const created: StockAuditEntry = {
    id: `stock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        STOCK_AUDIT_LOGS_STORAGE_KEY,
        JSON.stringify([created, ...existing])
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  return created;
}

export function loadInventoryChangeAuditLogs(): InventoryChangeAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(INVENTORY_CHANGES_AUDIT_LOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventoryChangeAuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendInventoryChangeAuditLog(
  entry: Omit<InventoryChangeAuditEntry, 'id' | 'timestamp'>
): InventoryChangeAuditEntry {
  const existing = loadInventoryChangeAuditLogs();
  const created: InventoryChangeAuditEntry = {
    id: `change-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        INVENTORY_CHANGES_AUDIT_LOGS_STORAGE_KEY,
        JSON.stringify([created, ...existing])
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  return created;
}

function loadStoredInventory(): InventoryItem[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY_ITEMS;
  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return INITIAL_INVENTORY_ITEMS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventoryItem[]) : INITIAL_INVENTORY_ITEMS;
  } catch {
    return INITIAL_INVENTORY_ITEMS;
  }
}

export interface VoidSaleResult {
  voidedEntry: VoidAuditEntry;
  salesLogs: SalesAuditEntry[];
  stockLogs: StockAuditEntry[];
  voidLogs: VoidAuditEntry[];
}

export function voidSalesAuditLog(saleId: string): VoidSaleResult | null {
  const existingSales = loadAuditLogs();
  const target = existingSales.find((entry) => entry.id === saleId);
  if (!target) return null;

  const updatedSales = existingSales.filter((entry) => entry.id !== saleId);
  const existingVoids = loadVoidAuditLogs();
  const voidedEntry: VoidAuditEntry = {
    ...target,
    voidedAt: new Date().toISOString(),
    refundedAmount: target.totalAmount,
  };
  const updatedVoids = [voidedEntry, ...existingVoids];

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updatedSales));
      window.localStorage.setItem(VOID_AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updatedVoids));
    } catch {
      // Ignore storage quota errors
    }
  }

  if (target.items && target.items.length > 0) {
    const inventory = loadStoredInventory();
    const updatedInventory = inventory.map((item) => ({ ...item }));

    for (const sold of target.items) {
      const match = updatedInventory.find((inv) =>
        sold.itemId
          ? inv.id === sold.itemId
          : inv.name === sold.name && (sold.size ? inv.size === sold.size : true)
      );

      let stockAfter = sold.quantity;
      if (match) {
        match.quantity += sold.quantity;
        stockAfter = match.quantity;
      }

      appendStockAuditLog({
        receiptNo: target.receiptNo,
        itemName: sold.name,
        size: sold.size,
        type: 'STOCK_IN',
        quantityChange: sold.quantity,
        stockAfter,
        source: 'Void Transaction',
      });
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
      } catch {
        // Ignore storage quota errors
      }
    }
  }

  return {
    voidedEntry,
    salesLogs: updatedSales,
    stockLogs: loadStockAuditLogs(),
    voidLogs: updatedVoids,
  };
}
