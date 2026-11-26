import { Outlet } from 'react-router';
import { AdminHeader } from '@/components/common/AdminHeader';
import { Sidebar } from '@/components/common/Sidebar';

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-slate-900 lg:flex-row">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <AdminHeader />
        <div className="min-w-0 flex-1 bg-white">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
