import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {
  InventoryChangeAuditEntry,
  SalesAuditEntry,
  StockAuditEntry,
  VoidAuditEntry,
} from '@/types/auditLog';

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : DATE_TIME_FORMATTER.format(date);
}

function formatPhp(amount: number): string {
  return `PHP ${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function sanitizeText(text: string): string {
  return text.replace(/₱/g, 'PHP ').replace(/×/g, 'x');
}

function getFileDateStamp(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function createBasePdf(title: string, subtitle: string): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('BARE BEARS — Kadayawan', 40, 42);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(29, 108, 224);
  doc.text(title, 40, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 40, 78);
  doc.text(`Generated: ${formatTimestamp(new Date().toISOString())}`, pageWidth - 40, 42, {
    align: 'right',
  });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(40, 88, pageWidth - 40, 88);

  return doc;
}

function addPageNumbers(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 24, { align: 'right' });
  }
}

export function exportSalesAuditPdf(logs: SalesAuditEntry[]): void {
  const totalAmount = logs.reduce((sum, log) => sum + log.totalAmount, 0);
  const doc = createBasePdf(
    'Sales Audit Report',
    `Total Transactions: ${logs.length}   |   Total Sales: ${formatPhp(totalAmount)}`
  );

  autoTable(doc, {
    startY: 100,
    margin: { left: 40, right: 40 },
    head: [['Timestamp', 'Receipt #', 'Items Sold', 'Qty', 'Payment', 'Total']],
    body: logs.map((log) => [
      formatTimestamp(log.timestamp),
      log.receiptNo,
      sanitizeText(log.itemsSummary),
      String(log.totalQty),
      log.paymentMethod,
      formatPhp(log.totalAmount),
    ]),
    headStyles: {
      fillColor: [29, 108, 224],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      3: { halign: 'right' },
      5: { halign: 'right', fontStyle: 'bold' },
    },
  });

  addPageNumbers(doc);
  doc.save(`bare-bears-sales-report-${getFileDateStamp()}.pdf`);
}

export function exportStocksAuditPdf(logs: StockAuditEntry[]): void {
  const doc = createBasePdf('Stock Movements Audit Report', `Total Records: ${logs.length}`);

  autoTable(doc, {
    startY: 100,
    margin: { left: 40, right: 40 },
    head: [['Timestamp', 'Receipt #', 'Item Name', 'Size', 'Type', 'Qty Change', 'Stock After', 'Source']],
    body: logs.map((log) => {
      const isStockIn = log.type === 'STOCK_IN';
      const receipt = log.receiptNo ?? (log.source.match(/POS-\d+/)?.[0] || '-');
      return [
        formatTimestamp(log.timestamp),
        receipt,
        log.itemName,
        log.size ?? '-',
        isStockIn ? 'Stock In' : 'Stock Out',
        isStockIn ? `+${log.quantityChange}` : `-${log.quantityChange}`,
        String(log.stockAfter),
        log.source,
      ];
    }),
    headStyles: {
      fillColor: [29, 108, 224],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      5: { halign: 'right', fontStyle: 'bold' },
      6: { halign: 'right' },
    },
  });

  addPageNumbers(doc);
  doc.save(`bare-bears-stocks-report-${getFileDateStamp()}.pdf`);
}

export function exportChangesAuditPdf(logs: InventoryChangeAuditEntry[]): void {
  const rows = logs.flatMap((log) =>
    log.changes.map((change) => [
      formatTimestamp(log.timestamp),
      log.itemName,
      log.size ?? '-',
      sanitizeText(change.from),
      sanitizeText(change.to),
      log.source,
    ])
  );

  const doc = createBasePdf('Inventory Changes Audit Report', `Total Changes: ${rows.length}`);

  autoTable(doc, {
    startY: 100,
    margin: { left: 40, right: 40 },
    head: [['Timestamp', 'Item Name', 'Size', 'From', 'To', 'Source']],
    body: rows,
    headStyles: {
      fillColor: [29, 108, 224],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      4: { fontStyle: 'bold' },
    },
  });

  addPageNumbers(doc);
  doc.save(`bare-bears-changes-report-${getFileDateStamp()}.pdf`);
}

export function exportVoidAuditPdf(logs: VoidAuditEntry[]): void {
  const totalRefunded = logs.reduce((sum, log) => sum + log.refundedAmount, 0);
  const doc = createBasePdf(
    'Voided Transactions Report',
    `Total Voided Transactions: ${logs.length}   |   Total Refunded: ${formatPhp(totalRefunded)}`
  );

  autoTable(doc, {
    startY: 100,
    margin: { left: 40, right: 40 },
    head: [['Voided At', 'Receipt #', 'Items Voided', 'Qty', 'Payment', 'Refunded']],
    body: logs.map((log) => [
      formatTimestamp(log.voidedAt),
      log.receiptNo,
      sanitizeText(log.itemsSummary),
      String(log.totalQty),
      log.paymentMethod,
      formatPhp(log.refundedAmount),
    ]),
    headStyles: {
      fillColor: [229, 36, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      3: { halign: 'right' },
      5: { halign: 'right', fontStyle: 'bold', textColor: [185, 28, 28] },
    },
  });

  addPageNumbers(doc);
  doc.save(`bare-bears-void-report-${getFileDateStamp()}.pdf`);
}
