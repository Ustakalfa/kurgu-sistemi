# Yerel değişiklikler

Bu depo, upstream/canlı düzeni kamuya açılabilir ve taşınabilir hale getirirken şu bilinçli farkları taşır.

## `bin/` araçları

- Model zincirleri `$HOME/.config/kurgu-sistemi/modeller.env` ile değiştirilebilir; çağrı ortamı dosyadaki değerden önceliklidir.
- `yeni-is`, canlı wiki kökü yoksa wiki kaydını atlayıp taşınabilir iş klasörünü yine oluşturur.
- Kamu örnekleri `$HOME` ve adsız yer tutucular kullanır; canlı ortama özgü mutlak yol taşımaz.

## Skills ve içerik

- Skill düzeninde depo kaynağı/bağlantı yolu önceliği kurulum tarafından yönetilir; kopya ile canlı sürüm sessizce ezilmez.
- “Kurgu Dersleri” gerçek iş/kişi ayrıntılarından arındırılıp genellenebilir ilkelere dönüştürülmüştür.
- Remotion kompozisyon kimlikleri (`NexusTanitim`, `Reels07` gibi) depodaki `remotion/src/Root.tsx` içinde korunur; bunlar örnek şablonlardır, gerçek müşteri medyası veya teslim dosyası depoya alınmaz.

Bu farklar senkron sırasında korunmalıdır; `vendor/` upstream ve salt okunurdur.
