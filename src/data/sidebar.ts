import {
  Boxes,
  CalendarCheck,
  ClipboardList,
  FileClock,
  Gift,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import type { SidebarGroup } from '@/types/navigation';

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        id: 'sales',
        label: 'Sales',
        to: '/sales',
        icon: TrendingUp,
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        id: 'pos',
        label: 'POS',
        to: '/pos',
        icon: ShoppingCart,
      },
      {
        id: 'inventory',
        label: 'Inventory',
        to: '/inventory',
        icon: Boxes,
      },
      {
        id: 'package-maker',
        label: 'Package Maker',
        to: '/package-maker',
        icon: Gift,
      },
      {
        id: 'ordering',
        label: 'Ordering',
        to: '/ordering',
        icon: ClipboardList,
      },
      {
        id: 'booking',
        label: 'Booking',
        to: '/booking',
        icon: CalendarCheck,
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        to: '/audit-logs',
        icon: FileClock,
      },
      {
        id: 'settings',
        label: 'Settings',
        to: '/settings',
        icon: Settings,
      },
    ],
  },
];
