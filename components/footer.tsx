import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
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
              Güvenilir ve kaliteli araçlar için doğru adres. Hayalinizdeki aracı bulmanız için buradayız.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
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
