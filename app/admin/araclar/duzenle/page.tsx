'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/admin/auth-guard';
import { CarForm } from '@/components/admin/car-form';
import { getCarById } from '@/lib/db/cars';
import { Edit } from 'lucide-react';
import { Car } from '@/types/car';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function EditCarPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCar = async () => {
            if (!id) {
                toast.error('Araç ID bulunamadı');
                router.push('/admin/araclar');
                return;
            }

            try {
                const carData = await getCarById(id);
                if (!carData) {
                    toast.error('Araç bulunamadı');
                    router.push('/admin/araclar');
                    return;
                }
                setCar(carData);
            } catch (error) {
                console.error('Error loading car:', error);
                toast.error('Araç yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        loadCar();
    }, [id, router]);

    if (loading) {
        return (
            <AuthGuard>
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-64" />
                        <Skeleton className="h-[600px] w-full" />
                    </div>
                </div>
            </AuthGuard>
        );
    }

    if (!car) return null;

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                            <Edit className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                Araç Düzenle
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {car.brand} {car.model} ({car.year}) - Araç bilgilerini güncelleyin
                            </p>
                        </div>
                    </div>
                </div>
                <CarForm car={car} isEdit />
            </div>
        </AuthGuard>
    );
}
