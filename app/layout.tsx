import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { BackgroundMusic } from '@/components/background-music';
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bolenotomotiv.com'),
  title: {
    default: "Bölen Otomotiv | Bolu İkinci El Araç & Oto Galeri",
    template: "%s | Bölen Otomotiv",
  },
  description: "Bolu'da güvenilir ikinci el araba fiyatları ve modelleri Bölen Otomotiv'de. Ekspertiz garantili, krediye uygun, temiz Fiat, Renault ve tüm marka araçlar için hemen inceleyin.",
  keywords: [
    "bolu oto galeri",
    "bolu ikinci el araba",
    "bölen otomotiv",
    "sahibinden araba bolu",
    "güvenilir galeri",
    "taksitli araba",
    "ekspertizli araç satışı"
  ],
  authors: [{ name: "Bölen Otomotiv", url: "https://bolenotomotiv.com" }],
  creator: "Bölen Otomotiv",
  publisher: "Bölen Otomotiv",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Bölen Otomotiv - Bolu'nun Güvenilir Galeri Adresi",
    description: "Hayalinizdeki aracı uygun fiyat ve ekspertiz garantisiyle bulun. Yeni gelen araçlarımızı web sitemizden inceleyin.",
    url: "https://bolenotomotiv.com",
    siteName: "Bölen Otomotiv",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bölen Otomotiv Galeri Görünümü',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bölen Otomotiv | İkinci El Araç Borsası",
    description: "Bolu'da temiz, garantili ikinci el araçlar.",
    images: ['/og-image.jpg'],
  },
  verification: {
    google: "cAAaRte9BEs_jBPESEid2Uh1BS5LvBhLEyjAHJLSPCU",
  },
  other: {
    "geo.region": "TR-14",
    "geo.placename": "Bolu",
    "geo.position": "40.7358;31.5898",
    "ICBM": "40.7358, 31.5898"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <BackgroundMusic />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
