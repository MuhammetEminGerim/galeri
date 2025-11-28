import { notFound } from 'next/navigation';
import { getCarById } from '@/lib/db/cars';
import { ImageGallery } from '@/components/image-gallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Gauge,
  Fuel,
  Palette,
  MessageCircle,
  Share2,
  Phone,
  Mail,
  Instagram,
  Send,
} from 'lucide-react';
import { formatPrice, formatKm, formatDate, createWhatsAppLink, getShareLinks } from '@/lib/utils/formatters';
import { CAR_STATUS, CONTACT_INFO } from '@/lib/constants';
import Link from 'next/link';
import { Metadata } from 'next';

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    return {
      title: 'Araç Bulunamadı',
    };
  }

  return {
    title: `${car.brand} ${car.model} (${car.year})`,
    description: car.description,
    openGraph: {
      title: `${car.brand} ${car.model} (${car.year})`,
      description: car.description,
      images: car.images.length > 0 ? [car.images[0]] : [],
    },
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  const whatsappMessage = `Merhaba, ${car.brand} ${car.model} (${car.year}) hakkında bilgi almak istiyorum.`;
  const whatsappLink = createWhatsAppLink(CONTACT_INFO.whatsapp, whatsappMessage);
  const shareLinks = getShareLinks(
    `https://autogaleri.com/araclar/${car.id}`,
    `${car.brand} ${car.model} (${car.year})`
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <ImageGallery images={car.images} alt={`${car.brand} ${car.model}`} />
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold">
                  {car.brand} {car.model}
                </h1>
                <p className="text-muted-foreground">{car.year} Model</p>
              </div>
              {car.featured && (
                <Badge variant="default">Öne Çıkan</Badge>
              )}
            </div>
            <p className="text-4xl font-bold text-primary mt-4">{formatPrice(car.price)}</p>
          </div>

          <Separator />

          {/* Specifications */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Özellikler</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Yıl</p>
                  <p className="font-medium">{car.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Kilometre</p>
                  <p className="font-medium">{formatKm(car.km)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Yakıt</p>
                  <p className="font-medium">{car.fuelType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">⚙️</span>
                <div>
                  <p className="text-sm text-muted-foreground">Vites</p>
                  <p className="font-medium">{car.transmissionType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Renk</p>
                  <p className="font-medium">{car.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Durum</p>
                  <p className="font-medium">{CAR_STATUS[car.status]}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Buttons */}
          <div className="space-y-6">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" size="lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp ile İletişime Geç
              </Button>
            </a>
            <a href={`tel:${CONTACT_INFO.phone}`}>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Telefon ile Ara
              </Button>
            </a>
            <Link href="/iletisim">
              <Button variant="outline" className="w-full">
                <Mail className="h-5 w-5 mr-2" />
                Mesaj Gönder
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Share */}
          <div>
            <h3 className="font-semibold mb-3">Paylaş</h3>
            <div className="grid grid-cols-3 gap-3">
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]">
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
              </a>
              <a href="https://www.instagram.com/create/story" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4 hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]">
                  <Instagram className="h-6 w-6" />
                  <span className="text-xs">Story</span>
                </Button>
              </a>
              <a href="https://ig.me/m/bolenotomotiv" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4 hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]">
                  <Send className="h-6 w-6" />
                  <span className="text-xs">DM</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {car.description && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Açıklama</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{car.description}</p>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-4">İletişim Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Telefon</p>
            <p className="font-medium">{CONTACT_INFO.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">E-posta</p>
            <p className="font-medium">{CONTACT_INFO.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">İlan Tarihi</p>
            <p className="font-medium">{formatDate(car.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
