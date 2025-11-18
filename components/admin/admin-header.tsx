'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { LogOut, LayoutDashboard, ListIcon, PlusCircle, ExternalLink } from 'lucide-react';
import { signOutAdmin } from '@/lib/db/auth';
import { toast } from 'sonner';

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      toast.success('Çıkış yapıldı');
      router.push('/admin/login');
    } catch {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { href: '/admin/araclar', label: 'Araçlar', icon: ListIcon, gradient: 'from-violet-500 to-purple-500' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full !border-b !border-gray-300 dark:!border-gray-700 bg-gradient-to-r from-background via-blue-50/30 to-background dark:from-background dark:via-blue-950/20 dark:to-background backdrop-blur supports-[backdrop-filter]:bg-background/60 !shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-12 h-12 p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="Bölen Otomotiv"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Bölen Otomotiv
              </span>
              <span className="block text-[10px] text-muted-foreground -mt-1">Admin Panel</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 !border !border-gray-400 dark:!border-gray-600 shadow-md' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`p-1 rounded-md ${
                    isActive 
                      ? `bg-gradient-to-br ${link.gradient}` 
                      : 'bg-gray-200 dark:bg-gray-700'
                  } transition-all duration-300`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}>
                    {link.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Quick Add Button */}
            <Link href="/admin/araclar/yeni">
              <Button 
                size="sm" 
                className="ml-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Yeni Araç Ekle
              </Button>
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button 
              variant="outline" 
              size="sm" 
              className="group !border-2 !border-gray-500 dark:!border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink className="h-4 w-4 mr-1.5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Siteyi Görüntüle</span>
              <span className="sm:hidden">Site</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Çıkış</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

