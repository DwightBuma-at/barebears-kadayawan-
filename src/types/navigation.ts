import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
}
