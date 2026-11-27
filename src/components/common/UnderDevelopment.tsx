import { Construction } from 'lucide-react';

export interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

export function UnderDevelopment({
  title,
  description = 'This module is currently under development and will be available soon.',
}: UnderDevelopmentProps) {
  return (
    <section className="flex h-[calc(100dvh-3.5rem)] items-center justify-center p-4 sm:p-6">
      <div className="flex max-w-md flex-col items-center rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-xs">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#1D6CE0]/10 text-[#1D6CE0]">
          <Construction className="size-6" aria-hidden="true" />
        </div>
        <span className="mb-2 inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          Under Development
        </span>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">{description}</p>
      </div>
    </section>
  );
}
