import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground max-w-md">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>
        <Link href="/">
          <Button size="lg">
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
