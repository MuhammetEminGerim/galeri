# Firebase Kurulum Kılavuzu

Bu dosya Firebase projesini kurmak için gerekli adımları içerir.

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add Project" / "Proje Ekle" butonuna tıklayın
3. Proje adı girin (örn: "araba-galerisi")
4. Google Analytics isteğe bağlı (kapatabilirsiniz)
5. Projeyi oluşturun

## 2. Web App Ekleme

1. Project Overview'dan "Web" ikonu (</>)  tıklayın
2. App nickname girin: "Galeri Web App"
3. Firebase Hosting'i şimdilik atla
4. "Register app" tıklayın
5. Karşınıza çıkan config bilgilerini kopyalayın

## 3. .env.local Dosyasını Düzenleme

Config bilgilerini `.env.local` dosyasına yapıştırın:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proje-adi.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proje-adi
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proje-adi.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 4. Firestore Database Oluşturma

1. Sol menüden "Build" > "Firestore Database"
2. "Create database" tıklayın
3. "Start in production mode" seçin (güvenlik kurallarını sonra ekleyeceğiz)
4. Location seçin: "europe-west" (Türkiye'ye en yakın)
5. "Enable" tıklayın

## 5. Storage Oluşturma

1. Sol menüden "Build" > "Storage"
2. "Get started" tıklayın
3. "Start in production mode" seçin
4. Location aynı kalacak (europe-west)
5. "Done" tıklayın

## 6. Authentication Kurma

1. Sol menüden "Build" > "Authentication"
2. "Get started" tıklayın
3. "Email/Password" seçin
4. İlk toggle'ı aktif edin (Email/Password)
5. "Save" tıklayın
6. "Users" tabına gelin
7. "Add user" tıklayın
8. Admin email ve şifre girin (örn: admin@galeri.com)
9. "Add user" tıklayın

## 7. Security Rules Ekleme

### Firestore Rules

1. Firestore Database > "Rules" tabı
2. Aşağıdaki kuralları yapıştırın:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cars collection - herkes okuyabilir, sadece auth kullanıcılar yazabilir
    match /cars/{carId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    
    // Contacts collection - herkes yazabilir, sadece auth kullanıcılar okuyabilir
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
\`\`\`

3. "Publish" tıklayın

### Storage Rules

1. Storage > "Rules" tabı
2. Aşağıdaki kuralları yapıştırın:

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cars/{carId}/{fileName} {
      // Herkes okuyabilir
      allow read: if true;
      // Sadece auth kullanıcılar yükleyebilir
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

3. "Publish" tıklayın

## 8. Test Verisi Ekleme (Opsiyonel)

Firestore'da "cars" collection oluşturun ve test arabası ekleyin:

```json
{
  "brand": "BMW",
  "model": "320i",
  "year": 2020,
  "price": 1250000,
  "km": 45000,
  "fuelType": "Benzin",
  "transmissionType": "Otomatik",
  "color": "Beyaz",
  "description": "Hasar kaydı yok, garaj arabası",
  "images": [],
  "status": "available",
  "featured": true,
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

## Kurulum Tamamlandı! ✅

Artık projenizi çalıştırabilirsiniz:

```bash
npm run dev
```

Tarayıcıda: http://localhost:3000

