'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { submitContact } from '@/lib/db/contacts';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function IletisimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContact(data);
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      form.reset();
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast.error('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya araç hakkında bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>Size en uygun yoldan ulaşabilirsiniz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">E-posta</p>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-muted-foreground hover:text-primary">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Adres</p>
                    <p className="text-sm text-muted-foreground">{CONTACT_INFO.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Çalışma Saatleri</p>
                    <p className="text-sm text-muted-foreground">Pazartesi - Cumartesi</p>
                    <p className="text-sm text-muted-foreground">09:00 - 19:00</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t flex flex-col gap-4">
                  <div>
                    <a
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp ile İletişime Geç
                      </Button>
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://www.instagram.com/bolenotomotiv?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 dark:border-pink-400 dark:text-pink-300 dark:hover:bg-pink-950/40"
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram'da Takip Et
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              <CardHeader>
                <CardTitle>Harita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Bölen Otomotiv Konumu"
                    src="https://www.google.com/maps?q=Alpa%C4%9Fut%2C%20%C4%B0zzet%20Baysal%20Devlet%20Hst.%20Blv.%20no%3A177%20D%3A1%2C%2014100%20Bolu%20Merkez%2FBolu&output=embed"
                    loading="lazy"
                    className="h-72 w-full border-0"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="!border !border-gray-500 dark:!border-gray-600 !shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:!shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              <CardHeader>
                <CardTitle>Mesaj Gönderin</CardTitle>
                <CardDescription>
                  Formu doldurarak bize ulaşabilirsiniz. En kısa sürede size geri dönüş yapacağız.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adınız Soyadınız</FormLabel>
                          <FormControl>
                            <Input placeholder="Adınız ve soyadınız" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="ornek@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="0555 123 45 67" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mesajınız</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mesajınızı buraya yazınız..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        'Gönderiliyor...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Mesajı Gönder
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
