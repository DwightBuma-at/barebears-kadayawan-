import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges conditional and conflicting Tailwind classes', () => {
    const isHidden = false;
    expect(cn('px-2 py-1', isHidden && 'hidden', 'px-4')).toBe('py-1 px-4');
  });
});
