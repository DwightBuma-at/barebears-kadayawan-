import type { AdminNotification } from '@/types/notification';

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New order received',
    description: 'Order #BB-1042 for Kadayawan Fluid Bear Kit.',
    time: '2m ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Low stock alert',
    description: 'Classic White 23cm Bear has 4 units remaining.',
    time: '1h ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Daily summary ready',
    description: 'Yesterday closed with 18 completed orders.',
    time: 'Yesterday',
    read: true,
  },
];
