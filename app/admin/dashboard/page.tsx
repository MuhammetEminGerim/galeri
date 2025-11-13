'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { getAllCars } from '@/lib/db/cars';
import { getAllContacts } from '@/lib/db/contacts';
import { Car as CarType } from '@/types/car';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AdminDashboard() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [contactsCount, setContactsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [carsData, contactsData] = await Promise.all([
          getAllCars(),
          getAllContacts(),
        ]);
        setCars(carsData);
        setContactsCount(contactsData.length);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const availableCars = cars.filter((car) => car.status === 'available');
  const soldCars = cars.filter((car) => car.status === 'sold');
  const totalValue = availableCars.reduce((sum, car) => sum + car.price, 0);
  const recentCars = cars.slice(0, 5);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Günaydın' : currentHour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const stats = [
    {
      title: 'Toplam Araç',
      value: cars.length,
      icon: Car,
      description: `${availableCars.length} satışta`,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'Satılan Araçlar',
      value: soldCars.length,
      icon: TrendingUp,
      description: 'Bu ay',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
    },
    {
      title: 'Toplam Değer',
      value: formatPrice(totalValue),
      icon: DollarSign,
      description: 'Stok değeri',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
    },
    {
      title: 'Mesajlar',
      value: contactsCount,
      icon: Eye,
      description: 'Toplam mesaj',
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
    },
  ];

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {greeting}, Admin! 👋
              </h1>
              <p className="text-muted-foreground text-lg">İşletmenizin genel durumunu buradan takip edebilirsiniz</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bugün</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`group !border !border-gray-500 dark:!border-gray-600 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:!shadow-[0_8px_16px_rgba(0,0,0,0.25)] dark:hover:!shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
                      <Icon className="w-full h-full" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Cars */}
          <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <CardTitle>Son Eklenen Araçlar</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : recentCars.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Henüz araç eklenmemiş</p>
              ) : (
                <div className="space-y-3">
                  {recentCars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group flex items-center gap-4 p-3 rounded-xl !border !border-gray-500 dark:!border-gray-600 !shadow-[0_1px_4px_rgba(0,0,0,0.15)] dark:!shadow-[0_1px_4px_rgba(0,0,0,0.4)] hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:!shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:hover:!shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1"
                    >
                      {car.images && car.images.length > 0 && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-sm text-muted-foreground">{car.year} • {car.fuelType}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                          {formatPrice(car.price)}
                        </p>
                        <Link href={`/admin/araclar/${car.id}`}>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            Düzenle →
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-4">
              <Link href="/admin/araclar/yeni" className="block">
                <Button className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all" size="lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <Car className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Yeni Araç Ekle</span>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/araclar" className="block">
                <Button variant="outline" className="w-full group !border-2 !border-gray-500 dark:!border-gray-600 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/20 dark:hover:to-purple-950/20 shadow-md hover:shadow-lg transition-all" size="lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Tüm Araçları Görüntüle</span>
                  </div>
                </Button>
              </Link>
              <Link href="/" target="_blank" className="block">
                <Button variant="outline" className="w-full group !border-2 !border-gray-500 dark:!border-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/20 dark:hover:to-teal-950/20 shadow-md hover:shadow-lg transition-all" size="lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                      <Eye className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Siteyi Görüntüle</span>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
