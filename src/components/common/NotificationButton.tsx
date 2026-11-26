import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { INITIAL_NOTIFICATIONS } from '@/data/notifications';
import type { AdminNotification } from '@/types/notification';

export interface NotificationButtonProps {
  initialItems?: AdminNotification[];
}

export function NotificationButton({
  initialItems = INITIAL_NOTIFICATIONS,
}: NotificationButtonProps) {
  const [items, setItems] = useState<AdminNotification[]>(initialItems);
  const unreadCount = items.filter((item) => !item.read).length;

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleMarkOneRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative size-9 rounded-lg border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950"
        >
          <Bell className="size-4 stroke-[1.75]" aria-hidden="true" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#E5242A] text-[10px] font-bold text-white tabular-nums">
              {unreadCount}
              <span className="sr-only"> unread</span>
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 rounded-xl border-slate-200 bg-white p-1.5">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-slate-900">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1554B3] hover:underline"
            >
              <CheckCheck className="size-3.5" aria-hidden="true" />
              <span>Mark all read</span>
            </button>
          ) : null}
        </div>

        <DropdownMenuSeparator className="bg-slate-100" />

        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-slate-500">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleMarkOneRead(item.id)}
              className="flex cursor-pointer flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 focus:bg-slate-50"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  {!item.read ? (
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-[#1D6CE0]"
                    />
                  ) : null}
                  {item.title}
                </span>
                <span className="shrink-0 text-[11px] text-slate-500">{item.time}</span>
              </div>
              <p className="text-xs leading-snug text-slate-600">{item.description}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
