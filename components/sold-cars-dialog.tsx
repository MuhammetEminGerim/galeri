'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Calendar, Gauge, Fuel } from 'lucide-react';
import {
    Dialog,
    DialogContent,
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
import { Card, CardContent } from '@/components/ui/card';
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
            <DialogContent className="sm:max-w-5xl w-[95vw] h-auto bg-zinc-950/95 backdrop-blur-xl border-zinc-800 text-white p-0 overflow-hidden shadow-2xl" showCloseButton={false}>

                <div className="relative w-full h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">Satılan Araçlar</h2>
                            <p className="text-sm text-zinc-400">Mutlu müşterilerimiz ve yeni araçları</p>
                        </div>
                        <DialogClose className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </DialogClose>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-0 sm:p-8">
                        {loading ? (
                            <div className="h-[400px] flex items-center justify-center text-zinc-500">Yükleniyor...</div>
                        ) : cars.length === 0 ? (
                            <div className="h-[400px] flex items-center justify-center text-zinc-500">Henüz satılan araç yok.</div>
                        ) : (
                            <Carousel
                                setApi={setApi}
                                opts={{ loop: true, duration: 60 }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {cars.map((car, index) => (
                                        <CarouselItem key={car.id} className="basis-full">
                                            <div className="p-1">
                                                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden rounded-2xl">
                                                    <CardContent className="p-0">
                                                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                                                            {car.images[0] ? (
                                                                <Image
                                                                    src={car.images[0]}
                                                                    alt={`${car.brand} ${car.model}`}
                                                                    fill
                                                                    className="object-cover"
                                                                    priority={index === 0}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">Görsel Yok</div>
                                                            )}
                                                            <div className="absolute top-4 right-4">
                                                                <Badge className="bg-white/90 text-black hover:bg-white border-none px-3 py-1 text-sm font-semibold shadow-lg">
                                                                    SATILDI
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            <div>
                                                                <h3 className="text-2xl font-bold text-white">{car.brand} {car.model}</h3>

                                                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                                                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700">
                                                                        <Calendar className="w-3 h-3 mr-1.5" />
                                                                        {car.year}
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700">
                                                                        <Gauge className="w-3 h-3 mr-1.5" />
                                                                        {car.km.toLocaleString('tr-TR')} KM
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700">
                                                                        <Fuel className="w-3 h-3 mr-1.5" />
                                                                        {car.fuelType}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <div className="text-right hidden sm:block">
                                                                <p className="text-sm text-zinc-500">Satış Tarihi</p>
                                                                <p className="text-zinc-300 font-medium">
                                                                    {car.soldAt ? new Date(car.soldAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : '-'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="hidden sm:block">
                                    <CarouselPrevious className="left-4 bg-black/50 border-none text-white hover:bg-black/70" />
                                    <CarouselNext className="right-4 bg-black/50 border-none text-white hover:bg-black/70" />
                                </div>
                            </Carousel>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
