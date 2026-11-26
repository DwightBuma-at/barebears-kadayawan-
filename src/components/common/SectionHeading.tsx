import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description ? (
        <p className="text-muted-foreground max-w-2xl text-base">{description}</p>
      ) : null}
    </div>
  );
}
