/**
 * Arabam.com'dan araç bilgilerini çeken script
 * 
 * Kullanım:
 * node scripts/scrape-arabam.js https://www.arabam.com/galeri/bolen-otomotiv
 * 
 * Çıktı: console'a JSON formatında araç listesi yazdırılır
 * Bu JSON'u kopyalayıp admin paneldeki "Toplu Ekle" sayfasına yapıştırabilirsiniz
 */

const https = require('https');
const http = require('http');
const cheerio = require('cheerio');

// Yakıt tipi mapping
const mapFuelType = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('dizel') || lower.includes('dci') || lower.includes('tdi')) return 'Dizel';
  if (lower.includes('hibrit')) return 'Hibrit';
  if (lower.includes('elektrik')) return 'Elektrik';
  if (lower.includes('lpg')) return 'LPG';
  return 'Benzin';
};

// Vites tipi mapping
const mapTransmissionType = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('otomatik') || lower.includes('automatic')) return 'Otomatik';
  return 'Manuel';
};

// Marka ve model ayırma
const parseBrandModel = (title) => {
  const parts = title.split(' ');
  if (parts.length < 2) {
    return { brand: parts[0] || 'Bilinmeyen', model: parts[0] || 'Bilinmeyen' };
  }
  
  const brands = ['Opel', 'Renault', 'BMW', 'Toyota', 'Volkswagen', 'Ford', 'Fiat', 'Peugeot', 'Citroen', 'Arora'];
  let brand = parts[0];
  
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
const parsePrice = (priceText) => {
  return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
};

// Kilometre temizleme
const parseKm = (kmText) => {
  return parseInt(kmText.replace(/[^\d]/g, '')) || 0;
};

// URL'den HTML çek
const fetchHTML = (url) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.arabam.com/',
        'Connection': 'keep-alive',
      },
    };

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

// Ana scraping fonksiyonu
const scrapeArabam = async (url) => {
  try {
    console.log('📡 Arabam.com sayfası çekiliyor...');
    const html = await fetchHTML(url);
    
    console.log('✅ Sayfa başarıyla çekildi, parse ediliyor...');
    const $ = cheerio.load(html);
    const cars = [];

    // Tablodaki araçları çek
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
        
        if (brand && model && price > 0) {
          const titleLower = title.toLowerCase();
          const fuelType = mapFuelType(titleLower);
          const transmissionType = mapTransmissionType(titleLower);
          
          cars.push({
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
        console.error('Araç parse hatası:', error.message);
      }
    });

    if (cars.length === 0) {
      console.warn('⚠️  Tabloda araç bulunamadı, alternatif yöntem deneniyor...');
      
      // Alternatif: Linklerden çek
      const carLinks = [];
      $('a[href*="/ilan/"]').each((_, el) => {
        const link = $(el).attr('href');
        if (link && link.includes('/ilan/')) {
          const fullUrl = link.startsWith('http') ? link : `https://www.arabam.com${link}`;
          if (!carLinks.includes(fullUrl) && carLinks.length < 10) {
            carLinks.push(fullUrl);
          }
        }
      });

      console.log(`📋 ${carLinks.length} araç linki bulundu, detay sayfaları çekiliyor...`);
      
      for (const carUrl of carLinks) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
          const carHtml = await fetchHTML(carUrl);
          const $car = cheerio.load(carHtml);
          
          const title = $car('h1').first().text().trim() || 
                       $car('[class*="title"]').first().text().trim();
          const { brand, model } = parseBrandModel(title);
          
          const priceText = $car('[class*="price"]').first().text().trim() ||
                           $car('span:contains("TL")').first().text().trim();
          const price = parsePrice(priceText);
          
          if (brand && model && price > 0) {
            const titleLower = title.toLowerCase();
            cars.push({
              brand,
              model,
              year: new Date().getFullYear(),
              price,
              km: 0,
              fuelType: mapFuelType(titleLower),
              transmissionType: mapTransmissionType(titleLower),
              color: 'Belirtilmemiş',
              description: title,
              images: [],
              status: 'available',
              featured: false,
            });
          }
        } catch (error) {
          console.error(`Araç detay sayfası hatası (${carUrl}):`, error.message);
        }
      }
    }

    return cars;
  } catch (error) {
    console.error('❌ Hata:', error.message);
    throw error;
  }
};

// Script çalıştırma
const url = process.argv[2] || 'https://www.arabam.com/galeri/bolen-otomotiv';

if (!url.includes('arabam.com')) {
  console.error('❌ Geçerli bir arabam.com URL\'si girin!');
  console.log('Kullanım: node scripts/scrape-arabam.js <URL>');
  process.exit(1);
}

console.log(`🚀 Arabam.com scraping başlatılıyor...`);
console.log(`📍 URL: ${url}\n`);

scrapeArabam(url)
  .then((cars) => {
    console.log(`\n✅ ${cars.length} araç başarıyla çekildi!\n`);
    console.log('📋 JSON Çıktısı:\n');
    console.log(JSON.stringify(cars, null, 2));
    console.log('\n💡 Bu JSON\'u kopyalayıp admin paneldeki "Toplu Ekle" sayfasına yapıştırabilirsiniz.');
  })
  .catch((error) => {
    console.error('\n❌ Scraping başarısız:', error.message);
    process.exit(1);
  });

