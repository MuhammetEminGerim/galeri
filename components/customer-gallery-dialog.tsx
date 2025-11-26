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

interface CustomerGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Generate 31 images
const PLACEHOLDER_IMAGES = Array.from({ length: 31 }, (_, i) => `/customer-images/${i + 1}.jpg`);

export function CustomerGalleryDialog({
  open,
  onOpenChange,
}: CustomerGalleryDialogProps) {
  const images = PLACEHOLDER_IMAGES;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl w-[95vw] sm:w-full bg-transparent border-none text-white p-0 overflow-hidden shadow-2xl" showCloseButton={false}>
        {/* Blurred Background with Smooth Transition */}
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence mode="popLayout">
            {images[current] && (
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[current]}
                  alt="Background"
                  fill
                  className="object-cover blur-xl scale-110"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogHeader className="p-4 sm:p-6 absolute z-20 top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Mutlu Müşterilerimiz</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-100 drop-shadow-md">
              Bizi tercih eden değerli müşterilerimizden kareler.
            </DialogDescription>
          </div>
          <DialogClose className="text-white/80 hover:text-white transition-colors drop-shadow-md">
            <X className="h-6 w-6" />
            <span className="sr-only">Kapat</span>
          </DialogClose>
        </DialogHeader>

        <div className="w-full h-[80dvh] sm:h-[90vh] flex items-center justify-center p-0 relative z-10">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              duration: 40,
            }}
            className="w-full h-full [&_[data-slot=carousel-content]]:h-full"
          >
            <CarouselContent className="h-full">
              {images.map((src, index) => (
                <CarouselItem key={index} className="h-full flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center p-2 sm:p-0">
                    <Card className="bg-transparent border-none shadow-none w-full h-full">
                      <CardContent className="flex items-center justify-center p-0 relative w-full h-full">
                        <div className="relative w-full h-full">
                          <Image
                            src={src}
                            alt={`Mutlu Müşteri ${index + 1}`}
                            fill
                            className="object-contain drop-shadow-2xl"
                            sizes="(max-width: 1200px) 100vw, 80vw"
                            priority={index === 0}
                          />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
