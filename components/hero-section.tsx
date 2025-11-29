'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Users, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomerGalleryDialog } from './customer-gallery-dialog';
import { SoldCarsDialog } from './sold-cars-dialog';

export function HeroSection() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [soldCarsOpen, setSoldCarsOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-background dark:from-slate-900 dark:via-blue-950/20 dark:to-background py-24 md:py-36">
      <CustomerGalleryDialog open={galleryOpen} onOpenChange={setGalleryOpen} />
      <SoldCarsDialog open={soldCarsOpen} onOpenChange={setSoldCarsOpen} />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Keyifle Yola{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Çıkın</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            10 yıllık tecrübemiz ve yeni yüzümüzle<br />size en uygun aracı bulmak için buradayız
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto"
        >
          {[
            {
              label: 'Mutlu Müşteri',
              value: '100+',
              gradient: 'from-violet-500 to-purple-500',
              onClick: () => setGalleryOpen(true),
              className: 'cursor-pointer hover:scale-105 active:scale-95',
            },
            {
              label: 'Satılan Araç',
              value: '100+',
              gradient: 'from-rose-500 to-pink-500',
              onClick: () => setSoldCarsOpen(true),
              className: 'cursor-pointer hover:scale-105 active:scale-95',
            },
            {
              label: 'Tecrübe',
              value: '10 Yıl',
              gradient: 'from-amber-500 to-orange-500',
            },
            {
              label: 'Garanti',
              value: '%100',
              gradient: 'from-emerald-500 to-teal-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden text-center p-6 rounded-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${stat.className || ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              onClick={stat.onClick}
            >
              <div className={`relative z-10 text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="relative z-10 text-sm font-medium text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[32rem] h-[32rem] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

