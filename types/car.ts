export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuelType: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG';
  transmissionType: 'Manuel' | 'Otomatik';
  color: string;
  description: string;
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  carId?: string;
  createdAt: Date;
}

export type FilterOptions = {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minKm?: number;
  maxKm?: number;
  fuelType?: string;
  transmissionType?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc' | 'km-asc' | 'km-desc';
};

