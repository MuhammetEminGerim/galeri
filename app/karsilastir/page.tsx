'use client';

import { useEffect, useState } from 'react';
import { Car } from '@/types/car';
import { getCarById } from '@/lib/db/cars';
import { useCompare } from '@/hooks/useCompare';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatKm } from '@/lib/utils/formatters';

export default function KarsilastirPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompareCars() {
      setLoading(true);
      try {
        const carPromises = compareList.map((id) => getCarById(id));
        const loadedCars = await Promise.all(carPromises);
        setCars(loadedCars.filter((car) => car !== null) as Car[]);
      } catch (error) {
        console.error('Error loading compare cars:', error);
      } finally {
        setLoading(false);
      }
    }

    if (compareList.length > 0) {
      loadCompareCars();
    } else {
      setLoading(false);
      setCars([]);
    }
  }, [compareList]);

  const comparisonFields = [
    { label: 'Fiyat', key: 'price', format: formatPrice },
    { label: 'Yıl', key: 'year', format: (val: number) => val.toString() },
    { label: 'Kilometre', key: 'km', format: formatKm },
    { label: 'Yakıt Tipi', key: 'fuelType', format: (val: string) => val },
    { label: 'Vites Tipi', key: 'transmissionType', format: (val: string) => val },
    { label: 'Renk', key: 'color', format: (val: string) => val },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" />
            Araç Karşılaştır
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Araçlar yükleniyor...' : `${cars.length} araç karşılaştırılıyor`}
          </p>
        </div>
        {cars.length > 0 && (
          <Button variant="outline" className="!border !border-gray-500 dark:!border-gray-600" onClick={clearCompare}>
            Tümünü Temizle
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Karşılaştırma listesi boş</h2>
          <p className="text-muted-foreground mb-6">
            Araç listesinden en fazla 3 araç seçerek karşılaştırma yapabilirsiniz.
          </p>
          <Link href="/araclar">
            <Button>Araçları İncele</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Card key={car.id} className="relative !border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => removeFromCompare(car.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <CardHeader className="p-0">
                    <Link href={`/araclar/detay?id=${car.id}`}>
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        {car.images && car.images.length > 0 ? (
                          <Image
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-muted">
                            <span className="text-muted-foreground">Resim Yok</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    <Link href={`/araclar/detay?id=${car.id}`}>
                      <h3 className="text-lg font-semibold">
                        {car.brand} {car.model}
                      </h3>
                    </Link>

                    {comparisonFields.map((field) => (
                      <div key={field.key} className="flex justify-between !border-b !border-gray-500 dark:!border-gray-600 pb-2">
                        <span className="text-sm text-muted-foreground">{field.label}</span>
                        <span className="text-sm font-medium">
                          {field.format(car[field.key as keyof Car] as never)}
                        </span>
                      </div>
                    ))}

                    <Link href={`/araclar/detay?id=${car.id}`}>
                      <Button variant="outline" className="w-full mt-4 !border !border-gray-500 dark:!border-gray-600">
                        Detayları Gör
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {cars.length > 0 && cars.length < 3 && (
        <div className="mt-8 text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Daha fazla araç ekleyerek karşılaştırma yapabilirsiniz. (En fazla 3 araç)
          </p>
          <Link href="/araclar">
            <Button variant="link">Araç Listesine Dön</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
