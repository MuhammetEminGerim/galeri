'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Heart, Menu, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useCompare } from '@/hooks/useCompare';
import { useFavorites } from '@/hooks/useFavorites';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { compareList } = useCompare();
  const { favorites } = useFavorites();

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/araclar', label: 'Araçlar' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full !border-b !border-gray-400 dark:!border-gray-700 bg-background/95 supports-[backdrop-filter]:bg-background/60 !shadow-[0_1px_3px_rgba(0,0,0,0.15)] dark:!shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition duration-300 ${isScrolled ? 'backdrop-blur-md' : ''}`}>
      <div className="mx-auto flex h-16 w-full max-w-none items-center pl-6 pr-0 gap-4">
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
          <div className="flex items-center gap-[2px] leading-none">
            <span className="text-xl font-bold group-hover:text-primary transition-colors">
              Bölen Otomotiv
            </span>
            <div className="relative h-10 w-[88px] md:h-11 md:w-[104px] -ml-4 overflow-hidden">
              <Image
                src="/anniversary-2025.png"
                alt="1. Yıl"
                fill
                sizes="88px"
                className="object-contain -translate-x-2"
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

        {/* Header Banner */}
        <div className="hidden lg:flex flex-1 justify-end">
          <div
            className="relative h-16 flex-1 max-w-[380px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.15)] rounded-l-[999px] rounded-r-[22px]"
            style={{
              backgroundImage: "url('/araba.png')",
              backgroundSize: 'cover',
              backgroundPosition: '90% center',
              clipPath: 'path(\"M0% 0% L100% 0% L100% 100% L35% 100% Q5% 85% 0% 60% Z\")',
              WebkitClipPath: 'path(\"M0% 0% L100% 0% L100% 100% L35% 100% Q5% 85% 0% 60% Z\")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/5 to-transparent" />

            {/* Overlay Icons */}
            <div className="absolute inset-y-0 right-4 flex items-center gap-3 text-white">
              <Link href="/favorilerim">
                <Button variant="ghost" size="icon" className="text-white hover:text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/karsilastir">
                <Button variant="ghost" size="icon" className="text-white hover:text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 lg:hidden">
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
