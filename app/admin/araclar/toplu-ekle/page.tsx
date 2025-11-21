'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { addCar } from '@/lib/db/cars';
import { toast } from 'sonner';
import { Car } from '@/types/car';

interface BulkCarData {
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuelType: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG';
  transmissionType: 'Manuel' | 'Otomatik';
  color: string;
  description: string;
  images?: string[];
  status?: 'available' | 'sold' | 'reserved';
  featured?: boolean;
}

export default function TopluEklePage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [arabamUrl, setArabamUrl] = useState('https://www.arabam.com/galeri/bolen-otomotiv');
  const [isScraping, setIsScraping] = useState(false);

  const exampleJson = `[
  {
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "price": 450000,
    "km": 50000,
    "fuelType": "Benzin",
    "transmissionType": "Otomatik",
    "color": "Beyaz",
    "description": "Hasarsız, ilk sahibinden, bakımlı araç",
    "images": ["https://example.com/image1.jpg"],
    "status": "available",
    "featured": false
  },
  {
    "brand": "Volkswagen",
    "model": "Golf",
    "year": 2019,
    "price": 380000,
    "km": 75000,
    "fuelType": "Dizel",
    "transmissionType": "Manuel",
    "color": "Siyah",
    "description": "Temiz araç, düzenli bakımlı",
    "images": [],
    "status": "available",
    "featured": true
  }
]`;

  const handleSubmit = async () => {
    if (!jsonInput.trim()) {
      toast.error('Lütfen JSON verisi girin');
      return;
    }

    setIsSubmitting(true);
    setResults(null);

    try {
      const cars: BulkCarData[] = JSON.parse(jsonInput);

      if (!Array.isArray(cars)) {
        toast.error('JSON bir dizi olmalıdır');
        setIsSubmitting(false);
        return;
      }

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < cars.length; i++) {
        const carData = cars[i];
        try {
          // Validasyon
          if (!carData.brand || !carData.model || !carData.year || !carData.price) {
            throw new Error(`Araç #${i + 1}: Eksik zorunlu alanlar (brand, model, year, price)`);
          }

          // Varsayılan değerler
          const carToAdd: Omit<Car, 'id' | 'createdAt' | 'updatedAt'> = {
            brand: carData.brand,
            model: carData.model,
            year: Number(carData.year),
            price: Number(carData.price),
            km: Number(carData.km) || 0,
            fuelType: carData.fuelType || 'Benzin',
            transmissionType: carData.transmissionType || 'Manuel',
            color: carData.color || 'Belirtilmemiş',
            description: carData.description || '',
            images: carData.images || [],
            status: carData.status || 'available',
            featured: carData.featured || false,
          };

          await addCar(carToAdd);
          successCount++;
        } catch (error) {
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : `Araç #${i + 1}: Bilinmeyen hata`;
          errors.push(errorMessage);
          console.error(`Araç #${i + 1} eklenirken hata:`, error);
        }
      }

      setResults({
        success: successCount,
        failed: failedCount,
        errors,
      });

      if (successCount > 0) {
        toast.success(`${successCount} araç başarıyla eklendi!`);
      }
      if (failedCount > 0) {
        toast.error(`${failedCount} araç eklenemedi`);
      }

      // Başarılı eklemelerden sonra input'u temizle
      if (failedCount === 0) {
        setJsonInput('');
      }
    } catch (error) {
      console.error('JSON parse hatası:', error);
      toast.error('Geçersiz JSON formatı. Lütfen kontrol edin.');
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadExample = () => {
    setJsonInput(exampleJson);
  };

  const handleScrapeFromArabam = async () => {
    if (!arabamUrl.trim()) {
      toast.error('Lütfen bir URL girin');
      return;
    }

    setIsScraping(true);
    try {
      const response = await fetch('/api/arabam-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: arabamUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Araçlar çekilemedi');
      }

      if (data.cars && data.cars.length > 0) {
        setJsonInput(JSON.stringify(data.cars, null, 2));
        toast.success(`${data.count} araç başarıyla çekildi!`);
      } else {
        toast.warning('Hiç araç bulunamadı');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error(error instanceof Error ? error.message : 'Araçlar çekilirken bir hata oluştu');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Toplu Araç Ekleme
              </h1>
              <p className="text-muted-foreground mt-1">
                JSON formatında araçları toplu olarak ekleyin
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Instructions */}
          <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Kullanım Talimatları</CardTitle>
                  <CardDescription className="mt-1">
                    Sahibinden.com'daki araçları JSON formatında ekleyin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2 text-sm">
                <p className="font-semibold">📋 Adımlar:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Sahibinden.com'daki araç bilgilerini toplayın</li>
                  <li>JSON formatında hazırlayın (örnek formatı görmek için "Örnek Yükle" butonuna tıklayın)</li>
                  <li>JSON'u aşağıdaki alana yapıştırın</li>
                  <li>"Araçları Ekle" butonuna tıklayın</li>
                </ol>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">⚠️ Önemli Notlar:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Zorunlu alanlar:</strong> brand, model, year, price</li>
                  <li>• <strong>fuelType:</strong> Benzin, Dizel, Hibrit, Elektrik, LPG</li>
                  <li>• <strong>transmissionType:</strong> Manuel, Otomatik</li>
                  <li>• <strong>status:</strong> available, sold, reserved (varsayılan: available)</li>
                  <li>• <strong>images:</strong> Resim URL'leri dizisi (boş bırakılabilir)</li>
                  <li>• <strong>featured:</strong> true/false (varsayılan: false)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Arabam.com Scraping */}
          <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Arabam.com'dan Otomatik Çek</CardTitle>
                  <CardDescription className="mt-1">
                    Galeri sayfasından araçları otomatik olarak çekin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Arabam.com Galeri URL'si</label>
                <Input
                  value={arabamUrl}
                  onChange={(e) => setArabamUrl(e.target.value)}
                  placeholder="https://www.arabam.com/galeri/bolen-otomotiv"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Galeri sayfasının URL'sini girin (örn: https://www.arabam.com/galeri/bolen-otomotiv)
                </p>
              </div>
              <Button
                onClick={handleScrapeFromArabam}
                disabled={isScraping || !arabamUrl.trim()}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Araçlar Çekiliyor...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Arabam.com'dan Araçları Çek
                  </>
                )}
              </Button>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Not:</strong> Araçlar çekildikten sonra JSON formatında görünecek. İsterseniz düzenleyip "Araçları Ekle" butonuna tıklayabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* JSON Input */}
          <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">JSON Verisi</CardTitle>
                    <CardDescription className="mt-1">
                      Araç bilgilerini JSON formatında yapıştırın
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadExample}
                  className="!border !border-gray-500 dark:!border-gray-600"
                >
                  Örnek Yükle
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="JSON verisini buraya yapıştırın..."
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="mt-4 flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !jsonInput.trim()}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Araçları Ekle
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setJsonInput('')}
                  disabled={isSubmitting}
                  className="!border !border-gray-500 dark:!border-gray-600"
                >
                  Temizle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                    {results.failed === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">Sonuçlar</CardTitle>
                    <CardDescription className="mt-1">
                      İşlem tamamlandı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-semibold text-emerald-900 dark:text-emerald-100">Başarılı</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{results.success}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-900 dark:text-red-100">Başarısız</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{results.failed}</p>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="font-semibold mb-2 text-sm">Hata Detayları:</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {results.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-950/20 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

