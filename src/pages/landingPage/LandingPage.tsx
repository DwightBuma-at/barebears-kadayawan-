import { LoginFormCard } from '@/pages/landingPage/components/LoginFormCard';
import { LoginVisualPanel } from '@/pages/landingPage/components/LoginVisualPanel';

export function LandingPage() {
  return (
    <main className="grid min-h-dvh w-full grid-cols-1 bg-white lg:grid-cols-12">
      <div className="lg:col-span-8">
        <LoginVisualPanel />
      </div>
      <div className="flex items-center justify-center border-t border-slate-100 bg-white lg:col-span-4 lg:border-t-0 lg:border-l">
        <LoginFormCard />
      </div>
    </main>
  );
}
