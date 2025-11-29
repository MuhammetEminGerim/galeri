# cPanel Kurulum Kılavuzu

Bu proje, cPanel gibi standart hostinglerde çalışabilmesi için "Statik HTML" olarak ayarlanmıştır. Aşağıdaki adımları takiperek sitenizi yayınlayabilirsiniz.

## 1. Hazırlık (Bilgisayarınızda)

Öncelikle Cloudinary ayarlarını yapmalısınız. cPanel'de sunucu (Node.js) çalışmayacağı için resim yüklemeleri doğrudan tarayıcıdan yapılacak.

1.  **Cloudinary Ayarları:**
    *   Cloudinary panelinize giriş yapın.
    *   **Settings (Ayarlar) > Upload** sekmesine gidin.
    *   Aşağıya inip **Upload presets** bölümünü bulun.
    *   **Add upload preset** diyerek yeni bir preset oluşturun.
    *   **Signing Mode:** "Unsigned" olarak seçin.
    *   **Save** diyerek kaydedin.
    *   Oluşan preset ismini kopyalayın (örn: `ml_default`).

2.  **Dosya Ayarları:**
    *   Projenizdeki `.env.local` dosyasını açın (yoksa oluşturun).
    *   Şu satırı ekleyin veya güncelleyin:
        ```
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=sizin_preset_isminiz
        ```

3.  **Projeyi Derleme (Build):**
    *   Terminali açın ve şu komutu çalıştırın:
        ```bash
        npm run build
        ```
    *   Bu işlem bittiğinde proje klasörünüzde `out` adında bir klasör oluşacak. Bu klasör sitenizin son halidir.

## 2. Yükleme (cPanel'de)

1.  **Dosya Yöneticisi:**
    *   cPanel'e giriş yapın ve **Dosya Yöneticisi**'ni açın.
    *   `public_html` klasörüne gidin (veya subdomain ise ilgili klasöre).
    *   Klasörün içinin boş olduğundan emin olun (varsa eski dosyaları silin veya yedekleyin).

2.  **Dosyaları Yükleme:**
    *   Bilgisayarınızdaki `out` klasörünün **içindeki tüm dosyaları** seçin.
    *   Hepsini bir ZIP dosyası yapın (`site.zip` gibi).
    *   cPanel'de **Yükle** butonuna basıp bu ZIP dosyasını yükleyin.
    *   Yükleme bitince ZIP dosyasına sağ tıklayıp **Extract (Çıkar)** deyin.
    *   Dosyalar çıktıktan sonra ZIP dosyasını silebilirsiniz.

## 3. Son Kontrol

*   Sitenizin adresine gidin.
*   Sayfaların açıldığını kontrol edin.
*   Admin paneline girip (`/admin/login`) giriş yapmayı deneyin.
*   Yeni bir araç ekleyip resim yüklemeyi test edin.

**Not:** Eğer sayfa yenileyince "404 Not Found" hatası alırsanız, cPanel'de `.htaccess` dosyası oluşturup içine şunu yapıştırın:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

Hayırlı olsun! 🚀
