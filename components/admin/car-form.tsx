'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';
import { Car } from '@/types/car';
import { addCar, updateCar } from '@/lib/db/cars';
import { uploadMultipleImages } from '@/lib/db/storage';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image as ImageIcon, Info, Settings, FileText, Star, PlusCircle } from 'lucide-react';
import Image from 'next/image';

const carSchema = z.object({
  brand: z.string().min(1, 'Marka gerekli'),
  model: z.string().min(1, 'Model gerekli'),
  year: z.number().min(1900).max(2025),
  price: z.number().min(0),
  km: z.number().min(0),
  fuelType: z.enum(['Benzin', 'Dizel', 'Hibrit', 'Elektrik', 'LPG']),
  transmissionType: z.enum(['Manuel', 'Otomatik']),
  color: z.string().min(1, 'Renk gerekli'),
  description: z.string(),
  status: z.enum(['available', 'sold', 'reserved']),
  isFeatured: z.boolean(),
});

type CarFormData = z.infer<typeof carSchema>;

interface CarFormProps {
  car?: Car;
  isEdit?: boolean;
}

export function CarForm({ car, isEdit = false }: CarFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(car?.images || []);

  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: car?.brand || '',
      model: car?.model || '',
      year: car?.year || new Date().getFullYear(),
      price: car?.price || 0,
      km: car?.km || 0,
      fuelType: car?.fuelType || 'Benzin',
      transmissionType: car?.transmissionType || 'Manuel',
      color: car?.color || '',
      description: car?.description || '',
      status: car?.status || 'available',
      isFeatured: car?.isFeatured || false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrls = [...existingImages];

      // Yeni resimler varsa yükle
      if (imageFiles.length > 0) {
        const tempCarId = car?.id || `temp-${Date.now()}`;
        const uploadedUrls = await uploadMultipleImages(imageFiles, tempCarId);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const carData = {
        ...data,
        images: imageUrls,
      };

      if (isEdit && car) {
        await updateCar(car.id, carData);
        toast.success('Araç başarıyla güncellendi');
      } else {
        await addCar(carData);
        toast.success('Araç başarıyla eklendi');
      }

      router.push('/admin/araclar');
      router.refresh();
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Images Section */}
        <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Araç Resimleri</CardTitle>
                <CardDescription className="mt-1">Aracın fotoğraflarını yükleyin (Minimum 1 resim)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">Mevcut Resimler</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="group relative aspect-square rounded-xl overflow-hidden !border-2 !border-gray-400 dark:!border-gray-600 shadow-md hover:shadow-xl transition-all">
                      <Image
                        src={url}
                        alt={`Existing ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={() => removeExistingImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white font-medium">Resim #{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {imageFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3 text-muted-foreground">Yeni Resimler</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="group relative aspect-square rounded-xl overflow-hidden !border-2 !border-emerald-400 dark:!border-emerald-600 shadow-md hover:shadow-xl transition-all">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={() => removeImageFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600/80 to-transparent p-2">
                        <p className="text-xs text-white font-medium">Yeni #{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Resim Yükle</p>
                    <p className="text-sm text-muted-foreground mt-1">Tıklayın ve dosyalarınızı seçin</p>
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Section */}
        <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-md">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Temel Bilgiler</CardTitle>
                <CardDescription className="mt-1">Aracın marka, model ve fiyat bilgileri</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marka</FormLabel>
                    <FormControl>
                      <Input placeholder="BMW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="320i" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yıl</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat (₺)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="2450000"
                        {...field}
                        value={field.value?.toLocaleString('tr-TR') || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(parseFloat(value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Sadece rakam girin (örn: 2450000)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometre</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="150000"
                        {...field}
                        value={field.value?.toLocaleString('tr-TR') || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(parseInt(value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Sadece rakam girin (örn: 150000)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renk</FormLabel>
                    <FormControl>
                      <Input placeholder="Beyaz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Technical Specs Section */}
        <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Teknik Özellikler</CardTitle>
                <CardDescription className="mt-1">Yakıt tipi, vites ve durum bilgileri</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yakıt Tipi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FUEL_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmissionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vites Tipi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSMISSION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durum</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Satışta</SelectItem>
                        <SelectItem value="sold">Satıldı</SelectItem>
                        <SelectItem value="reserved">Rezerve</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description Section */}
        <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <CardHeader className="!border-b !border-gray-400 dark:!border-gray-700 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Açıklama</CardTitle>
                <CardDescription className="mt-1">Araç hakkında detaylı bilgi ekleyin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Araç hakkında detaylı bilgi... (örn: Hasarsız, ilk sahibinden, bakımlı)"
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Featured Section */}
        <Card className="!border-2 !border-amber-400 dark:!border-amber-600 !shadow-[0_4px_12px_rgba(251,191,36,0.25)] dark:!shadow-[0_4px_12px_rgba(251,191,36,0.4)]">
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="mt-1 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                  </FormControl>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <FormLabel className="text-lg font-semibold">Öne Çıkan Araç</FormLabel>
                    </div>
                    <FormDescription className="text-sm">
                      Bu araç ana sayfada öne çıkan araçlar bölümünde gösterilecektir. Öne çıkan araçlar daha fazla görünürlük kazanır.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="flex-1 md:flex-none md:min-w-[200px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {isEdit ? 'Güncelleniyor...' : 'Ekleniyor...'}
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5 mr-2" />
                {isEdit ? 'Güncelle' : 'Ekle'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="!border-2 !border-gray-500 dark:!border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
          >
            İptal
          </Button>
        </div>
      </form>
    </Form>
  );
}

