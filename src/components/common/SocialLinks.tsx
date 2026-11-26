import { SOCIAL_LINKS } from '@/data/site';
import { cn } from '@/lib/utils';

export interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-4 text-sm', className)}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
