---
name: kurgu-ustasi
description: 'Her video kurgu işinde (kişisel veya müşteri, yatay veya dikey) kurgu planı yapmadan önce kullan.'
---

> **ZORUNLU KURALLAR:** Sekans baştan 4K (dikey 2160×3840, yatay 3840×2160); HD render yok, Remotion renderında `--scale=2`. Her videoda ölçümlü renk düzenleme ve önce/sonra kontrolü. Kurgu bitince export yok: `.fcproj` kaydet, FilmCraft'ta açık bırak, kullanıcı kontrol listesi ver; 4K export yalnız “al” onayından sonra. Ham video izleme her zaman Gemini (`gemini-run video`). Uygulama işlerini `kurgu-ekip` skill'iyle Codex'e devret; canlı FilmCraft MCP'yi Claude yönetir.


# Kurgu ustası

**TESLİM KURALI — kullanıcı kararı, 2026-10-21: Kurgu bitince DIŞA AKTARMA YOK. `file.saveAs` ile `.fcproj` kaydet, FilmCraft'ta açık bırak, kullanıcıya kontrol listesi ve “kontrol et” notu ver. `export.quick` / `export.queue.*` yalnız kullanıcı “oldu/al” derse; kullanıcı isterse çıktıyı kendisi alır.**


**ÇEKİM KONTROLÜ:** Kurgu planından önce aktarılan çekim klasöründe `cekim-kontrol <klasör>` çalıştır (salt okunur; ffmpeg ile codec/fps tutarlılığı, ses kırpılma/sessiz kanal, siyah/donmuş kare, pozlama; rapor `<klasör>/cekim-kontrol.md`). Görsel değerlendirme gerekirse `--gemini` (kotalı). Rapordaki ❌/⚠️ ve "Kurguda dikkat" maddelerini plana kat.

**ÖĞRENME DÖNGÜSÜ:** Kurgu planından önce ve yeni ders eklerken aynı kaynağı kullan: önce `KURGU_DERSLERI` ortam değişkeninin gösterdiği dosya; yoksa ve varsa `$HOME/Documents/Yeni Beyin/wiki/kavramlar/Kurgu Dersleri.md`; o da yoksa deponun `docs/Kurgu Dersleri.md` dosyası. Depo kökünü `KURGU_SISTEMI_KOK` ile veya bu skill'in sembolik bağını gerçek yola çözerek bul (`realpath skills/kurgu-ustasi/SKILL.md` yolundan iki üst dizin). Notu tarihli “not → kural” biçiminde seçilen dosyaya ekle.

**İŞ KLASÖRÜ:** Müşteri/iş kurgusuna başlamadan `~/Movies/Isler/<tarih>_<musteri>_<is>/` içindeki `00-brief/brief.md` ve `05-revizyon/revizyonlar.md` okunur (klasör yoksa `yeni-is "<müşteri>" "<iş>" [--format 9x16|16x9|ikisi]` ile açılır; `.fcproj` → `04-kurgu/`).
**MÜŞTERİ NOTLARI:** Müşteriye özel beğeni/itirazlar özel alanda tutulur; herkese açık `Kurgu Dersleri.md` dosyasına yalnız kişisel bilgisi çıkarılmış tarihli genel ders yazılır.

Detay ve kaynaklar: `wiki/kavramlar/Kurgu Ustalığı Rehberi.md`.

## İşe başlamadan sor

Format/oran (9:16 mı 16:9 mu), platform, hedef süre, amaç/tek mesaj, kitle, marka sesi ve CTA nedir? Ham görüntü, röportaj, müzik hakları, rıza ve teslim briefi hazır mı? Kişisel iş mi, müşteri/ayrı marka mı? Kişisel içerikte samimi ve doğrudan; B2B'de ölçülü; Ayrı markalarda briefteki tonu, doğrulanmış kaynakları ve ayrı kimliği koru.

## Tür reçetesi

| Tür | Süre | Ritim ve yapı | Müzik / geçiş |
|---|---|---|---|
| Reels/TikTok | Briefteki kısa süre | İlk kare kanca → vaat → değer/kanıt → tek CTA | Ses altı müzik; düz/jump cut |
| YouTube uzun | Konu kadar | Açılış vaadi → bölümler → sonuç; nefes bırak | Konuşma öncelikli; bölümde ölçülü geçiş |
| Reklam/tanıtım | 15/30/60 sn | Tek fikir → his/kanıt → marka/CTA | Marka hissi; düz veya match cut |
| Kurumsal tanıtım | Brief | Sorun → yaklaşım → gerçek iş → sonuç | Ölçülü; ses köprüsü |
| Etkinlik aftermovie | Brief | Mekân → hazırlık → zirve → tepki | Enerji dalgası; vuruşta kes |
| Ürün videosu | Brief/platform | İhtiyaç → kullanım → his → CTA | Ürün tonu; hareket eşleşmesi |
| Röportaj/testimonial | Hikâye kadar | Sorun → deneyim → somut değişim | Konuşma önde; J/L cut, cutaway |
| Gayrimenkul/mekân | Brief/platform | Dış bağlam → giriş → alanlar → kapanış | Yönü koruyan düz/match cut |
| Düğün/özel gün | Brief | Hazırlık → karşılaşma → zirve → kutlama | Gerçek ses; seçici yumuşak geçiş |

Süreyi performans garantisi sayma; brief ve platforma uyarla.

## Dikey 9:16 kural kartı

- İlk 0–3 saniyede kanca; hemen ardından vaat. Selam ve uzun logo açılışıyla gecikme.
- Görsel değişimi anlam için yap. Notlardaki 2–3 saniye, 0,3 saniye sessizlik, 10–15 saniye yeniden kanca eşikleri **genel uygulama**; nefes ve sakin anlatı için esnet.
- Doğru Türkçe altyazı; yüz, yazı ve CTA için arayüz güvenli alanını platform önizlemesinde doğrula.
- 16:9'dan 9:16'ya kör kırpma yapma; master'ı çoğalt, özneyi yeniden çerçevele. Müzik vuruşu ve tek CTA anlamı desteklesin.
- Mevcut Reels ev stili: Remotion `src/Reels07.tsx` + `src/marka.ts`. Müşteri markasını başka marka görselleriyle karıştırma.

## Yatay 16:9 kural kartı

- Röportajda önce **radio edit**: yalnız sesle anlaşılır hikâye. Akış: selects → kaba → grafik → ince → ses → renk.
- B-roll kilit cümleyi görselleştirsin, kesimi örtsün veya sonraki fikri ima etsin. Röportaj kesimini jest/vurgulu söze oturt.
- Açılış filmin stilini ilan etsin; karakterin doğal anlarına nefes bırak. Farklı çekimleri renkçe eşleştir.

## Ses, renk, geçiş

- Diyalog > müzik > SFX. Önce temiz konuşma; ducking'i elle dinle. Whoosh zirvesi kesimde, riser kesimden önce bitsin. Anlamlı sessizliği koru. Reels/YouTube ses seviyesi hedefleri **genel uygulama**dır; brief ve güncel platform şartını kontrol et.
- FX30 S-Log3: Sony resmî dönüşüm LUT'u → pozlama/beyaz dengesi/ten tonu birincil düzeltme → look. Kurgu kilitlenmeden grade yapma.
- Düz kesim varsayılan. Zaman/mekân/duygu gerektirirse geçiş. **Efekt hikâyeye hizmet etmiyorsa kullanma.**

## FilmCraft komut karşılıkları

| İş | Komut |
|---|---|
| İçe al / kes / kırp / boşluk kapat | `media_import`; `timeline.razor`; `timeline.trim`; `edit.rippleDelete` |
| Duraklama / dolgu / altyazı | `transcript.removePauses`; `transcript.removeFillers`; `transcript.createCaptions`; `captions.add`; `captions.setStyle` |
| Metin / grafik | `graphics.newText`; `graphics.newShape`; `graphics.template.apply` |
| Ses | `essentialSound.generateDucking`; `essentialSound.autoMatch` |
| S-Log3 ve look | `lut.import`; `lumetri.setInputLut`; `lumetri.applyPreset` |
| Geçiş / animasyon | `sequence.applyVideoTransition`; `sequence.setTransition`; `effects.setParam` |
| Doğrula / kaydet | `sequence_inspect`; `render_frame`; `file.saveAs` |

Komut ve parametreleri uygulamadan önce FilmCraft komut kaynağından doğrula. Türkçe transkript sonucunu elle kontrol et. Her önemli değişiklikten sonra `sequence_inspect`, kritik karelerde `render_frame`; son adım `.fcproj` kaydı ve kullanıcıya **“kontrol et”** notu.

## Çok kameralı eşitleme ("biri yaz biri kış olmasın") — 2026-10-21 test edildi
1. **Zaman/ses senkronu:** `clip.createMulticam {"items":[...],"method":"audio","name":"..."}` — ses dalgası eşleştirmesi. Testte 2,30 sn kayma tam bulundu (`lagSamples` 110400 @48 kHz, `reliable: true`). Sonuçta `reliable:false` ya da düşük `confidence` gelirse: timecode (`method:"timecode"`), alkış/klaket işareti (`method:"marker"`) veya giriş noktası (`in`) ile dene; yine olmazsa kullanıcıya söyle. Ayrı ses kaydı (yaka/recorder) varsa referans o olur.
2. **Kamera kesimi:** `multicam.cutToCamera {camera, time}`; ses `multicam.editCameras {"audio":"camera1|all|switch"}` ile en temiz kaynaktan.
3. **Renk eşitleme:** Önce her kamerada birincil düzeltme (S-Log3 → resmi LUT, beyaz dengesi, pozlama). Sonra en iyi ışıklı açı (A-kam) referans: `lumetri.applyMatch {"clip":id,"referenceTime":ticks,"faceDetection":true}` (insan varsa yüz algılama açık). Testte renk farkı 0,083 → 0,020 (~%75 yakınlaşma). Ardından birkaç karede `render_frame` ile yan yana kontrol, gerekirse Lumetri ile ince ayar. Look/grade en son, eşitlenmiş görüntü üzerine.
4. **Ses seviyesi eşitleme:** `essentialSound.autoMatch {"clips":[...],"target":lufs}`; konuşma altı müzik `essentialSound.generateDucking`.
5. **Çekim önerisi (müşteriye/ekibe):** kameralarda aynı beyaz dengesi (Kelvin), kare hızı, enstantane ve picture profile; başta renk kartı + alkış; mümkünse ortak timecode.
