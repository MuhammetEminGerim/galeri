'use client';

import { useEffect, useState } from 'react';
import { Car } from '@/types/car';
import { getCarById } from '@/lib/db/cars';
import { useFavorites } from '@/hooks/useFavorites';
import { CarCard } from '@/components/car-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavorilerimPage() {
  const { favorites } = useFavorites();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavoriteCars() {
      setLoading(true);
      try {
        const carPromises = favorites.map((id) => getCarById(id));
        const loadedCars = await Promise.all(carPromises);
        setCars(loadedCars.filter((car) => car !== null) as Car[]);
      } catch (error) {
        console.error('Error loading favorite cars:', error);
      } finally {
        setLoading(false);
      }
    }

    if (favorites.length > 0) {
      loadFavoriteCars();
    } else {
      setLoading(false);
      setCars([]);
    }
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          Favorilerim
        </h1>
        <p className="text-muted-foreground">
          {loading ? 'Favoriler yükleniyor...' : `${cars.length} favori araç`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Henüz favori araç eklemediniz</h2>
          <p className="text-muted-foreground mb-6">
            Beğendiğiniz araçları favorilere ekleyerek buradan kolayca ulaşabilirsiniz.
          </p>
          <Link href="/araclar">
            <Button>Araçları İncele</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
