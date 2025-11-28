'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types/car';
import { Heart, Fuel, Gauge, Calendar, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { formatPrice, formatKm, createWhatsAppLink } from '@/lib/utils/formatters';
import { CONTACT_INFO } from '@/lib/constants';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  showCompare?: boolean;
}

export function CarCard({ car, showCompare = true }: CarCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    e.stopPropagation();
    const message = `Merhaba, ${car.brand} ${car.model} (${car.year}) hakkında bilgi almak istiyorum.`;
    const link = createWhatsAppLink(CONTACT_INFO.whatsapp, message);
    window.open(link, '_blank');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (car.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (car.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Card
      className="group overflow-hidden !border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:!shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:hover:!shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
        <Link href={`/araclar/${car.id}`} className="block w-full h-full">
          {car.images && car.images.length > 0 ? (
            <Image
              src={car.images[currentImageIndex]}
              alt={`${car.brand} ${car.model}`}
              fill
              className={`object-cover object-center transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${car.status === 'sold' ? 'grayscale' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={currentImageIndex === 0}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
              <span className="text-muted-foreground">Resim Yok</span>
            </div>
          )}
        </Link>

        {/* Navigation Arrows */}
        {car.images && car.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10",
                "focus:outline-none focus:ring-2 focus:ring-white/50"
              )}
              aria-label="Önceki resim"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10",
                "focus:outline-none focus:ring-2 focus:ring-white/50"
              )}
              aria-label="Sonraki resim"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 px-4">
              {car.images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm",
                    currentImageIndex === idx
                      ? "bg-white w-3"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`${idx + 1}. resme git`}
                />
              ))}
              {car.images.length > 5 && (
                <span className="text-[10px] text-white/80 flex items-center shadow-sm">+{car.images.length - 5}</span>
              )}
            </div>
          </>
        )}

        {car.status === 'sold' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 pointer-events-none">
            <div className="bg-red-600/90 text-white px-8 py-2 transform -rotate-12 border-4 border-white shadow-xl">
              <span className="text-2xl font-black tracking-widest">SATILDI</span>
            </div>
          </div>
        )}

        {car.featured && (
          <Badge className="absolute top-2 left-2 z-10" variant="default">
            Öne Çıkan
          </Badge>
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite(car.id) ? 'fill-red-500 text-red-500' : ''}`}
          />
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        <Link href={`/araclar/${car.id}`}>
          <div>
            <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-2xl font-bold text-primary mt-1">{formatPrice(car.price)}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-3">
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
            className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>

          {showCompare && (
            <div className="flex items-center gap-2 px-3 !border !border-gray-500 dark:!border-gray-600 rounded-md hover:bg-accent transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isInCompare(car.id)}
                onCheckedChange={handleCompareChange}
                disabled={!canAddMore && !isInCompare(car.id)}
                id={`compare-${car.id}`}
              />
              <label htmlFor={`compare-${car.id}`} className="text-xs text-muted-foreground cursor-pointer font-medium">
                Karşılaştır
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
