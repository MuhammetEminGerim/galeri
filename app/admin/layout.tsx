'use client';

import { AdminHeader } from '@/components/admin/admin-header';
import { AuthGuard } from '@/components/admin/auth-guard';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Login sayfası için AuthGuard'ı atla
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}

