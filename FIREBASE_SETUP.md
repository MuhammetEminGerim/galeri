# Firebase Kurulum Rehberi

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Proje Ekle" butonuna tıklayın
3. Proje adını girin (örn: "galeri-web")
4. Google Analytics'i isteğe bağlı olarak etkinleştirin
5. "Proje Oluştur" butonuna tıklayın

## 2. Web Uygulaması Ekleme

1. Firebase projesine girdikten sonra "</>" (Web) ikonuna tıklayın
2. Uygulama takma adını girin (örn: "galeri-web")
3. "Firebase Hosting'i kur" seçeneğini işaretlemeyin
4. "Uygulamayı kaydet" butonuna tıklayın
5. Gösterilen yapılandırma bilgilerini kopyalayın

## 3. Environment Variables Ekleme

Kopyaladığınız bilgileri `.env.local` dosyasına ekleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Firestore Database Kurulumu

1. Sol menüden "Firestore Database" seçin
2. "Veritabanı oluştur" butonuna tıklayın
3. "Üretim modunda başlat" seçeneğini seçin
4. Bölge seçin (Europe-west3 Almanya önerilir)
5. "Etkinleştir" butonuna tıklayın

## 5. Firestore Güvenlik Kuralları

1. "Kurallar" sekmesine gidin
2. `firestore.rules` dosyasındaki içeriği kopyalayıp yapıştırın
3. "Yayınla" butonuna tıklayın

## 6. Storage Kurulumu

1. Sol menüden "Storage" seçin
2. "Başlat" butonuna tıklayın
3. "Üretim modunda başlat" seçeneğini seçin
4. "İleri" butonuna tıklayın
5. Bölge seçin (Firestore ile aynı)
6. "Bitti" butonuna tıklayın

## 7. Storage Güvenlik Kuralları

1. "Kurallar" sekmesine gidin
2. `storage.rules` dosyasındaki içeriği kopyalayıp yapıştırın
3. "Yayınla" butonuna tıklayın

## 8. Authentication Kurulumu

1. Sol menüden "Authentication" seçin
2. "Başlayalım" butonuna tıklayın
3. "Sign-in method" sekmesine gidin
4. "Email/Password" seçeneğini etkinleştirin
5. "Kaydet" butonuna tıklayın

## 9. İlk Admin Kullanıcı Oluşturma

1. "Users" sekmesine gidin
2. "Kullanıcı ekle" butonuna tıklayın
3. Email ve şifre girin (örn: admin@galeri.com)
4. "Kullanıcı ekle" butonuna tıklayın

## 10. Projeyi Çalıştırma

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

Admin paneline giriş yapmak için:
- URL: http://localhost:3000/admin/login
- Email: admin@galeri.com
- Şifre: oluşturduğunuz şifre

## Notlar

- `.env.local` dosyası `.gitignore`'da olduğu için Git'e yüklenmez
- Production'da Vercel dashboard'dan environment variables ekleyin
- Firebase ücretsiz planı 1GB Storage ve 50K okuma/gün içerir

