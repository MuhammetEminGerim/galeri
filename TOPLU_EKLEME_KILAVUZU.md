# 📦 Toplu Araç Ekleme Kılavuzu

## 🚀 Nasıl Kullanılır?

### 1️⃣ Admin Paneline Giriş
- `/admin/araclar` sayfasına gidin
- **"Toplu Ekle"** butonuna tıklayın

### 2️⃣ JSON Formatı Hazırlama

Sahibinden.com'daki araçları şu formatta hazırlayın:

```json
[
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
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
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
]
```

### 3️⃣ Zorunlu Alanlar

✅ **Mutlaka olmalı:**
- `brand` - Marka (örn: "Toyota")
- `model` - Model (örn: "Corolla")
- `year` - Yıl (örn: 2020)
- `price` - Fiyat (örn: 450000)

### 4️⃣ Opsiyonel Alanlar

⚠️ **Varsayılan değerlerle doldurulur:**
- `km` → 0
- `fuelType` → "Benzin"
- `transmissionType` → "Manuel"
- `color` → "Belirtilmemiş"
- `description` → ""
- `images` → []
- `status` → "available"
- `featured` → false

### 5️⃣ Geçerli Değerler

**fuelType:**
- "Benzin"
- "Dizel"
- "Hibrit"
- "Elektrik"
- "LPG"

**transmissionType:**
- "Manuel"
- "Otomatik"

**status:**
- "available" (Satışta)
- "sold" (Satıldı)
- "reserved" (Rezerve)

### 6️⃣ Resim URL'leri

- Resimler `images` dizisinde URL olarak eklenir
- Boş bırakılabilir: `"images": []`
- Birden fazla resim: `"images": ["url1", "url2", "url3"]`

### 7️⃣ Örnek Kullanım

1. Sahibinden.com'dan araç bilgilerini toplayın
2. JSON formatında hazırlayın
3. Admin panelde "Toplu Ekle" sayfasına gidin
4. "Örnek Yükle" butonuna tıklayarak formatı görün
5. JSON'unuzu yapıştırın
6. "Araçları Ekle" butonuna tıklayın
7. Sonuçları kontrol edin

### 8️⃣ Hata Yönetimi

- ✅ Başarılı eklenen araçlar gösterilir
- ❌ Hatalı araçlar listelenir
- Her hata için detaylı mesaj gösterilir

---

## 💡 İpuçları

1. **Toplu işlem:** Tüm araçları tek seferde ekleyebilirsiniz
2. **Hata toleransı:** Bir araç hata verse bile diğerleri eklenir
3. **Örnek format:** "Örnek Yükle" butonu ile formatı görebilirsiniz
4. **Resimler:** Sahibinden.com'daki resim URL'lerini direkt kullanabilirsiniz

---

## ⚠️ Dikkat Edilmesi Gerekenler

- JSON formatı doğru olmalı (virgüller, tırnak işaretleri)
- Zorunlu alanlar eksik olmamalı
- `fuelType` ve `transmissionType` geçerli değerler olmalı
- `year` ve `price` sayı olmalı

