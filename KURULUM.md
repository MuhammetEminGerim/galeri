# 🚀 Hızlı Başlangıç Kılavuzu

Bu kılavuz projeyi 15 dakikada çalıştırmanızı sağlayacak.

## ✅ Önkoşullar

- Node.js 18+ yüklü olmalı
- Bir Google hesabı (Firebase için)

## 📋 Adımlar

### 1. Firebase Projesi Oluşturma (5 dakika)

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add Project" → Proje adı: `araba-galerisi` → Google Analytics: **Skip** → "Create Project"

### 2. Firebase Web App Ekleme (2 dakika)

1. Project Overview → `</>` (Web) ikonuna tıklayın
2. App nickname: `Galeri Web` → "Register app"
3. Config bilgilerini kopyalayın (sonra kullanacağız)

### 3. Firestore Database (2 dakika)

1. Sol menü → **Build** → **Firestore Database** → "Create database"
2. **Production mode** seçin → Location: **europe-west3** → "Enable"
3. **Rules** tabına geçin, aşağıdakini yapıştırın:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```

4. **Publish** tıklayın

### 4. Cloudinary (Fotoğraf Depolama) (2 dakika)

1. https://cloudinary.com/users/register_free adresine gidin
2. Ücretsiz hesap oluşturun (Email veya Google ile)
3. Dashboard'da → **"Go to API Keys"** butonuna tıklayın
4. Aşağıdaki bilgileri kopyalayın:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (yıldızlara tıklayarak görün)
5. Bu bilgileri `.env.local` dosyasına ekleyin (aşağıda gösterildi)

### 5. Firebase Authentication (2 dakika)

1. Sol menü → **Build** → **Authentication** → "Get started"
2. **Email/Password** seçin → İlk toggle'ı **aktif** edin → "Save"
3. **Users** tabı → "Add user"
   - Email: `admin@galeri.com`
   - Password: `Admin123!` (kendinize göre değiştirin)
   - "Add user"

### 6. Projeyi Yapılandırma (2 dakika)

Proje klasöründe `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=araba-galerisi-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=araba-galerisi-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=araba-galerisi-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> 💡 Firebase değerleri 2. adımda, Cloudinary değerleri 4. adımda kopyaladığınız bilgilerden alın

### 7. Projeyi Çalıştırma (2 dakika)

```bash
npm install
npm run dev
```

Tarayıcıda açın: http://localhost:3000

## 🎉 Tamamlandı!

### Test Etme

1. **Ana Sayfa**: http://localhost:3000
2. **Admin Paneli**: http://localhost:3000/admin/login
   - Email: `admin@galeri.com`
   - Password: Adım 5'te belirlediğiniz şifre

### İlk Aracı Ekleme

1. Admin paneline giriş yapın
2. "Yeni Araç Ekle" butonuna tıklayın
3. Formu doldurun ve resimleri yükleyin
4. "Ekle" butonuna tıklayın
5. Ana sayfaya gidin ve aracı görün!

## 🆘 Sorun mu Yaşıyorsunuz?

### Firebase bağlantı hatası
- `.env.local` dosyasındaki bilgileri tekrar kontrol edin
- Tüm değerleri doğru kopyaladığınızdan emin olun

### Admin girişi çalışmıyor
- Firebase Console → Authentication → Users bölümünden kullanıcının eklendiğini kontrol edin
- Email/Password'ün aktif olduğunu kontrol edin

### Resimler yüklenmiyor
- Firebase Storage'ın aktif olduğunu kontrol edin
- Storage Rules'ın doğru olduğunu kontrol edin

## 📚 Daha Fazla Bilgi

Detaylı bilgi için `README.md` ve `firebase-setup.md` dosyalarını okuyun.

---

**Önemli**: `.env.local` dosyasını asla paylaşmayın veya Git'e eklemeyin!

