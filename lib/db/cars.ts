import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Car, FilterOptions } from '@/types/car';

const CARS_COLLECTION = 'cars';

// Firestore car'ı Car tipine dönüştür
const firestoreTocar = (id: string, data: Record<string, unknown>): Car => ({
  id,
  brand: String(data.brand || ''),
  model: String(data.model || ''),
  year: Number(data.year || 0),
  price: Number(data.price || 0),
  km: Number(data.km || 0),
  fuelType: (data.fuelType as Car['fuelType']) || 'Benzin',
  transmissionType: (data.transmissionType as Car['transmissionType']) || 'Manuel',
  color: String(data.color || ''),
  description: String(data.description || ''),
  images: (data.images as string[]) || [],
  status: (data.status as Car['status']) || 'available',
  featured: Boolean(data.featured),
  soldAt: (data.soldAt as Timestamp)?.toDate(),
  createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
  updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
});

// Tüm araçları getir
export async function getAllCars(): Promise<Car[]> {
  try {
    const carsRef = collection(db, CARS_COLLECTION);
    const q = query(carsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => firestoreTocar(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting cars:', error);
    return [];
  }
}

// Öne çıkan araçları getir
export async function getFeaturedCars(): Promise<Car[]> {
  try {
    const carsRef = collection(db, CARS_COLLECTION);
    const q = query(
      carsRef,
      where('featured', '==', true),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => firestoreTocar(doc.id, doc.data()));
  } catch (error) {
    console.error('Error getting featured cars:', error);
    return [];
  }
}

// Satılan araçları getir
export async function getSoldCars(): Promise<Car[]> {
  try {
    const carsRef = collection(db, CARS_COLLECTION);
    // Index hatasından kaçınmak için sadece status filtresi uyguluyoruz
    // Sıralamayı client-side yapacağız
    const q = query(
      carsRef,
      where('status', '==', 'sold')
    );

    const snapshot = await getDocs(q);
    const cars = snapshot.docs.map((doc) => firestoreTocar(doc.id, doc.data()));

    // Client-side sorting
    return cars.sort((a, b) => {
      const dateA = a.soldAt || a.updatedAt || new Date(0);
      const dateB = b.soldAt || b.updatedAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting sold cars:', error);
    return [];
  }
}

// Filtreleme ile araç getir
export async function getFilteredCars(filters: FilterOptions): Promise<Car[]> {
  try {
    const carsRef = collection(db, CARS_COLLECTION);
    let q = query(carsRef);

    // Status filtresi: Hem available hem de son 30 günde satılmış olanları getir
    // Firestore'da OR sorgusu olmadığı için client-side filtreleme yapacağız veya
    // status filtresini kaldırıp hepsini çekip filtreleyeceğiz.
    // Performans için şimdilik hepsini çekip filtreleyelim (veri az olduğu varsayımıyla)
    // İleride 'in' operatörü ile status in ['available', 'sold'] yapılabilir.

    // q = query(q, where('status', 'in', ['available', 'sold'])); 
    // Not: 'in' operatörü için index gerekebilir, şimdilik client side yapalım.

    if (filters.brand) {
      q = query(q, where('brand', '==', filters.brand));
    }

    if (filters.fuelType) {
      q = query(q, where('fuelType', '==', filters.fuelType));
    }

    if (filters.transmissionType) {
      q = query(q, where('transmissionType', '==', filters.transmissionType));
    }

    const snapshot = await getDocs(q);
    let cars = snapshot.docs.map((doc) => firestoreTocar(doc.id, doc.data()));

    // Status ve Tarih Filtrelemesi
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    cars = cars.filter((car) => {
      if (car.status === 'available') return true;
      if (car.status === 'sold') {
        const saleDate = car.soldAt || car.updatedAt;
        return saleDate >= thirtyDaysAgo;
      }
      return false;
    });

    // Client-side filtering (Firestore range queries için)
    if (filters.minYear) {
      cars = cars.filter((car) => car.year >= filters.minYear!);
    }
    if (filters.maxYear) {
      cars = cars.filter((car) => car.year <= filters.maxYear!);
    }
    if (filters.minPrice) {
      cars = cars.filter((car) => car.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      cars = cars.filter((car) => car.price <= filters.maxPrice!);
    }
    if (filters.minKm) {
      cars = cars.filter((car) => car.km >= filters.minKm!);
    }
    if (filters.maxKm) {
      cars = cars.filter((car) => car.km <= filters.maxKm!);
    }
    if (filters.model) {
      cars = cars.filter((car) => car.model === filters.model);
    }

    // Sıralama
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          cars.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          cars.sort((a, b) => b.price - a.price);
          break;
        case 'year-asc':
          cars.sort((a, b) => a.year - b.year);
          break;
        case 'year-desc':
          cars.sort((a, b) => b.year - a.year);
          break;
        case 'km-asc':
          cars.sort((a, b) => a.km - b.km);
          break;
        case 'km-desc':
          cars.sort((a, b) => b.km - a.km);
          break;
      }
    }

    return cars;
  } catch (error) {
    console.error('Error filtering cars:', error);
    return [];
  }
}

// ID ile araç getir
export async function getCarById(id: string): Promise<Car | null> {
  try {
    const carRef = doc(db, CARS_COLLECTION, id);
    const snapshot = await getDoc(carRef);
    if (!snapshot.exists()) return null;
    return firestoreTocar(snapshot.id, snapshot.data());
  } catch (error) {
    console.error('Error getting car:', error);
    return null;
  }
}

// Yeni araç ekle
export async function addCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CARS_COLLECTION), {
      ...carData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
}

// Araç güncelle
export async function updateCar(id: string, carData: Partial<Car>): Promise<void> {
  try {
    const carRef = doc(db, CARS_COLLECTION, id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: carId, createdAt, ...updateData } = carData;
    await updateDoc(carRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
}

// Araç sil
export async function deleteCar(id: string): Promise<void> {
  try {
    const carRef = doc(db, CARS_COLLECTION, id);
    await deleteDoc(carRef);
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}

// Benzersiz marka listesi
export async function getUniqueBrands(): Promise<string[]> {
  try {
    const cars = await getAllCars();
    const brands = [...new Set(cars.map((car) => car.brand))];
    return brands.sort();
  } catch (error) {
    console.error('Error getting brands:', error);
    return [];
  }
}

// Markaya göre model listesi
export async function getModelsByBrand(brand: string): Promise<string[]> {
  try {
    const cars = await getAllCars();
    const models = [...new Set(cars.filter((car) => car.brand === brand).map((car) => car.model))];
    return models.sort();
  } catch (error) {
    console.error('Error getting models:', error);
    return [];
  }
}
