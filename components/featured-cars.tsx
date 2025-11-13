'use client';

import { useEffect, useState } from 'react';
import { Car } from '@/types/car';
import { getFeaturedCars } from '@/lib/db/cars';
import { CarCard } from './car-card';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      try {
        const featuredCars = await getFeaturedCars();
        setCars(featuredCars);
      } catch (error) {
        console.error('Error loading featured cars:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCars();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Öne Çıkan Araçlar</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sizin için özenle seçtiğimiz en popüler ve kaliteli araçlarımızı keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/araclar">
            <Button size="lg" variant="outline" className="group">
              Tüm Araçları Görüntüle
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

