import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { NotificationButton } from '@/components/common/NotificationButton';
import { cn } from '@/lib/utils';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/package-maker': 'Package Maker',
  '/pos': 'POS',
  '/sales': 'Sales',
  '/ordering': 'Ordering',
  '/booking': 'Booking',
  '/audit-logs': 'Audit Logs',
  '/settings': 'Settings',
};

export interface AdminHeaderProps {
  title?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminHeader({ title, actions, className }: AdminHeaderProps) {
  const { pathname } = useLocation();
  const resolvedTitle = title ?? ROUTE_TITLES[pathname] ?? 'Admin';

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-300 bg-white px-4 sm:px-6',
        className
      )}
    >
      <h1 className="text-sm font-semibold tracking-tight text-slate-900">{resolvedTitle}</h1>

      <div className="flex items-center gap-3">
        {actions}
        <NotificationButton />
      </div>
    </header>
  );
}
