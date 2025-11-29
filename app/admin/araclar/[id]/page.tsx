import { notFound } from 'next/navigation';
import { AuthGuard } from '@/components/admin/auth-guard';
import { CarForm } from '@/components/admin/car-form';
import { getCarById, getAllCars } from '@/lib/db/cars';
import { Edit } from 'lucide-react';

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const cars = await getAllCars();
    return cars.map((car) => ({
      id: car.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

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
