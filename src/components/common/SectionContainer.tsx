import type { ComponentPropsWithoutRef } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export type SectionContainerProps = ComponentPropsWithoutRef<'section'>;

export function SectionContainer({ className, children, ...props }: SectionContainerProps) {
  return (
    <section className={cn('py-12 md:py-16', className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
