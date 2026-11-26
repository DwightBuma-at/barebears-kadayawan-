import { cn } from '@/lib/utils';

const KADAYAWAN_LETTERS = [
  { char: 'K', colorClass: 'text-[#D92323]' },
  { char: 'a', colorClass: 'text-[#D95B16]' },
  { char: 'd', colorClass: 'text-[#1D70B8]' },
  { char: 'a', colorClass: 'text-[#1D70B8]' },
  { char: 'y', colorClass: 'text-[#2E7D32]' },
  { char: 'a', colorClass: 'text-[#4A7C24]' },
  { char: 'w', colorClass: 'text-[#9C27B0]' },
  { char: 'a', colorClass: 'text-[#6A1B9A]' },
  { char: 'n', colorClass: 'text-[#C27803]' },
] as const;

export interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div
      className={cn('inline-flex flex-col leading-none select-none', className)}
      aria-label="Bare Bears Kadayawan"
    >
      <span className="text-foreground text-[13px] font-extrabold tracking-[0.06em] uppercase">
        BARE BEARS
      </span>
      <span aria-hidden="true" className="mt-0.5 font-serif text-[15px] font-bold tracking-tight">
        {KADAYAWAN_LETTERS.map((item, index) => (
          <span key={`${item.char}-${index}`} className={item.colorClass}>
            {item.char}
          </span>
        ))}
      </span>
    </div>
  );
}
