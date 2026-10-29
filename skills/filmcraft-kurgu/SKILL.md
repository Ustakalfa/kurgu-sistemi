---
name: filmcraft-kurgu
description: "Video kurgu, kesme, renk, ses, altyazı, grafik veya FilmCraft geçen her işte kullan."
---

> **TESLİM KURALI (kullanıcı, 2026-10-21):** Kurgu bitince DIŞA AKTARMA YOK. `file.saveAs` ile `.fcproj` kaydet, FilmCraft'ta açık bırak, kullanıcıya kontrol listesi ver. `export.quick` / `export.queue.*` yalnızca kullanıcı "al" derse. Doğrulama için `render_frame` kullan.


# FilmCraft kurgu

## Ekipteki yer

Gemini, `gemini-run video -d klasör` ile ham çekimi izler ve en iyi anları zaman kodlarıyla verir. Claude kurgu planını yapar. FilmCraft kesme, renk, ses, altyazı ve basit grafikleri işler. Remotion, `src/Reels07.tsx` ev stili ve `src/marka.ts` ile marka grafikleri, kelime kelime altyazı ve logo açılışını üretir. Son ürün `cikti/` klasörüne gider.

## Bağlantı

- **Penceresiz:** `.mcp.json` içindeki `filmcraft-headless` (`filmcraft-cli mcp`) otomatik işler için.
- **Canlı:** Kullanıcı izlerken önce `open -a FilmCraft --args --control 9876`; ardından `.mcp.json` içindeki `filmcraft` köprüsü (`mcp --bridge 127.0.0.1:9876`). `filmcraft-cli --help`, uygulama argümanını `filmcraft --control PORT` olarak doğrular.
- Satır satır adım dosyası için `python3 -I araclar/filmcraft-mcp.py ~/.local/bin/filmcraft-cli adimlar.txt`; her satır `araç_adı {json}`. Bu yardımcı penceresiz MCP açar. Komut ve parametrelerin tam kaynağı `araclar/filmcraft-komutlar.txt`.

## Test edilmiş sıra

`media_import {"paths":["/mutlak/yol.mp4"]}` → `command_run {"id":"file.newSequenceFromClip","params":{"items":[id]}}` → `command_run {"id":"timeline.razor","params":{"seconds":3.5}}` → `command_run {"id":"graphics.newText","params":{"text":"Başlık","position":[540,300]}}` → `render_frame {"seconds":3.5,"max_side":1080}` ile kare kontrolü → `command_run {"id":"export.quick","params":{"path":"/mutlak/yol/cikti/video.mp4","wait":true}}` → `command_run {"id":"file.saveAs","params":{"path":"/mutlak/yol/cikti/proje.fcproj"}}`. `id` değerini içe aktarma sonucundan al; `seconds` zaman takma adı CLI yardımında doğrulanmıştır.

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
| Dışa aktarım | `export.quick`; `export.presets.list` | `path`, `preset`, `wait:true` ile render alır; `query`, `category`, `format` ile preset arar. |

Her değişiklikten sonra `sequence_inspect` ile doğrula; kritik karelerde `render_frame` ile görsel kontrol yap. Dışa aktarılan dosyayı `ffprobe` ile kontrol et. Reels hedefi **1080×1920**. FilmCraft 0.10.0 alfa sürümüdür: hata halinde adımı tekrar etme, hatayı ve mevcut durumu Claude'a raporla. Komut uydurma; yalnızca `araclar/filmcraft-komutlar.txt` içindeki adları kullan.

## Kalite ve Sony FX30 (2026-10-21'de test edildi)
- **FX30 dosyaları açılıyor:** XAVC S-I (H.264 High 4:2:2 Intra 10-bit) ve XAVC HS (HEVC 4:2:2 10-bit) M4 donanım çözücüsüyle (VideoToolbox) çözülüyor. FilmCraft'ın kendi yazılım çözücüsü 4:2:2 10-bit desteklemiyor; bu yalnızca Mac'te çalışır.
- **S-Log3 çekimde:** önce Sony'nin resmi S-Log3→Rec.709 LUT'u `lut.import` ile alınır, `lumetri.setInputLut` ile klibe uygulanır; ardından Lumetri ile ince ayar.
- **Dışa aktarma kuralı:**
  - Arşiv/master: `export.quick {"preset":"Apple ProRes 422 HQ"}` → 10-bit 4:2:2, 4K'da ~290 Mbps.
  - YouTube/müşteri teslimi: `"High Quality 2160p 4K"` (H.264, ~59 Mbps) veya `"YouTube 2160p 4K Ultra HD"`.
  - Instagram Reels: sekans 1080×1920; `"Social Vertical 1080×1920"`. Instagram yeniden sıkıştırdığı için yüksek bit hızı yeterli, ProRes yüklenmez.
  - macOS'ta HEVC dışa aktarma 8-bit; 10-bit gerekiyorsa ProRes kullan.
- **Geçişler:** 115 geçiş var (Cross Dissolve, Dip to Black/White, Push, Cross Zoom, Light Leak, Glitch, Film Dissolve, Morph Cut…) → `sequence.applyVideoTransition` / `sequence.setTransition`.
- **Ses efekti (SFX):** `public/sfx/katalog.json`'daki dosyalar `media_import` ile alınıp `timeline.place {track:"A2"…, seconds}` ile istenen ana yerleştirilir; müzik altında konuşma için `essentialSound.generateDucking`.
- **Simge/ürün/tablo:** şeffaf PNG `graphics.newFromFile {path}` ile eklenir; tablo/infografik gerekiyorsa Remotion ya da HTML ile PNG/MOV (alfa) olarak üretilip içe alınır; basit kutu+yazı `graphics.newRectangle` + `graphics.newText` ile yapılır.
