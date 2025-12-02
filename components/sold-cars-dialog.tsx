'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Calendar, Gauge, Fuel } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { getSoldCars } from '@/lib/db/cars';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';

interface SoldCarsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SoldCarsDialog({
    open,
    onOpenChange,
}: SoldCarsDialogProps) {
    const [cars, setCars] = React.useState<Car[]>([]);
    const [api, setApi] = React.useState<CarouselApi>();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (open) {
            setLoading(true);
            getSoldCars().then((data) => {
                setCars(data);
                setLoading(false);
            });
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-6xl w-[95vw] h-[85vh] sm:w-full sm:h-auto bg-transparent border-none text-white p-0 overflow-hidden shadow-2xl" showCloseButton={false}>
                {/* Static Dark Background */}
                <div className="absolute inset-0 z-0 bg-zinc-950" />

                {/* Header Overlay */}
                <DialogHeader className="p-4 sm:p-6 absolute z-20 top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent flex flex-row items-start justify-between pointer-events-none">
                    <div className="pointer-events-auto">
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Satılan Araçlar</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
                            Mutlu müşterilerimiz ve yeni araçları
                        </DialogDescription>
                    </div>
                    <DialogClose className="pointer-events-auto text-white/80 hover:text-white transition-colors drop-shadow-md p-2 hover:bg-white/10 rounded-full">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Kapat</span>
                    </DialogClose>
                </DialogHeader>

                <div className="w-full h-full sm:h-[85vh] flex items-center justify-center p-0 relative z-10">
                    {loading ? (
                        <div className="text-zinc-500">Yükleniyor...</div>
                    ) : cars.length === 0 ? (
                        <div className="text-zinc-500">Henüz satılan araç yok.</div>
                    ) : (
                        <Carousel
                            setApi={setApi}
                            opts={{ loop: true, duration: 60 }}
                            className="w-full h-full [&_[data-slot=carousel-content]]:h-full"
                        >
                            <CarouselContent className="h-full -ml-0">
                                {cars.map((car, index) => (
                                    <CarouselItem key={car.id} className="h-full flex items-center justify-center pl-0 relative">
                                        <div className="w-full h-full relative flex items-center justify-center bg-zinc-950">
                                            {/* Image */}
                                            <div className="relative w-full h-full">
                                                {car.images[0] ? (
                                                    <Image
                                                        src={car.images[0]}
                                                        alt={`${car.brand} ${car.model}`}
                                                        fill
                                                        className="object-contain"
                                                        priority={index === 0}
                                                        sizes="(max-width: 1200px) 100vw, 80vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">Görsel Yok</div>
                                                )}
                                            </div>

                                            {/* Bottom Overlay for Details */}
                                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-10 pt-20 flex flex-col gap-2 sm:gap-4">
                                                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                                                    <div className="w-full">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <h3 className="text-xl sm:text-4xl font-bold text-white drop-shadow-lg">
                                                                {car.brand} {car.model}
                                                            </h3>
                                                            <Badge className="bg-white text-black hover:bg-white/90 border-none text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5">
                                                                SATILDI
                                                            </Badge>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                                                            <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm">
                                                                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-zinc-400" />
                                                                {car.year}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm">
                                                                <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-zinc-400" />
                                                                {car.km.toLocaleString('tr-TR')} KM
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-sm">
                                                                <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-zinc-400" />
                                                                {car.fuelType}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="w-full sm:w-auto flex justify-between sm:block sm:text-right border-t border-white/10 pt-2 sm:border-none sm:pt-0 mt-2 sm:mt-0">
                                                        <p className="text-[10px] sm:text-xs text-zinc-400 mb-0.5 sm:mb-1">Satış Tarihi</p>
                                                        <p className="text-sm sm:text-base text-white font-medium">
                                                            {car.soldAt ? new Date(car.soldAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 sm:left-4 bg-white/10 hover:bg-white/20 border-none text-white h-8 w-8 sm:h-12 sm:w-12" />
                            <CarouselNext className="right-2 sm:right-4 bg-white/10 hover:bg-white/20 border-none text-white h-8 w-8 sm:h-12 sm:w-12" />
                        </Carousel>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
