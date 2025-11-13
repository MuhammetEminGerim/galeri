# 🚗 AutoGaleri - Araba Galerisi Web Sitesi

Modern, minimal ve kullanıcı dostu bir araba galerisi web sitesi. Next.js 14, Firebase ve Tailwind CSS ile geliştirilmiştir.

## ✨ Özellikler

### Kullanıcı Tarafı
- 🏠 **Ana Sayfa**: Hero section, öne çıkan araçlar ve özellikler
- 🚙 **Araç Listesi**: Grid/List görünümü, gelişmiş filtreleme sistemi
- 🔍 **Araç Detay**: Resim galerisi, detaylı bilgiler, WhatsApp entegrasyonu
- ❤️ **Favoriler**: Beğenilen araçları kaydetme
- ⚖️ **Karşılaştırma**: Araçları yan yana karşılaştırma (max 3)
- 📧 **İletişim**: İletişim formu ve bilgiler
- 📱 **Responsive**: Mobil, tablet ve desktop uyumlu

### Filtreleme Sistemi
- Marka ve model seçimi (dinamik)
- Fiyat aralığı slider
- Yıl aralığı slider
- Kilometre aralığı slider
- Yakıt tipi filtresi
- Vites tipi filtresi
- Sıralama seçenekleri

### Admin Paneli
- 🔐 **Güvenli Giriş**: Firebase Authentication
- 📊 **Dashboard**: İstatistikler ve genel bakış
- ➕ **Araç Yönetimi**: Ekleme, düzenleme, silme
- 🖼️ **Resim Yönetimi**: Çoklu resim yükleme ve silme
- 📝 **Detaylı Form**: Tüm araç bilgileri

## 🛠️ Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Veritabanı**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form**: React Hook Form + Zod
- **Animasyonlar**: Framer Motion
- **Icons**: Lucide React

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Firebase Yapılandırması

`firebase-setup.md` dosyasındaki adımları takip ederek:

1. Firebase Console'da yeni proje oluşturun
2. Firestore Database'i aktifleştirin
3. Storage'ı aktifleştirin
4. Authentication'ı Email/Password ile aktifleştirin
5. Admin kullanıcısı oluşturun

### 3. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyasını oluşturun ve Firebase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. İletişim Bilgilerini Güncelleyin

`lib/constants.ts` dosyasındaki iletişim bilgilerini güncelleyin:

```typescript
export const CONTACT_INFO = {
  phone: '+90 XXX XXX XX XX',
  email: 'info@galeri.com',
  address: 'Gerçek adresiniz',
  whatsapp: '+90XXXXXXXXXX',
};
```

### 5. Siteyi Çalıştırın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🚀 Deployment

### Vercel'e Deploy

1. GitHub'a projeyi yükleyin
2. [Vercel](https://vercel.com)'e gidin ve projeyi import edin
3. Environment variables'ı ekleyin (.env.local'daki değerler)
4. Deploy edin!

### Firebase Security Rules

Firebase Console'dan aşağıdaki kuralları ekleyin:

**Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```

**Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cars/{carId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Kullanım

### Admin Paneline Giriş

1. `/admin/login` adresine gidin
2. Firebase'de oluşturduğunuz admin email/şifresini girin
3. Dashboard'a yönlendirileceksiniz

### Araç Ekleme

1. Admin panelinde "Yeni Araç Ekle" butonuna tıklayın
2. Formu doldurun
3. Resimleri yükleyin (sürükle-bırak destekli)
4. "Ekle" butonuna tıklayın

### Araç Düzenleme

1. Admin panelinde araç listesinden düzenlemek istediğiniz aracın yanındaki kalem ikonuna tıklayın
2. Bilgileri güncelleyin
3. "Güncelle" butonuna tıklayın

## 🎨 Özelleştirme

### Renk Teması

`app/globals.css` dosyasından renk değişkenlerini değiştirebilirsiniz.

### Logo ve Marka Adı

- `components/header.tsx` ve `components/footer.tsx` dosyalarından "AutoGaleri" ismini değiştirin
- `lib/constants.ts` dosyasındaki `SITE_CONFIG` değerlerini güncelleyin

### Ana Sayfa İçeriği

`app/page.tsx` dosyasından hero section ve features bölümünü özelleştirebilirsiniz.

## 📝 Dosya Yapısı

```
galeri/
├── app/                          # Next.js App Router
│   ├── (sayfalar)/
│   │   ├── page.tsx             # Ana sayfa
│   │   ├── araclar/             # Araç listesi ve detay
│   │   ├── favorilerim/         # Favoriler
│   │   ├── karsilastir/         # Karşılaştırma
│   │   └── iletisim/            # İletişim
│   ├── admin/                   # Admin paneli
│   │   ├── login/               # Admin girişi
│   │   ├── dashboard/           # Dashboard
│   │   └── araclar/             # Araç yönetimi
│   ├── layout.tsx               # Ana layout
│   ├── sitemap.ts               # SEO sitemap
│   └── robots.ts                # SEO robots.txt
├── components/                  # React componentleri
│   ├── ui/                      # shadcn/ui componentleri
│   ├── admin/                   # Admin componentleri
│   ├── header.tsx
│   ├── footer.tsx
│   ├── car-card.tsx
│   ├── filter-sidebar.tsx
│   └── ...
├── lib/                         # Yardımcı fonksiyonlar
│   ├── db/                      # Database abstraction layer
│   │   ├── cars.ts              # Araç işlemleri
│   │   ├── contacts.ts          # İletişim işlemleri
│   │   ├── storage.ts           # Resim işlemleri
│   │   └── auth.ts              # Authentication
│   ├── utils/                   # Utility fonksiyonlar
│   ├── firebase.ts              # Firebase config
│   └── constants.ts             # Sabitler
├── hooks/                       # Custom React hooks
│   ├── useFavorites.ts
│   └── useCompare.ts
├── types/                       # TypeScript tipleri
│   └── car.ts
└── public/                      # Statik dosyalar
```

## 🔒 Güvenlik

- Admin paneli Firebase Authentication ile korunmuştur
- Firestore ve Storage security rules aktiftir
- API route'ları korumalıdır
- Form validasyonu Zod ile yapılır
- XSS ve CSRF koruması mevcuttur

## 🆘 Sorun Giderme

### Firebase bağlantı hatası

- `.env.local` dosyasındaki Firebase bilgilerini kontrol edin
- Firebase Console'da projenin aktif olduğundan emin olun

### Resimler yüklenmiyor

- Firebase Storage'ın aktif olduğunu kontrol edin
- Storage security rules'ın doğru olduğundan emin olun

### Admin paneline giriş yapamıyorum

- Firebase Authentication'da Email/Password'ün aktif olduğunu kontrol edin
- Admin kullanıcısının oluşturulduğunu kontrol edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📞 Destek

Sorularınız için issue açabilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
