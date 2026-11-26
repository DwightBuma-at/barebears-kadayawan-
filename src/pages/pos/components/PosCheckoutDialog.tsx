import { useState } from 'react';
import { Banknote, CheckCircle2, CreditCard, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { PaymentMethod, SalesAuditEntry } from '@/types/auditLog';
import type { PosCartItem } from '@/types/pos';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { value: 'Cash', label: 'Cash', icon: Banknote },
  { value: 'Card', label: 'Card', icon: CreditCard },
  { value: 'QR', label: 'QR', icon: QrCode },
];

export interface PosCheckoutDialogProps {
  open: boolean;
  cart: PosCartItem[];
  onClose: () => void;
  onCompleteSale: (customer: string, paymentMethod: PaymentMethod) => SalesAuditEntry;
}

export function PosCheckoutDialog({ open, cart, onClose, onCompleteSale }: PosCheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSale, setCompletedSale] = useState<SalesAuditEntry | null>(null);

  const totalCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalAmount = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  const handleClose = () => {
    if (isProcessing) return;
    setCompletedSale(null);
    setPaymentMethod('Cash');
    onClose();
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    window.setTimeout(() => {
      const record = onCompleteSale('Walk-in', paymentMethod);
      setIsProcessing(false);
      setCompletedSale(record);
    }, 700);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent className="bg-white sm:max-w-md">
        {completedSale ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#169C46]/12 text-[#169C46]">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>

            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-lg font-bold text-slate-900">
                Payment Successful
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                Recorded in Audit Logs under{' '}
                <span className="font-semibold text-slate-900">{completedSale.receiptNo}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 w-full space-y-2 rounded-lg border border-slate-200 bg-slate-50/70 p-4 text-left text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Payment Type</span>
                <span className="font-semibold text-slate-900">{completedSale.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Items</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {completedSale.totalQty} {completedSale.totalQty === 1 ? 'pc' : 'pcs'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-semibold text-slate-800">Total Paid</span>
                <span className="font-bold text-slate-950 tabular-nums">
                  {CURRENCY_FORMATTER.format(completedSale.totalAmount)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleClose}
              className="mt-5 h-10 w-full rounded-lg bg-[#1D6CE0] text-sm font-semibold text-white hover:bg-[#1554B3]"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-slate-900">Confirm Checkout</DialogTitle>
              <DialogDescription className="text-slate-600">
                Review the order breakdown and select a payment method.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Order breakdown */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <ul className="max-h-36 space-y-1.5 overflow-y-auto pr-1 text-xs">
                  {cart.map(({ item, quantity }) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-slate-700"
                    >
                      <span className="truncate">
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {quantity}×
                        </span>{' '}
                        {item.name}
                        {item.size ? ` (${item.size})` : ''}
                      </span>
                      <span className="shrink-0 font-medium text-slate-900 tabular-nums">
                        {CURRENCY_FORMATTER.format(item.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 space-y-1 border-t border-slate-200 pt-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Items</span>
                    <span className="font-medium text-slate-800 tabular-nums">
                      {totalCount} {totalCount === 1 ? 'pc' : 'pcs'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-base font-bold text-slate-950 tabular-nums">
                      {CURRENCY_FORMATTER.format(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment type */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-700">Payment Type</span>
                <div role="radiogroup" aria-label="Payment type" className="grid grid-cols-3 gap-2">
                  {PAYMENT_OPTIONS.map(({ value, label, icon: Icon }) => {
                    const selected = paymentMethod === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        disabled={isProcessing}
                        aria-checked={selected}
                        onClick={() => setPaymentMethod(value)}
                        className={cn(
                          'flex h-11 flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors',
                          selected
                            ? 'border-[#1D6CE0] bg-[#1D6CE0] text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-[#1D6CE0] hover:text-[#1554B3]'
                        )}
                      >
                        <Icon className="size-4 stroke-[1.75]" aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isProcessing}
                onClick={handleClose}
                className="border-slate-300 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirm}
                className="gap-2 bg-[#1D6CE0] text-white hover:bg-[#1554B3]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm</span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
