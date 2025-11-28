'use client';

import { useState, useEffect } from 'react';
import { Car, FilterOptions } from '@/types/car';
import { getFilteredCars } from '@/lib/db/cars';
import { CarCard } from '@/components/car-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AraclarContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initialize filters from URL on mount
  useEffect(() => {
    const fuelType = searchParams.get('fuelType');
    if (fuelType) {
      setFilters(prev => ({ ...prev, fuelType }));
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadCars() {
      setLoading(true);
      try {
        const filteredCars = await getFilteredCars(filters);
        setCars(filteredCars);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCars();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Araçlarımız</h1>
        <p className="text-muted-foreground">
          {loading ? 'Araçlar yükleniyor...' : `${cars.length} araç bulundu`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-20">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter + View Mode */}
          <div className="flex items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
                <FilterSidebar filters={filters} onFiltersChange={setFilters} />
              </SheetContent>
            </Sheet>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cars Grid/List */}
          {loading ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-6'
              }
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                Aradığınız kriterlere uygun araç bulunamadı.
              </p>
              <Button variant="outline" onClick={() => setFilters({})}>
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-6'
              }
            >
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AraclarPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Yükleniyor...</div>}>
      <AraclarContent />
    </Suspense>
  );
}
