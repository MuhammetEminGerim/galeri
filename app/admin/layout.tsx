import { AdminHeader } from '@/components/admin/admin-header';
import { AuthGuard } from '@/components/admin/auth-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}

