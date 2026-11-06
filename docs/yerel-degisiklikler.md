# Yerel değişiklikler

Bu depo, upstream/canlı düzeni kamuya açılabilir ve taşınabilir hale getirirken şu bilinçli farkları taşır.

## `bin/` araçları

- Model zincirleri `$HOME/.config/kurgu-sistemi/modeller.env` ile değiştirilebilir; çağrı ortamı dosyadaki değerden önceliklidir.
- `yeni-is`, canlı wiki kökü yoksa wiki kaydını atlayıp taşınabilir iş klasörünü yine oluşturur.
- Kamu örnekleri `$HOME` ve adsız yer tutucular kullanır; canlı ortama özgü mutlak yol taşımaz.

## Skills ve içerik

- Skill düzeninde depo kaynağı/bağlantı yolu önceliği kurulum tarafından yönetilir; kopya ile canlı sürüm sessizce ezilmez.
- "Kurgu Dersleri" gerçek iş/kişi ayrıntılarından arındırılıp genellenebilir ilkelere dönüştürülmüştür.
- Remotion kompozisyon kimlikleri (`NexusTanitim`, `Reels07`, `KiyasI1` gibi) depodaki `remotion/src/Root.tsx` içinde korunur; bunlar örnek şablonlardır, gerçek müşteri medyası veya teslim dosyası depoya alınmaz.

## Senkron davranışı (6 Kasım 2026 itibarıyla)

`senkronla.sh` betiğinin yeni güvenli davranışı:

1. **Yalnız izlenen dosyalar güncellenir.** `git ls-files remotion/` ile izlenen dosyaların canlıdaki karşılığı değişmişse güncellenir. Canlıda olup depoda izlenmeyen yeni dosyalar "Yeni canlı dosya (elle karar ver): …" olarak raporlanır, kopyalanmaz. Böylece yeni müşteri dosyaları kamuya açık depoya otomatik eklenemiyor.

2. **Korunan dosya listesi.** `config/senkron-korunan.txt` dosyasında listelenen depo yolları asla ezilmez. Canlıyla farklıysa "Korunan dosya farklı (elle birleştir): …" uyarısı verilir. Başlangıç korunanlar: `remotion/src/Root.tsx`, `remotion/src/Reels06.tsx`, `remotion/src/Reels07.tsx`, `docs/Kurgu Dersleri.md`.

3. **Gizlilik taraması.** Her kopya adayı gizlilik deseniyle taranır (mutlak kullanıcı yolu, API anahtar/token kalıpları, sk- anahtarları). Eşleşen kopyalanmaz, uyarı basılır. Kişiye özel ek desenler `$HOME/.config/kurgu-sistemi/gizli-desenler.txt` dosyasından okunur (her satır bir genişletilmiş regex; `#` yorum serbest). Bu dosya isteğe bağlıdır; yoksa uyarı basılır ama hata sayılmaz. Örnek desen dosyası `config/gizli-desenler.ornek.txt`'de bulunur.

4. **Kuru mod.** `./senkronla.sh --kuru` hiçbir şeyi yazmadan ne yapılacağını listeler.

5. **Mevcut bağ raporu korunuyor.** `bin/` ve `skills/` bağ durumu davranışı değişmedi.

## Bu farklar senkron sırasında korunmalıdır; `vendor/` upstream ve salt okunurdur.
