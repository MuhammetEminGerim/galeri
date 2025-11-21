import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface ScrapedCar {
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuelType: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG';
  transmissionType: 'Manuel' | 'Otomatik';
  color: string;
  description: string;
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  featured: boolean;
}

// Yakıt tipi mapping
const mapFuelType = (fuel: string): 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG' => {
  const lower = fuel.toLowerCase();
  if (lower.includes('dizel') || lower.includes('dci') || lower.includes('tdi')) return 'Dizel';
  if (lower.includes('hibrit')) return 'Hibrit';
  if (lower.includes('elektrik')) return 'Elektrik';
  if (lower.includes('lpg')) return 'LPG';
  return 'Benzin';
};

// Vites tipi mapping
const mapTransmissionType = (transmission: string): 'Manuel' | 'Otomatik' => {
  const lower = transmission.toLowerCase();
  if (lower.includes('otomatik') || lower.includes('automatic')) return 'Otomatik';
  return 'Manuel';
};

// Marka ve model ayırma
const parseBrandModel = (title: string): { brand: string; model: string } => {
  // Örnek: "Opel Corsa 1.4 Enjoy" -> brand: "Opel", model: "Corsa 1.4 Enjoy"
  const parts = title.split(' ');
  if (parts.length < 2) {
    return { brand: parts[0] || 'Bilinmeyen', model: parts[0] || 'Bilinmeyen' };
  }
  
  // Yaygın markalar
  const brands = ['Opel', 'Renault', 'BMW', 'Toyota', 'Volkswagen', 'Ford', 'Fiat', 'Peugeot', 'Citroen', 'Arora'];
  let brand = parts[0];
  
  // Eğer ilk kelime marka değilse, ilk iki kelimeyi kontrol et
  if (!brands.includes(brand) && parts.length > 1) {
    const twoWordBrand = `${parts[0]} ${parts[1]}`;
    if (brands.some(b => twoWordBrand.includes(b))) {
      brand = twoWordBrand;
    }
  }
  
  const model = title.replace(brand, '').trim();
  return { brand, model: model || brand };
};

// Fiyat temizleme
const parsePrice = (priceText: string): number => {
  // "960.000 TL" -> 960000
  return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
};

// Kilometre temizleme
const parseKm = (kmText: string): number => {
  // "97.000 km" -> 97000
  return parseInt(kmText.replace(/[^\d]/g, '')) || 0;
};

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('arabam.com')) {
      return NextResponse.json(
        { error: 'Geçerli bir arabam.com URL\'si girin' },
        { status: 400 }
      );
    }

    // Galeri sayfasından tüm araç linklerini çek
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Sayfa yüklenemedi' },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const cars: ScrapedCar[] = [];

    // Galeri sayfasındaki araç linklerini bul
    const carLinks: string[] = [];
    
    // Tablodaki araç linklerini bul - farklı selector'lar dene
    $('table tbody tr, [class*="table"] tbody tr, .listing-table tbody tr').each((_, row) => {
      const link = $(row).find('a[href*="/ilan/"]').first().attr('href');
      if (link) {
        const fullUrl = link.startsWith('http') ? link : `https://www.arabam.com${link}`;
        if (!carLinks.includes(fullUrl)) {
          carLinks.push(fullUrl);
        }
      }
    });

    // Eğer tablo bulunamazsa, direkt linkleri ara
    if (carLinks.length === 0) {
      $('a[href*="/ilan/"]').each((_, el) => {
        const link = $(el).attr('href');
        if (link && link.includes('/ilan/')) {
          const fullUrl = link.startsWith('http') ? link : `https://www.arabam.com${link}`;
          if (!carLinks.includes(fullUrl) && carLinks.length < 20) {
            carLinks.push(fullUrl);
          }
        }
      });
    }

    // Önce galeri sayfasındaki tablo verilerinden direkt çekmeyi dene
    const tableCars: ScrapedCar[] = [];
    $('table tbody tr').each((_, row) => {
      try {
        const $row = $(row);
        
        // Model bilgisi
        const modelText = $row.find('td').eq(1).text().trim() || 
                         $row.find('[class*="model"]').text().trim();
        const { brand, model } = parseBrandModel(modelText);
        
        // Başlık
        const title = $row.find('td').eq(2).text().trim() || 
                     $row.find('h4, h3, [class*="title"]').text().trim();
        
        // Yıl
        const yearText = $row.find('td').eq(3).text().trim();
        const year = parseInt(yearText) || new Date().getFullYear();
        
        // Kilometre
        const kmText = $row.find('td').eq(4).text().trim();
        const km = parseKm(kmText);
        
        // Renk
        const colorText = $row.find('td').eq(5).text().trim();
        const color = colorText && colorText !== '-' ? colorText : 'Belirtilmemiş';
        
        // Fiyat
        const priceText = $row.find('td').eq(6).text().trim();
        const price = parsePrice(priceText);
        
        // Resim
        const imgSrc = $row.find('img').first().attr('src') || 
                     $row.find('img').first().attr('data-src');
        const images = imgSrc ? [imgSrc.startsWith('http') ? imgSrc : `https://www.arabam.com${imgSrc}`] : [];
        
        // Link
        const link = $row.find('a[href*="/ilan/"]').first().attr('href');
        
        if (brand && model && price > 0) {
          // Başlıktan yakıt ve vites bilgisini çıkar
          const titleLower = title.toLowerCase();
          const fuelType = mapFuelType(titleLower);
          const transmissionType = mapTransmissionType(titleLower);
          
          tableCars.push({
            brand,
            model,
            year,
            price,
            km,
            fuelType,
            transmissionType,
            color,
            description: title,
            images,
            status: 'available',
            featured: false,
          });
        }
      } catch (error) {
        console.error('Tablo satırı parse hatası:', error);
        return; // continue yerine return kullan (callback içinde)
      }
    });

    // Eğer tablodan veri çekildiyse, onları kullan
    if (tableCars.length > 0) {
      return NextResponse.json({ cars: tableCars, count: tableCars.length });
    }

    // Tablodan çekilemediyse, detay sayfalarına git
    for (const carUrl of carLinks.slice(0, 20)) { // Max 20 araç
      try {
        const carResponse = await fetch(carUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!carResponse.ok) continue;

        const carHtml = await carResponse.text();
        const $car = cheerio.load(carHtml);

        // Başlıktan marka/model çıkar
        const title = $car('h1').first().text().trim() || 
                     $car('[class*="title"]').first().text().trim() ||
                     $car('title').text().trim();
        
        const { brand, model } = parseBrandModel(title);

        // Fiyat
        const priceText = $car('[class*="price"]').first().text().trim() ||
                         $car('span:contains("TL")').first().text().trim();
        const price = parsePrice(priceText);

        // Detay bilgileri
        let year = new Date().getFullYear();
        let km = 0;
        let fuelType: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG' = 'Benzin';
        let transmissionType: 'Manuel' | 'Otomatik' = 'Manuel';
        let color = 'Belirtilmemiş';
        const images: string[] = [];

        // Detay tablosundan bilgileri çek
        $car('[class*="detail"], [class*="spec"], table').each((_, el) => {
          const text = $car(el).text().toLowerCase();
          
          // Yıl
          const yearMatch = text.match(/(\d{4})\s*(model|yıl|year)/i);
          if (yearMatch) {
            year = parseInt(yearMatch[1]) || year;
          }

          // Kilometre
          const kmMatch = text.match(/(\d+\.?\d*)\s*(km|kilometre)/i);
          if (kmMatch) {
            km = parseKm(kmMatch[0]);
          }

          // Yakıt
          if (text.includes('dizel') || text.includes('dci') || text.includes('tdi')) {
            fuelType = 'Dizel';
          } else if (text.includes('hibrit')) {
            fuelType = 'Hibrit';
          } else if (text.includes('elektrik')) {
            fuelType = 'Elektrik';
          } else if (text.includes('lpg')) {
            fuelType = 'LPG';
          }

          // Vites
          if (text.includes('otomatik') || text.includes('automatic')) {
            transmissionType = 'Otomatik';
          }

          // Renk
          const colorMatch = text.match(/(beyaz|siyah|gri|mavi|kırmızı|yeşil|sarı|turuncu|pembe|mor|kahverengi|bej)/i);
          if (colorMatch) {
            color = colorMatch[1].charAt(0).toUpperCase() + colorMatch[1].slice(1);
          }
        });

        // Resimler
        $car('img[src*="arabam"], img[data-src*="arabam"]').each((_, img) => {
          const src = $car(img).attr('src') || $car(img).attr('data-src');
          if (src && !src.includes('logo') && !src.includes('icon')) {
            const fullImageUrl = src.startsWith('http') ? src : `https://www.arabam.com${src}`;
            if (!images.includes(fullImageUrl)) {
              images.push(fullImageUrl);
            }
          }
        });

        // Açıklama
        const description = $car('[class*="description"], [class*="aciklama"]').first().text().trim() ||
                           $car('p').first().text().trim() ||
                           title;

        if (brand && model && price > 0) {
          cars.push({
            brand,
            model,
            year,
            price,
            km,
            fuelType,
            transmissionType,
            color,
            description: description.substring(0, 500), // Max 500 karakter
            images: images.slice(0, 10), // Max 10 resim
            status: 'available',
            featured: false,
          });
        }
      } catch (error) {
        console.error(`Araç çekilirken hata (${carUrl}):`, error);
        continue;
      }
    }

    return NextResponse.json({ cars, count: cars.length });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Araçlar çekilirken bir hata oluştu', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}

