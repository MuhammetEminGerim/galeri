'use client';

import { HeroSection } from '@/components/hero-section';
import { FeaturedCars } from '@/components/featured-cars';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Clock,
  Award,
  HeadphonesIcon,
  Car,
  Wrench,
  BadgeCheck,
  Navigation,
  Video,
  CreditCard,
  Gauge,
  ArrowRightLeft,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ServiceItem = {
  icon: any;
  title: string;
  description: string;
  badge: string;
  gradient: string;
  iconGradient: string;
  image?: string;
};

export default function HomePage() {
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const services: ServiceItem[] = [
    {
      icon: ArrowRightLeft,
      title: 'Değerinde Alım & Satım',
      description: 'Aracınızı değerinde alıp, nakit veya takas imkanı sunuyoruz.',
      badge: 'Takas',
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
      iconGradient: 'from-rose-500 to-pink-400',
      image: '/footer_photo/degerindealimsatim.jpg'
    },
    {
      icon: Car,
      title: 'Showroom Araç Satışı',
      description: 'Her segmentte, ekspertiz raporlu ve garantili araç portföyü.',
      badge: 'Satış',
      gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
      iconGradient: 'from-blue-500 to-cyan-400',
      image: '/footer_photo/showroonaracsatisi.jpg'
    },
    {
      icon: Video,
      title: 'Görüntülü Arama ile Gösterim',
      description: 'Aracı yerinden kalkmadan görüntülü arama ile detaylı inceleyin.',
      badge: 'Online',
      gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
      iconGradient: 'from-purple-500 to-violet-400',
      image: '/footer_photo/goruntuluaramailegosterim.jpg'
    },
    {
      icon: CreditCard,
      title: 'Kredi Kartına Taksit İmkanı',
      description: 'Anlaşmalı kredi kartlarına 12 taksite varan ödeme kolaylığı.',
      badge: 'Ödeme',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      iconGradient: 'from-amber-500 to-orange-400',
      image: '/footer_photo/kredikartinataksitimkani.jpg'
    },
    {
      icon: Gauge,
      title: 'Test Sürüşü',
      description: 'Beğendiğiniz aracı test ederek performansını yakından görün.',
      badge: 'Deneyim',
      gradient: 'from-red-500/20 via-orange-500/10 to-transparent',
      iconGradient: 'from-red-500 to-orange-400',
      image: '/footer_photo/testsurusu.jpg'
    },
    {
      icon: Shield,
      title: 'Ekspertiz & Sigorta',
      description: 'Detaylı ekspertiz, sigorta ve kasko çözümlerini tek noktadan sunuyoruz.',
      badge: 'Güven',
      gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
      iconGradient: 'from-emerald-500 to-teal-400',
      image: '/footer_photo/ekspertizsigorta.jpg'
    },
    {
      icon: BadgeCheck,
      title: 'Satış Sonrası Destek',
      description: 'Garanti süreçleri, yedek parça ve servis yönlendirmesi ile yanınızdayız.',
      badge: 'Destek',
      gradient: 'from-indigo-500/20 via-violet-500/10 to-transparent',
      iconGradient: 'from-indigo-500 to-violet-400',
      image: '/footer_photo/satisonrasidestek.jpg'
    },
  ];

  const handleScroll = (direction: 'prev' | 'next') => {
    if (!servicesRef.current) return;
    const container = servicesRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <HeroSection />
      <FeaturedCars />

      {/* Features Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-gray-200/60 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:border-gray-700/60 dark:shadow-[0_15px_45px_rgba(0,0,0,0.45)]">
            <div className="px-5 py-8 sm:px-16">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
                <div className="flex-1">
                  <p className="text-sm font-semibold tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-2">
                    Ürün ve Hizmetlerimiz
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                    Neden Bizi Tercih Etmelisiniz?
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
                    Satış öncesinden satış sonrasına uzman ekibimizle sizin için değer katan hizmetler sunuyoruz.
                  </p>
                </div>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div className="relative overflow-hidden rounded-2xl border-0 bg-gray-900/90 text-white h-[250px] group cursor-pointer">
                            {/* Background Image or Gradient */}
                            {service.image ? (
                              <>
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
                              </>
                            ) : (
                              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                            )}

                            <div className="flex flex-col items-center justify-center h-full p-6 space-y-4 relative z-10">
                              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-center leading-tight">
                                {service.title}
                              </h3>
                              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                                {service.badge}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 h-12 w-12 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white dark:border-gray-700 dark:bg-slate-900/80 dark:hover:bg-slate-900" />
                <CarouselNext className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 h-12 w-12 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white dark:border-gray-700 dark:bg-slate-900/80 dark:hover:bg-slate-900" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
