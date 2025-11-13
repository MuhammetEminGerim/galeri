'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authDB } from '@/lib/db/auth';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = authDB.onAuthChange((user) => {
      setAuthenticated(!!user);
      setLoading(false);

      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (user && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!authenticated && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}

