import type { PaintSwatch } from '@/types/auth';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
} as const;

export const LOGIN_CONTENT = {
  adminBadge: 'Admin',
  heroImage: '/images/login-hero-bears.jpg',
  heroAlt: 'Bare Bears paintable figures with colorful paint splashes and Unleash Your Creativity',
  heading: 'Sign in',
  usernameLabel: 'Username',
  usernamePlaceholder: 'admin',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  forgotPasswordLabel: 'Forgot?',
  submitLabel: 'Sign in',
  submittingLabel: 'Signing in...',
  invalidCredentialsError: 'Invalid username or password.',
} as const;

export const PAINT_SWATCHES: PaintSwatch[] = [
  { name: 'Cobalt', colorClass: 'bg-[#1D6CE0]' },
  { name: 'Crimson', colorClass: 'bg-[#E5242A]' },
  { name: 'Yellow', colorClass: 'bg-[#F5B700]' },
  { name: 'Green', colorClass: 'bg-[#169C46]' },
  { name: 'Violet', colorClass: 'bg-[#8E24E5]' },
];
