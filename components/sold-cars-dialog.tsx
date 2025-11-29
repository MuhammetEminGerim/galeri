'use client';

import * as React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [current, setCurrent] = React.useState(0);
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

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-6xl w-[95vw] h-[80vh] sm:w-full sm:h-auto bg-transparent border-none text-white p-0 overflow-hidden shadow-2xl" showCloseButton={false}>
                {/* Blurred Background with Smooth Transition */}
                <div className="absolute inset-0 z-0 bg-black">
                    <AnimatePresence mode="popLayout">
                        {cars[current] && cars[current].images[0] && (
                            <motion.div
                                key={current}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={cars[current].images[0]}
                                    alt="Background"
                                    fill
                                    className="object-cover blur-xl scale-110 opacity-60"
                                    priority
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogHeader className="p-4 sm:p-6 absolute z-20 top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent flex flex-row items-start justify-between">
                    <div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Satılan Araçlarımız</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-gray-200 drop-shadow-md">
                            Yeni sahiplerine kavuşturduğumuz araçlardan bazıları.
                        </DialogDescription>
                    </div>
                    <DialogClose className="text-white/80 hover:text-white transition-colors drop-shadow-md">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Kapat</span>
                    </DialogClose>
                </DialogHeader>

                <div className="w-full h-full sm:h-[90vh] flex items-center justify-center p-0 relative z-10">
                    {loading ? (
                        <div className="text-white">Yükleniyor...</div>
                    ) : cars.length === 0 ? (
                        <div className="text-white">Henüz satılan araç bulunmuyor.</div>
                    ) : (
                        <Carousel
                            setApi={setApi}
                            opts={{
                                loop: true,
                                duration: 40,
                            }}
                            className="w-full h-full [&_[data-slot=carousel-content]]:h-full"
                        >
                            <CarouselContent className="h-full -ml-0 sm:-ml-4">
                                {cars.map((car, index) => (
                                    <CarouselItem key={car.id} className="h-full flex items-center justify-center pl-0 sm:pl-4">
                                        <div className="w-full h-full flex items-center justify-center p-4 sm:p-10">
                                            <Card className="bg-transparent border-none shadow-none w-full max-w-4xl aspect-[4/3] sm:aspect-video relative overflow-hidden rounded-xl group">
                                                <CardContent className="p-0 w-full h-full relative">
                                                    {car.images[0] ? (
                                                        <Image
                                                            src={car.images[0]}
                                                            alt={`${car.brand} ${car.model}`}
                                                            fill
                                                            className="object-cover rounded-xl shadow-2xl"
                                                            sizes="(max-width: 1200px) 100vw, 80vw"
                                                            priority={index === 0}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-xl">
                                                            <span className="text-gray-400">Görsel Yok</span>
                                                        </div>
                                                    )}

                                                    {/* Overlay Info */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
                                                        <div>
                                                            <h3 className="text-2xl font-bold">{car.brand} {car.model}</h3>
                                                            <p className="text-gray-300">{car.year} • {car.km} KM</p>
                                                        </div>
                                                        <Badge variant="destructive" className="text-lg px-4 py-1">SATILDI</Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 sm:left-4 bg-white/10 hover:bg-white/20 border-none text-white h-8 w-8 sm:h-10 sm:w-10" />
                            <CarouselNext className="right-2 sm:right-4 bg-white/10 hover:bg-white/20 border-none text-white h-8 w-8 sm:h-10 sm:w-10" />
                        </Carousel>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
