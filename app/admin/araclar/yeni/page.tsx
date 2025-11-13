import { AuthGuard } from '@/components/admin/auth-guard';
import { CarForm } from '@/components/admin/car-form';
import { PlusCircle } from 'lucide-react';

export default function YeniAracPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Yeni Araç Ekle
              </h1>
              <p className="text-muted-foreground mt-1">Galeriye yeni bir araç ekleyin ve tüm detayları belirleyin</p>
            </div>
          </div>
        </div>
        <CarForm />
      </div>
    </AuthGuard>
  );
}
