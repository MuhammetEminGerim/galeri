'use client';

import { HeroSection } from '@/components/hero-section';
import { FeaturedCars } from '@/components/featured-cars';
import { Button } from '@/components/ui/button';
import { Shield, Clock, Award, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCars />
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Müşterilerimize en iyi hizmeti sunmak için her zaman buradayız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Güvenilir',
                description: 'Tüm araçlarımız detaylı kontrol ve bakımdan geçer.',
                gradient: 'from-blue-500/10 to-cyan-500/10',
                iconGradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Clock,
                title: 'Hızlı Hizmet',
                description: 'Hızlı ve sorunsuz alım-satım süreci.',
                gradient: 'from-violet-500/10 to-purple-500/10',
                iconGradient: 'from-violet-500 to-purple-500',
              },
              {
                icon: Award,
                title: 'Kaliteli',
                description: 'Sadece kaliteli ve temiz araçlar.',
                gradient: 'from-amber-500/10 to-orange-500/10',
                iconGradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: HeadphonesIcon,
                title: 'Destek',
                description: '7/24 müşteri destek hizmeti.',
                gradient: 'from-emerald-500/10 to-teal-500/10',
                iconGradient: 'from-emerald-500 to-teal-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group text-center p-8 rounded-2xl !border !border-gray-500 dark:!border-gray-600 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:!shadow-[0_8px_16px_rgba(0,0,0,0.25)] dark:hover:!shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-2`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.iconGradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Hayalinizdeki Araca Ulaşın</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Geniş araç yelpazemizden size en uygun olanı bulun veya bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/araclar">
                <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl transition-all px-8">
                  Araç Ara
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button size="lg" variant="outline" className="bg-transparent !border-2 !border-white text-white hover:bg-white hover:text-slate-900 shadow-xl transition-all px-8">
                  Bize Ulaşın
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
