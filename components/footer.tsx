import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="!border-t !border-gray-400 dark:!border-gray-700 bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Bölen Otomotiv"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold group-hover:text-primary transition-colors">Bölen Otomotiv</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              10 yıllık tecrübemiz ve yeni yüzümüzle<br />size en uygun aracı bulmak için buradayız
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/bolenotomotiv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/+905452141308"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/araclar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Araçlar
                </Link>
              </li>
              <li>
                <Link href="/favorilerim" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Favorilerim
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="font-semibold mb-4">Araç Kategorileri</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/araclar?fuelType=Benzin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Benzinli Araçlar
                </Link>
              </li>
              <li>
                <Link href="/araclar?fuelType=Dizel" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dizel Araçlar
                </Link>
              </li>
              <li>
                <Link href="/araclar?fuelType=Hibrit" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Hibrit Araçlar
                </Link>
              </li>
              <li>
                <Link href="/araclar?fuelType=Elektrik" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Elektrikli Araçlar
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 !border-t !border-gray-400 dark:!border-gray-700 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Bölen Otomotiv. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
