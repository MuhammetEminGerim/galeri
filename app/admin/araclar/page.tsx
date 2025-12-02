'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Car } from '@/types/car';
import { getAllCars, deleteCar, updateCar } from '@/lib/db/cars';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye, Upload, Star } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatKm } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { CAR_STATUS } from '@/lib/constants';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const carsData = await getAllCars();
      setCars(carsData);
    } catch (error) {
      console.error('Error loading cars:', error);
      toast.error('Araçlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCarId) return;

    try {
      await deleteCar(deleteCarId);
      toast.success('Araç başarıyla silindi');
      setCars(cars.filter((car) => car.id !== deleteCarId));
      setDeleteCarId(null);
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Araç silinirken bir hata oluştu');
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Araçlar</h1>
            <p className="text-muted-foreground">
              {loading ? 'Yükleniyor...' : `Toplam ${cars.length} araç`}
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Link href="/admin/araclar/toplu-ekle">
              <Button size="lg" variant="outline" className="!border !border-gray-500 dark:!border-gray-600">
                <Upload className="h-4 w-4 mr-2" />
                Toplu Ekle
              </Button>
            </Link>
            <Link href="/admin/araclar/yeni">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Araç Ekle
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 !border !border-gray-500 dark:!border-gray-600 rounded-lg !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <p className="text-muted-foreground mb-4">Henüz araç eklenmemiş</p>
            <Link href="/admin/araclar/yeni">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                İlk Aracı Ekle
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => (
              <div key={car.id} className="!border !border-gray-500 dark:!border-gray-600 rounded-lg p-4 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:!shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:hover:!shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all bg-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {car.brand} {car.model}
                      </h3>
                      <Badge variant={car.status === 'available' ? 'default' : 'secondary'}>
                        {CAR_STATUS[car.status]}
                      </Badge>
                      {car.featured && <Badge variant="outline" className="border-amber-500 text-amber-500">Öne Çıkan</Badge>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3 md:mb-0">
                      <span>Yıl: {car.year}</span>
                      <span>Km: {formatKm(car.km)}</span>
                      <span>{car.fuelType}</span>
                      <span>{car.transmissionType}</span>
                    </div>
                    <p className="text-lg font-bold text-primary mt-1">{formatPrice(car.price)}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t md:border-t-0 md:pt-0 border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-10 w-10 ${car.featured ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/20' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10'}`}
                      onClick={async () => {
                        try {
                          await updateCar(car.id, { featured: !car.featured });
                          setCars(cars.map(c => c.id === car.id ? { ...c, featured: !c.featured } : c));
                          toast.success(car.featured ? 'Öne çıkanlardan kaldırıldı' : 'Öne çıkanlara eklendi');
                        } catch (error) {
                          console.error('Error updating car:', error);
                          toast.error('Güncelleme başarısız');
                        }
                      }}
                    >
                      <Star className={`h-5 w-5 ${car.featured ? 'fill-current' : ''}`} />
                    </Button>
                    <Link href={`/araclar/${car.id}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href={`/admin/araclar/duzenle?id=${car.id}`}>
                      <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600">
                        <Pencil className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600"
                      onClick={() => setDeleteCarId(car.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Floating Action Button */}
        <Link href="/admin/araclar/yeni" className="md:hidden fixed bottom-6 right-6 z-50">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-transform active:scale-95">
            <Plus className="h-8 w-8 text-primary-foreground" />
          </Button>
        </Link>
      </div>

      <AlertDialog open={!!deleteCarId} onOpenChange={(open) => !open && setDeleteCarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aracı silmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Araç kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  );
}
