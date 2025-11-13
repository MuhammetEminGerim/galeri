'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { FilterOptions } from '@/types/car';
import { FUEL_TYPES, TRANSMISSION_TYPES, SORT_OPTIONS } from '@/lib/constants';
import { getUniqueBrands, getModelsByBrand } from '@/lib/db/cars';
import { Separator } from './ui/separator';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose?: () => void;
}

export function FilterSidebar({ filters, onFiltersChange, onClose }: FilterSidebarProps) {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [yearRange, setYearRange] = useState([2000, 2024]);
  const [kmRange, setKmRange] = useState([0, 300000]);

  useEffect(() => {
    async function loadBrands() {
      const brandList = await getUniqueBrands();
      setBrands(brandList);
    }
    loadBrands();
  }, []);

  useEffect(() => {
    async function loadModels() {
      if (filters.brand) {
        const modelList = await getModelsByBrand(filters.brand);
        setModels(modelList);
      } else {
        setModels([]);
      }
    }
    loadModels();
  }, [filters.brand]);

  const handleBrandChange = (value: string) => {
    onFiltersChange({
      ...filters,
      brand: value === 'all' ? undefined : value,
      model: undefined,
    });
  };

  const handleModelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      model: value === 'all' ? undefined : value,
    });
  };

  const handleFuelTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      fuelType: value === 'all' ? undefined : value,
    });
  };

  const handleTransmissionChange = (value: string) => {
    onFiltersChange({
      ...filters,
      transmissionType: value === 'all' ? undefined : value,
    });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as FilterOptions['sortBy'],
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handlePriceCommit = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleYearChange = (values: number[]) => {
    setYearRange(values);
  };

  const handleYearCommit = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minYear: values[0],
      maxYear: values[1],
    });
  };

  const handleKmChange = (values: number[]) => {
    setKmRange(values);
  };

  const handleKmCommit = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minKm: values[0],
      maxKm: values[1],
    });
  };

  const handleReset = () => {
    onFiltersChange({});
    setPriceRange([0, 5000000]);
    setYearRange([2000, 2024]);
    setKmRange([0, 300000]);
  };

  return (
    <div className="space-y-6 bg-background p-4 rounded-lg !border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtreler</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Sıralama */}
      <div className="space-y-2">
        <Label>Sıralama</Label>
        <Select value={filters.sortBy || ''} onValueChange={handleSortChange}>
          <SelectTrigger>
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

      <Separator />

      {/* Marka */}
      <div className="space-y-2">
        <Label>Marka</Label>
        <Select value={filters.brand || 'all'} onValueChange={handleBrandChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tüm Markalar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Markalar</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model */}
      {filters.brand && models.length > 0 && (
        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={filters.model || 'all'} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tüm Modeller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Modeller</SelectItem>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />

      {/* Fiyat Aralığı */}
      <div className="space-y-4">
        <Label>
          Fiyat: {priceRange[0].toLocaleString('tr-TR')} ₺ -{' '}
          {priceRange[1].toLocaleString('tr-TR')} ₺
        </Label>
        <Slider
          min={0}
          max={5000000}
          step={50000}
          value={priceRange}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
        />
      </div>

      <Separator />

      {/* Yıl Aralığı */}
      <div className="space-y-4">
        <Label>
          Yıl: {yearRange[0]} - {yearRange[1]}
        </Label>
        <Slider
          min={2000}
          max={2024}
          step={1}
          value={yearRange}
          onValueChange={handleYearChange}
          onValueCommit={handleYearCommit}
        />
      </div>

      <Separator />

      {/* Kilometre Aralığı */}
      <div className="space-y-4">
        <Label>
          Kilometre: {kmRange[0].toLocaleString('tr-TR')} -{' '}
          {kmRange[1].toLocaleString('tr-TR')} km
        </Label>
        <Slider
          min={0}
          max={300000}
          step={10000}
          value={kmRange}
          onValueChange={handleKmChange}
          onValueCommit={handleKmCommit}
        />
      </div>

      <Separator />

      {/* Yakıt Tipi */}
      <div className="space-y-2">
        <Label>Yakıt Tipi</Label>
        <Select value={filters.fuelType || 'all'} onValueChange={handleFuelTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            {FUEL_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vites Tipi */}
      <div className="space-y-2">
        <Label>Vites Tipi</Label>
        <Select
          value={filters.transmissionType || 'all'}
          onValueChange={handleTransmissionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            {TRANSMISSION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <Button variant="outline" className="w-full !border !border-gray-500 dark:!border-gray-600" onClick={handleReset}>
        Filtreleri Temizle
      </Button>
    </div>
  );
}
