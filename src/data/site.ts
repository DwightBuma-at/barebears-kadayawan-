import type { NavItem, SocialLink } from '@/types/navigation';

export const SITE_CONFIG = {
  name: import.meta.env.VITE_SITE_NAME || 'Bare Bears',
  url: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  description:
    'Frontend application structured with React 19, TypeScript, Vite, and Tailwind CSS v4.',
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Login', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Email', href: 'mailto:hello@example.com' },
];
