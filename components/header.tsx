'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, Menu, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useCompare } from '@/hooks/useCompare';
import { useFavorites } from '@/hooks/useFavorites';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { compareList } = useCompare();
  const { favorites } = useFavorites();

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/araclar', label: 'Araçlar' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full !border-b !border-gray-400 dark:!border-gray-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 !shadow-[0_1px_3px_rgba(0,0,0,0.15)] dark:!shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="Bölen Otomotiv"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-3 leading-none">
            <span className="text-xl font-bold group-hover:text-primary transition-colors">
              Bölen Otomotiv
            </span>
            <div className="relative h-10 w-28">
              <Image
                src="/anniversary.png"
                alt="1. Yıl"
                fill
                sizes="112px"
                className="object-contain"
                priority={false}
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Link href="/favorilerim">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/karsilastir">
            <Button variant="ghost" size="icon" className="relative hidden md:inline-flex">
              <Search className="h-5 w-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden !border-t !border-gray-400 dark:!border-gray-700">
          <nav className="container mx-auto flex flex-col space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/karsilastir"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Karşılaştır {compareList.length > 0 && `(${compareList.length})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
