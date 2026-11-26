import { Route, Routes } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { AuditLogs } from '@/pages/auditLogs/AuditLogs';
import { Booking } from '@/pages/booking/Booking';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { Inventory } from '@/pages/inventory/Inventory';
import { LandingPage } from '@/pages/landingPage/LandingPage';
import { Ordering } from '@/pages/ordering/Ordering';
import { PackageMaker } from '@/pages/packageMaker/PackageMaker';
import { Pos } from '@/pages/pos/Pos';
import { Sales } from '@/pages/sales/Sales';
import { Settings } from '@/pages/settings/Settings';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/package-maker" element={<PackageMaker />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/ordering" element={<Ordering />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
