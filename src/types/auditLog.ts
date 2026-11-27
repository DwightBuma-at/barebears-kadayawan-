export type PaymentMethod = 'Cash' | 'Card' | 'QR';

export interface SalesAuditItem {
  itemId?: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
}

export interface SalesAuditEntry {
  id: string;
  timestamp: string;
  receiptNo: string;
  customer: string;
  itemsSummary: string;
  items?: SalesAuditItem[];
  totalQty: number;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}

export type StockMovementType = 'STOCK_IN' | 'STOCK_OUT';

export interface StockAuditEntry {
  id: string;
  timestamp: string;
  receiptNo?: string;
  itemName: string;
  size?: string;
  type: StockMovementType;
  quantityChange: number;
  stockAfter: number;
  source: string;
}

export interface InventoryFieldChange {
  field: 'Name' | 'Price' | 'Quantity' | 'Size' | 'Image';
  from: string;
  to: string;
}

export interface InventoryChangeAuditEntry {
  id: string;
  timestamp: string;
  itemName: string;
  size?: string;
  changes: InventoryFieldChange[];
  source: string;
}

export interface VoidAuditEntry extends SalesAuditEntry {
  voidedAt: string;
  refundedAmount: number;
}
