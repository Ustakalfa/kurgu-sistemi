# Node ve Remotion onarımı — 20 Ekim 2026

## Kök neden

`remotion versions` hem mevcut Node 24.22.0 hem de ayrı kurulan Node 22.23.3 ile eski `node_modules` üzerinde çıktı vermeden takıldı. Eski bağımlılık dizini diskte yalnızca yaklaşık 3,2 MB yer kaplıyordu. `package.json` ve kilit dosyasındaki Remotion paketleri zaten 4.0.532 sürümündeydi. Bu bulgular Node 24 uyumsuzluğunu ve paket sürümü uyuşmazlığını dışlıyor; sorun eski `node_modules` dosyalarının eksik veya yerel diskte tam kullanılabilir olmamasıydı.

## Düzeltme

Proje dizininde Node 22 ile `npm ci --no-audit --no-fund` çalıştırılarak bağımlılıklar `package-lock.json` üzerinden temiz biçimde yeniden kuruldu. Yeni `node_modules` yaklaşık 328 MB. `package.json`, kilit dosyası ve `src/` içindeki Reels03–07 kodu değiştirilmedi. `remotion versions` temiz kurulumdan sonra hem Node 22.23.3 hem de Node 24.22.0 ile sorunsuz çalışıp bütün Remotion paketlerini 4.0.532 olarak doğruladı.

Bu proje için mevcut Node 24 kullanılabilir. Karşılaştırma amacıyla kurulan Node 22, `/opt/homebrew/opt/node@22/bin/node` yolundadır; zorunlu bir sürüm geçişi yapılmadı.

## Doğrulama

```sh
npx remotion still src/index.ts Reels07 ~/kurulum-2026-10-20/test_still.png --frame=600
```

Komut başarıyla tamamlandı. `test_still.png` geçerli, 1080 × 1920 boyutlu bir PNG olarak üretildi.

Tüm terminal işlemleri ayrı süreç grubunda ve en çok 90 saniyelik sınırla yürütüldü.
