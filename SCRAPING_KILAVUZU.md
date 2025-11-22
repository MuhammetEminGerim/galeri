# 📦 Arabam.com Scraping Kılavuzu

## 🚀 Script Kullanımı

### 1. Terminal/Command Prompt Açın

**Windows:**
- `Win + R` → `cmd` veya `powershell` yazın
- Proje klasörüne gidin: `cd C:\Users\Emin\Desktop\galeri`

**Mac/Linux:**
- Terminal açın
- Proje klasörüne gidin: `cd ~/Desktop/galeri`

### 2. Script'i Çalıştırın

```bash
node scripts/scrape-arabam.js https://www.arabam.com/galeri/bolen-otomotiv
```

**Veya farklı bir galeri URL'si için:**
```bash
node scripts/scrape-arabam.js https://www.arabam.com/galeri/diger-galeri
```

### 3. JSON Çıktısını Kopyalayın

Script çalıştıktan sonra console'da JSON formatında araç listesi görünecek:

```json
[
  {
    "brand": "Opel",
    "model": "Corsa 1.4 Enjoy",
    "year": 2016,
    "price": 960000,
    "km": 97000,
    "fuelType": "Benzin",
    "transmissionType": "Otomatik",
    "color": "Beyaz",
    "description": "BÖLEN OTOMOTİV'DEN 2016 OPEL CORSA 1.4 ENJOY OTOMATİK",
    "images": ["https://..."],
    "status": "available",
    "featured": false
  }
]
```

### 4. Admin Paneline Gidin

1. Admin paneline giriş yapın
2. **Araçlar** → **Toplu Ekle** sayfasına gidin
3. JSON çıktısını kopyalayıp yapıştırın
4. **"Araçları Ekle"** butonuna tıklayın

---

## ⚙️ Gereksinimler

- Node.js kurulu olmalı (v18+)
- `cheerio` paketi kurulu olmalı (zaten kurulu)

---

## 🔧 Sorun Giderme

### "node: command not found"
- Node.js kurulu değil
- [Node.js'i indirin](https://nodejs.org/) ve kurun

### "Cannot find module 'cheerio'"
```bash
npm install
```

### "403 Forbidden" hatası
- Arabam.com bot koruması aktif
- Birkaç dakika bekleyip tekrar deneyin
- Farklı bir IP'den deneyin (VPN kullanabilirsiniz)

### Script çalışmıyor
- Proje klasöründe olduğunuzdan emin olun
- `node --version` ile Node.js versiyonunu kontrol edin

---

## 💡 İpuçları

1. **Rate Limiting:** Script her araç için 1 saniye bekler (bot koruması için)
2. **Maksimum Araç:** Script maksimum 10 araç detay sayfası çeker
3. **Manuel Düzenleme:** JSON'u kopyaladıktan sonra istediğiniz gibi düzenleyebilirsiniz
4. **Resimler:** Resimler arabam.com'dan direkt link olarak eklenir

---

## 📝 Örnek Kullanım

```bash
# 1. Proje klasörüne git
cd C:\Users\Emin\Desktop\galeri

# 2. Script'i çalıştır
node scripts/scrape-arabam.js https://www.arabam.com/galeri/bolen-otomotiv

# 3. Console'da çıkan JSON'u kopyala

# 4. Admin panel → Toplu Ekle → JSON'u yapıştır → Araçları Ekle
```

---

## 🎯 Avantajlar

- ✅ Local'de çalıştığı için bot koruması daha az etkili
- ✅ Kendi bilgisayarınızdan çalıştırdığınız için IP bazlı kısıtlamalar olmayabilir
- ✅ Script basit ve bakımı kolay
- ✅ JSON çıktısını direkt kullanabilirsiniz

