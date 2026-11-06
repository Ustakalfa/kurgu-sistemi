# Değişiklik günlüğü

Tarihler değişikliğin uygulandığı andır; commit tarihleriyle eşleşmeyebilir.

---

## 2026-11-06 — Craft/ArtCraft revizyonu ve güvenlik güncellemesi

### Güvenlik düzeltmeleri
- **senkronla.sh yeniden yazıldı (kritik):** Artık yalnız `git ls-files remotion/` ile izlenen dosyalar güncellenir; canlıda olup depoda izlenmeyen yeni dosyalar "Yeni canlı dosya (elle karar ver): …" olarak raporlanır, kopyalanmaz. `config/senkron-korunan.txt` listesindeki dosyalar asla ezilmez; farklıysa "Korunan dosya farklı (elle birleştir): …" uyarısı verilir. Her kopya adayı gizlilik deseniyle taranır; eşleşen kopyalanmaz. `--kuru` seçeneği eklendi.
- **dogrula.sh güncellendi:** `liste()` işlevi git > rg > find sıralamasıyla çalışır; liste boş çıkarsa hata sayılır (sahte GEÇTİ önlenir). Gizlilik deseni genel (mutlak kullanıcı yolu, API anahtar, sk-) olarak depolandı; kişiye özel ek desenler `$HOME/.config/kurgu-sistemi/gizli-desenler.txt` dosyasından okunur. FilmCraft sürüm uyumsuzluğu hata yerine UYARI oldu. Beklenen sürüm tek değişkende (`beklenen_surum`).
- **config/senkron-korunan.txt oluşturuldu:** Korunan dosyalar: `remotion/src/Root.tsx`, `remotion/src/Reels06.tsx`, `remotion/src/Reels07.tsx`, `docs/Kurgu Dersleri.md`.
- **config/gizli-desenler.ornek.txt oluşturuldu:** Yalnız uydurma örnek desenler; gerçek ad yok.
- **$HOME/.config/kurgu-sistemi/gizli-desenler.txt oluşturuldu:** Depo dışı yerel gizlilik desenleri.

- **Korunan listeye depoda daha yeni olan üç dosya eklendi:** `remotion/package.json`, `remotion/package-lock.json`, `remotion/araclar/filmcraft-komutlar.txt` (canlı proje aynı sürüme gelince çıkarılabilir). Liste okuyucusu artık yol içindeki boşlukları korur.

### Belgeler
- README: Craft ailesi, kalite kapıları ve yapay zekâ araç kararları bölümleri; doğrulanmış depo adresi; anahtarlı canlı köprü (`filmcraft-ac`); MIT lisans ve üçüncü taraf notu; belge dizinine yeni sayfalar.
- KURULUM-CLAUDE.md ve docs/kurulum.md: Craft uygulamalarının ayrı kurulumu, `craft-ac`, PhotoCraft anahtarı, isteğe bağlı gizlilik desenleri.
- docs/craft-ailesi.md: güncel doğrulanmış sürümler.
- skills/HARITA.md: `sinema-kalitesi` kendi skill'ler bloğuna alındı.

### Kayıp değişiklikler geri kuruldu
- **remotion/araclar/filmcraft-komutlar.txt:** `filmcraft-cli commands` çıktısıyla yeniden üretildi (716 komut, FilmCraft 0.17.1).
- **remotion/package.json:** `@remotion/three 4.0.532`, `@remotion/lottie 4.0.532`, `three 0.187.0`, `@react-three/fiber 9.8.2`, `lottie-web 5.13.0` eklendi. `npm install --package-lock-only --ignore-scripts` ile lock güncellendi.
- **remotion/src/Root.tsx:** `KiyasI1`, `KiyasI2`, `KiyasI3`, `KiyasI4` ve `KIYAS_SURE` içe aktarıldı; her biri için `Composition` eklendi (3840×2160, 25 fps).
- **bin/filmcraft-kopru:** Canlıdaki sürümle eşleşmesi için 3. satıra örnek yorum eklendi.

### Belge revizyonu
- **README.md:** "yer tutucudur" cümlesi kaldırıldı, depo adresi https://github.com/Ustakalfa/kurgu-sistemi olarak düzeltildi. Craft ailesi Özellikler ve Nasıl çalışır bölümlerine eklendi. Kalite kapıları bölümü eklendi. Yapay zekâ araç kararları ve lisans notları eklendi. Belge haritası güncellendi.
- **docs/craft-ailesi.md:** Craft Uygulamaları Rehberi'nden genelleştirilerek güncel sürümler, PdfCraft ve Derin tur 3 bilgileri eklendi.
- **docs/kurallar.md:** Kalite kapıları ve araç kararları bölümleri eklendi; çekirdek kurgu/reklam ilkeleri eklendi; yeni kurallar tablosuna işlendi.
- **docs/Kurgu Dersleri.md:** vault'taki güncel dersler (2026-10-29 – 2026-11-06) genelleştirilerek eklendi; müşteri/kişi adı taşınmadı.
- **docs/surumler.md:** Doğrulama tarihi 2026-11-06 yapıldı; Craft CLI sürümleri güncellendi (tümü doğrulandı); Remotion ek paketleri eklendi.
- **docs/degisiklikler.md:** Bu dosya oluşturuldu (CHANGELOG).
- **docs/yerel-degisiklikler.md:** Yeni senkron davranışı (korunan liste, yeni dosyaların otomatik alınmaması, yerel gizli desen dosyası) eklendi.
- **skills/HARITA.md:** `sinema-kalitesi` satırı MIT skill'ler bloğuna taşındı.
- **KURULUM-CLAUDE.md ve docs/kurulum.md:** Craft uygulamalarının ayrıca kurulması gerektiği, `craft-ac` / `filmcraft-ac` kullanımı ve `gizli-desenler.txt` isteğe bağlılığı eklendi.

---

## 2026-10-31 / 2026-11-05 — Craft ailesi ve sinema kalitesi

- **Craft ailesi doğrulandı:** FilmCraft 0.17.1, EffectCraft 0.21.1, SoundCraft 0.17.1, PhotoCraft 0.20.2, VectorCraft 0.21.1, PdfCraft 0.18.2.
- **craft-ac başlatıcısı:** `bin/craft-ac` tüm Craft uygulamalarını tek komutla başlatır; kontrol anahtarı `$HOME/.config/<uygulama>/control-token` dosyasından okunur.
- **filmcraft-ac ve filmcraft-kopru:** `bin/filmcraft-ac` uygulamayı anahtarla açar; `bin/filmcraft-kopru` CLI'yı anahtarla çalıştırır.
- **sinema-kalitesi skill'i:** `skills/sinema-kalitesi/SKILL.md` araç seçimi matrisi, kalite kapıları ve ölçüm sınırlarıyla oluşturuldu.
- **craft-tarifler:** `sablonlar/craft-tarifler/` altında tüm Craft uygulamaları için tarif şablonları oluşturuldu.
- **Remotion 3D ve Lottie:** `@remotion/three`, `three`, `@react-three/fiber`, `@remotion/lottie`, `lottie-web` dependencies listesine eklendi.
- **Kıyas kompozisyonları:** `remotion/src/kiyas/Kiyas.tsx` dosyasına `KiyasI1`–`KiyasI4` bileşenleri ve `KIYAS_SURE` yazıldı.
- **docs/craft-ailesi.md:** Headless derin tur notları, SoundCraft/EffectCraft/VectorCraft/PhotoCraft test sonuçları ve birleşik hat belgelendi.

---

## 2026-10-29 — kurgu-ustasi güncellemeleri

- `kurgu-ustasi`: Zorunlu bilgi tabanı kartı (platform/reklam stratejisi kaynak havuzu) eklendi.
- `kurgu-ustasi`: Otonom çalışma kuralı (kullanıcı onayı gereken durumlar) belgelendi.

## 2026-10-28 — Mac'ler arası otomatik güncelleme

- `kurgu-guncelle` betiği ve `SessionStart` kancası eklendi.
- Çok Mac yapılandırması `docs/kurulum.md`'ye belgelendi.

## 2026-10-27 — filmcraft-kurgu güncellemeleri

- `skills/filmcraft-kurgu/SKILL.md`: Sekans baştan 4K, onay sonrası export `06-teslim/` kuralları eklendi; FilmCraft preset listesi belgelendi.

## 2026-10-26 — Çalışma düzeni ve kurgu-ekip

- `skills/kurgu-ekip/SKILL.md` oluşturuldu.
- `claude/CLAUDE.kurgu.md` bloğu ve `--claude-md/--hooks` seçenekleri eklendi.
- Doğrulama betikleri güncellendi.

## 2026-10-19 — İlk açık sürüm

- Depo oluşturuldu; gerçek iş ve müşteri bilgisi çıkarılıp temizlendi.
- Temel klasör yapısı, betikler ve alt modüller eklendi.
