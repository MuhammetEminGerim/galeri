'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/car';
import { Heart, Fuel, Gauge, Calendar, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { formatPrice, formatKm, createWhatsAppLink } from '@/lib/utils/formatters';
import { CONTACT_INFO } from '@/lib/constants';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface CarCardProps {
  car: Car;
  showCompare?: boolean;
}

export function CarCard({ car, showCompare = true }: CarCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(car.id);
    toast.success(isFavorite(car.id) ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
  };

  const handleCompareChange = (checked: boolean | "indeterminate") => {
    const added = toggleCompare(car.id);
    if (added === false && !isInCompare(car.id)) {
      toast.error('En fazla 3 araç karşılaştırabilirsiniz');
    } else {
      toast.success(isInCompare(car.id) ? 'Karşılaştırmadan çıkarıldı' : 'Karşılaştırmaya eklendi');
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Merhaba, ${car.brand} ${car.model} (${car.year}) hakkında bilgi almak istiyorum.`;
    const link = createWhatsAppLink(CONTACT_INFO.whatsapp, message);
    window.open(link, '_blank');
  };

  return (
    <Card className="group overflow-hidden !border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:!shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:hover:!shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300">
      <Link href={`/araclar/${car.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {car.images && car.images.length > 0 ? (
            <Image
              src={car.images[0]}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">Resim Yok</span>
            </div>
          )}
          
          {car.featured && (
            <Badge className="absolute top-2 left-2" variant="default">
              Öne Çıkan
            </Badge>
          )}

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite(car.id) ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4 space-y-4">
        <Link href={`/araclar/${car.id}`}>
          <div>
            <h3 className="text-lg font-semibold line-clamp-1">
              {car.brand} {car.model}
            </h3>
            <p className="text-2xl font-bold text-primary mt-1">{formatPrice(car.price)}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{formatKm(car.km)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">⚙️</span>
              <span>{car.transmissionType}</span>
            </div>
          </div>
        </Link>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
          
          {showCompare && (
            <div className="flex items-center gap-2 px-3 !border !border-gray-500 dark:!border-gray-600 rounded-md">
              <Checkbox
                checked={isInCompare(car.id)}
                onCheckedChange={handleCompareChange}
                disabled={!canAddMore && !isInCompare(car.id)}
              />
              <span className="text-xs text-muted-foreground">Karşılaştır</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
