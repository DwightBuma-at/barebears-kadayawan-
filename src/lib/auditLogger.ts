import type { SalesAuditEntry, StockAuditEntry } from '@/types/auditLog';

export const AUDIT_LOGS_STORAGE_KEY = 'bare-bears-sales-audit-logs';
export const STOCK_AUDIT_LOGS_STORAGE_KEY = 'bare-bears-stock-audit-logs';

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

export function appendSalesAuditLog(
  entry: Omit<SalesAuditEntry, 'id' | 'timestamp' | 'receiptNo'>
): SalesAuditEntry {
  const existing = loadAuditLogs();
  const nextNumber = 1001 + existing.length;
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
