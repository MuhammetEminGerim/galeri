'use client';

import { useState } from 'react';
import { CarCard } from '@/components/car-card';
import { Car } from '@/types/car';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SORT_OPTIONS } from '@/lib/constants';

interface CarsListProps {
  cars: Car[];
  onSortChange?: (sortBy: string) => void;
}

export function CarsList({ cars, onSortChange }: CarsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{cars.length}</span> araç bulundu
        </p>

        <div className="flex items-center gap-4">
          {/* Görünüm Modu */}
          <div className="flex items-center gap-1 rounded-md border p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sıralama */}
          <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Araç Listesi */}
      {cars.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Araç bulunamadı</p>
            <p className="text-sm text-muted-foreground">
              Farklı filtreler deneyin
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grid'
              ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1'
          )}
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

