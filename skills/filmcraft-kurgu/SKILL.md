---
name: filmcraft-kurgu
description: "Video kurgu, kesme, renk, ses, altyazı, grafik veya FilmCraft geçen her işte kullan."
---

> **ZORUNLU KURALLAR:** Sekans baştan 4K (dikey 2160×3840, yatay 3840×2160); HD render yok, Remotion renderında `--scale=2`. Her videoda ölçümlü renk düzenleme ve önce/sonra kontrolü. Kurgu bitince export yok: `.fcproj` kaydet, FilmCraft'ta açık bırak, kullanıcı kontrol listesi ver; 4K export yalnız “al” onayından sonra. Ham video izleme her zaman Gemini (`gemini-run video`). Uygulama işlerini `kurgu-ekip` skill'iyle Codex'e devret; canlı FilmCraft MCP'yi Claude yönetir.


> **TESLİM KURALI (kullanıcı, 2026-10-21):** Kurgu bitince DIŞA AKTARMA YOK. `file.saveAs` ile `.fcproj` kaydet, FilmCraft'ta açık bırak, kullanıcıya kontrol listesi ver. `export.quick` / `export.queue.*` yalnızca kullanıcı "al" derse. Doğrulama için `render_frame` kullan.


# FilmCraft kurgu

## Ekipteki yer

Gemini, `gemini-run video -d klasör` ile ham çekimi izler ve en iyi anları zaman kodlarıyla verir. Claude kurgu planını yapar. FilmCraft kesme, renk, ses, altyazı ve basit grafikleri işler. Remotion, `src/Reels07.tsx` ev stili ve `src/marka.ts` ile marka grafikleri, kelime kelime altyazı ve logo açılışını üretir. Teslim `.fcproj` dosyasıdır; onaydan sonra 4K çıktı alınır.

## Remotion proje yolu

Önce `REMOTION_PROJE` ortam değişkenini kullan. Yoksa ve mevcutsa kullanıcının belirlediği mevcut Remotion projesini kullan. O da yoksa `KURGU_SISTEMI_KOK/remotion` veya bu skill sembolik bağının gerçek yolundan bulunan depo kökündeki `remotion/` klasörünü kullan.

## Bağlantı

- **Penceresiz:** `.mcp.json` içindeki `filmcraft-headless` (`filmcraft-cli mcp`) otomatik işler için.
- **Canlı:** Kullanıcı izlerken önce `open -a FilmCraft --args --control 9876`; ardından `.mcp.json` içindeki `filmcraft` köprüsü (`mcp --bridge 127.0.0.1:9876`). `filmcraft-cli --help`, uygulama argümanını `filmcraft --control PORT` olarak doğrular.
- Satır satır adım dosyası için `python3 -I araclar/filmcraft-mcp.py ~/.local/bin/filmcraft-cli adimlar.txt`; her satır `araç_adı {json}`. Bu yardımcı penceresiz MCP açar. Komut ve parametrelerin tam kaynağı `araclar/filmcraft-komutlar.txt`.

## Test edilmiş sıra

Önce `media_import {"paths":["/mutlak/yol.mp4"]}` ile medyayı içe aktar ve kaynak kare hızını içe aktarma sonucundan al. Ardından `command_run {"id":"file.newSequence","params":{"name":"sekans adı","width":2160,"height":3840,"fps":kaynak_fps,"sampleRate":48000,"video":3,"audio":3}}` ile dikey, ya da `width`: 3840 ve `height`: 2160 ile yatay sekansı **baştan 4K** oluştur. `filmcraft-cli describe file.newSequence` çıktısı bu komutta `name`, `width`, `height`, `fps`, `sampleRate`, `video`, `audio`, isteğe bağlı `mix`, `trackType`, `fromItem` ve `fromItems` parametrelerini doğrular; klipten sekans türeten `file.newSequenceFromClip` kullanılmaz. İçe aktarma sonucundaki `id` değerleriyle klipleri `command_run {"id":"timeline.place","params":{"items":[id],"track":"V1","audioTrack":"A1","seconds":0,"insert":false}}` üzerinden sekansa yerleştir; sonra `command_run {"id":"timeline.razor","params":{"seconds":3.5}}` ve gereken diğer kurgu adımlarını çalıştır. `render_frame` **MCP aracıdır**; renk düzenlemesinden önce ve sonra aynı zaman kodundaki kareyi onunla alarak karşılaştır. Kurgu kontrolü için `render_frame {"seconds":3.5,"max_side":1080}` kullan; ardından `command_run {"id":"file.saveAs","params":{"path":"/mutlak/is-klasoru/04-kurgu/proje.fcproj"}}` ile `.fcproj` dosyasını iş klasörünün `04-kurgu/` altına kaydet.

## Onay sonrası export

Bu bölüm yalnız kullanıcı “al” dedikten sonra uygulanır. Önce `command_run {"id":"export.presets.list","params":{"query":"2160p 4K"}}` çalıştırarak kullanılabilir 2160p veya 4K önayarını bul; `filmcraft-cli describe export.presets.list` çıktısı `query`, `category`, `format` ve `favorites` parametrelerini doğrular. Önayar bulunursa gerçek dönen önayar adını kullanarak `export.quick` çalıştır ve çıktıyı yalnız `/mutlak/is-klasoru/06-teslim/cikti.ext` yoluna yaz. Uygun önayar bulunamazsa `export.quick` için `--settings` ile dikeyde `2160x3840`, yatayda `3840x2160` çözünürlüğünü ver; önayar adı uydurma. İşlem bittiğinde `ffprobe` ile çıktı dosyasının çözünürlüğünü, süresini ve codec bilgisini doğrula.

## Komut seçkisi

| Alan | Komut | İş ve kritik parametreler |
|---|---|---|
| Kurgu | `timeline.razor` | Zamanda keser; `time` (tick), isteğe bağlı `track`, `clip`; CLI `seconds` kabul eder. |
| Kurgu | `timeline.trim`; `edit.rippleDelete` | Klip kenarını düzeltir (`clip`, `edge`, `mode`, `deltaFrames`); seçilen klibi boşluğu kapatarak siler (`clips`). |
| Grafik | `graphics.newText`; `graphics.newShape` | Metin (`text`, `position`, `size`, `seconds`) veya şekil (`shape`, `position`, `size`) ekler. |
| Grafik | `graphics.align`; `graphics.template.apply` | Katman hizalar (`clip`, `layers`, `align`, `to`) veya şablon uygular (`template`, `values`, `time`). |
| Altyazı | `captions.add`; `captions.setStyle` | Altyazı ekler (`text`, `seconds`, `durationSeconds`) ve görünümünü ayarlar (`track`, `font`, `size`, `margin`). |
| Transkript | `transcript.generate`; `transcript.removeFillers`; `transcript.removePauses`; `transcript.createCaptions` | Whisper transkripti üretir (`items`, `model`, `language`), dolgu sözlerini (`fillers`) ve duraklamaları (`minSeconds`, `keepSeconds`) temizler, altyazı üretir (`maxChars`, `lines`). Listede `language` yalnızca `en|auto`; Türkçe `tr` doğrulanmadı, `auto` kullanıp sonucu kontrol et. |
| Renk | `lumetri.applyPreset`; `lumetri.setInputLut`; `lut.import` | Hazır renk görünümü (`name`, `clips`) veya LUT (`clip`, `lut` / içe aktarmada `path`) uygular. |
| Ses | `essentialSound.generateDucking`; `essentialSound.autoMatch` | `clips` için konuşma altında müziği kısar veya ses düzeyini `target` LUFS'ye eşler. |
| Maske | `masks.track` | Maskeyi izler; `clip`, `mask`, `direction`, `frames`, `method`, `wait`. |
| Anlatım | `tts.create` | Sesli anlatım ekler; `text`, `voice`, `pace`, `time`, `track`. |
| Efekt | `effects.setParam`; `effects.setInterpolation` | `clip`, `effect`, `param`, `value`, `time`, `keyframe:true` ile animasyon; `mediaTime`, `interpolation` ile geçiş ayarı. |
| Dışa aktarım | `export.quick`; `export.presets.list` | Yalnız kullanıcı “al” dedikten sonra kullanılır; önce `query`, `category`, `format`, `favorites` ile önayar aranır, sonra gerçek önayar adıyla `path`, `preset`, `wait:true` kullanılır. |

Her değişiklikten sonra `sequence_inspect` ile doğrula; kritik karelerde `render_frame` ile görsel kontrol yap. Yalnız onaylı dışa aktarım sonrasında dosyayı `ffprobe` ile kontrol et. Reels sekansı baştan **2160×3840** kurulur. FilmCraft 0.10.0 alfa sürümüdür: hata halinde adımı tekrar etme, hatayı ve mevcut durumu Claude'a raporla. Komut uydurma; yalnızca `araclar/filmcraft-komutlar.txt` içindeki adları kullan.

## Kalite ve Sony FX30 (2026-10-21'de test edildi)
- **FX30 dosyaları açılıyor:** XAVC S-I (H.264 High 4:2:2 Intra 10-bit) ve XAVC HS (HEVC 4:2:2 10-bit) M4 donanım çözücüsüyle (VideoToolbox) çözülüyor. FilmCraft'ın kendi yazılım çözücüsü 4:2:2 10-bit desteklemiyor; bu yalnızca Mac'te çalışır.
- **S-Log3 çekimde:** önce Sony'nin resmi S-Log3→Rec.709 LUT'u `lut.import` ile alınır, `lumetri.setInputLut` ile klibe uygulanır; ardından Lumetri ile ince ayar.
- **Dışa aktarma kuralı:** Yalnız kullanıcı “al” dedikten sonra, yukarıdaki **Onay sonrası export** sırasını uygula; önayar adını tahmin etme ve çıktıyı iş klasörünün `06-teslim/` altına yaz. Dikey video için 2160×3840, yatay video için 3840×2160 kullan; işlem sonunda çözünürlük, süre ve codec bilgisini `ffprobe` ile doğrula. macOS'ta HEVC dışa aktarma 8-bit olduğundan 10-bit gerekliyse kullanılabilir önayarlar arasından uygun ProRes seçeneğini ara.
- **Geçişler:** 115 geçiş var (Cross Dissolve, Dip to Black/White, Push, Cross Zoom, Light Leak, Glitch, Film Dissolve, Morph Cut…) → `sequence.applyVideoTransition` / `sequence.setTransition`.
- **Ses efekti (SFX):** `public/sfx/katalog.json`'daki dosyalar `media_import` ile alınıp `timeline.place {track:"A2"…, seconds}` ile istenen ana yerleştirilir; müzik altında konuşma için `essentialSound.generateDucking`.
- **Simge/ürün/tablo:** şeffaf PNG `graphics.newFromFile {path}` ile eklenir; tablo/infografik gerekiyorsa Remotion ya da HTML ile PNG/MOV (alfa) olarak üretilip içe alınır; basit kutu+yazı `graphics.newRectangle` + `graphics.newText` ile yapılır.
