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
- **Canlı:** Önce `filmcraft-ac [proje.fcproj]` ile uygulamayı anahtarlı olarak 9876 portunda aç; MCP `filmcraft` kaydı `filmcraft-kopru mcp --bridge 127.0.0.1:9876` çalıştırır. FilmCraft 0.13+ canlı kontrol için uygulama ve CLI tarafında aynı `FILMCRAFT_CONTROL_TOKEN` anahtarını zorunlu kılar. Anahtar `~/.config/filmcraft/control-token` içinde izin 600 ile kalır; bu herkese açık depoya veya kasaya asla yazılmaz.
- Satır satır adım dosyası için `python3 -I araclar/filmcraft-mcp.py ~/.local/bin/filmcraft-cli adimlar.txt`; her satır `araç_adı {json}`. Bu yardımcı penceresiz MCP açar. Komut ve parametrelerin tam kaynağı `araclar/filmcraft-komutlar.txt`.

## Test edilmiş sıra

Önce `media_import {"paths":["/mutlak/yol.mp4"]}` ile medyayı içe aktar ve kaynak kare hızını içe aktarma sonucundan al. Ardından `command_run {"id":"file.newSequence","params":{"name":"sekans adı","width":2160,"height":3840,"fps":kaynak_fps,"sampleRate":48000,"video":3,"audio":3}}` ile dikey, ya da `width`: 3840 ve `height`: 2160 ile yatay sekansı **baştan 4K** oluştur. `filmcraft-cli describe file.newSequence` çıktısı bu komutta `name`, `width`, `height`, `fps`, `sampleRate`, `video`, `audio`, isteğe bağlı `mix`, `trackType`, `fromItem` ve `fromItems` parametrelerini doğrular; klipten sekans türeten `file.newSequenceFromClip` kullanılmaz. İçe aktarma sonucundaki `id` değerleriyle klipleri `command_run {"id":"timeline.place","params":{"items":[id],"track":"V1","audioTrack":"A1","seconds":0,"insert":false}}` üzerinden sekansa yerleştir; sonra `command_run {"id":"timeline.razor","params":{"seconds":3.5}}` ve gereken diğer kurgu adımlarını çalıştır. `render_frame` **MCP aracıdır**; renk düzenlemesinden önce ve sonra aynı zaman kodundaki kareyi onunla alarak karşılaştır. Kurgu kontrolü için `render_frame {"seconds":3.5,"max_side":1080}` kullan; ardından `command_run {"id":"file.saveAs","params":{"path":"/mutlak/is-klasoru/04-kurgu/proje.fcproj"}}` ile `.fcproj` dosyasını iş klasörünün `04-kurgu/` altına kaydet.

## Onay sonrası export

Bu bölüm yalnız kullanıcı “al” dedikten sonra uygulanır. Önce `command_run {"id":"export.presets.list","params":{"query":"2160p 4K"}}` çalıştırarak kullanılabilir 2160p veya 4K önayarını bul; `filmcraft-cli describe export.presets.list` çıktısı `query`, `category`, `format` ve `favorites` parametrelerini doğrular. Önayar bulunursa gerçek dönen önayar adını kullanarak `export.quick` çalıştır ve çıktıyı yalnız `/mutlak/is-klasoru/06-teslim/cikti.ext` yoluna yaz. Uygun önayar bulunamazsa `export.quick` için `--settings` ile dikeyde `2160x3840`, yatayda `3840x2160` çözünürlüğünü ver; önayar adı uydurma. İşlem bittiğinde `ffprobe` ile çıktı dosyasının çözünürlüğünü, süresini ve codec bilgisini doğrula.

## Komut seçkisi

| Alan | Komut | İş ve kritik parametreler |
|---|---|---|
| Kurgu | `timeline.razor` | Zamanda keser; `time` (tick), isteğe bağlı `track`, `clip`; CLI `seconds` kabul eder. |
| Kurgu | `timeline.delete` | `clips` listesini siler; `ripple:true` boşluğu kapatır. |
| Sekans | `sequence.setWorkArea`; `sequence.setWorkAreaIn`; `sequence.setWorkAreaOut` | Çalışma aralığını `start`, `end` tick değerleriyle ya da giriş/çıkış uçlarıyla ayarlar. |
| Sekans | `sequence.duplicateFrames` | Yinelenen kareleri listeler. |
| Altyazı | `captions.duplicate` | `captions` ve `delta` tick veya `deltaFrames` ile çoğaltır. |
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

Her değişiklikten sonra `sequence_inspect` ile doğrula; kritik karelerde `render_frame` ile görsel kontrol yap. Yalnız onaylı dışa aktarım sonrasında dosyayı `ffprobe` ile kontrol et. Reels sekansı baştan **2160×3840** kurulur. FilmCraft 0.17.1 alfa sürümüdür: hata halinde adımı tekrar etme, hatayı ve mevcut durumu Claude'a raporla. Komut uydurma; yalnızca `araclar/filmcraft-komutlar.txt` içindeki adları kullan.

Ayrı `filmcraft-cli` çağrıları arasında durum korunmaz: `--project p.fcproj import` tek başına projeyi kaydetmez. Çok adımlı işi tek `run script.jsonl` içinde yürüt ve sonuna `file.save` koy. Canlı MCP `ui_screenshot` yalnız `max_side` ve `panel` parametrelerini alır; `path` yoktur, görüntü base64 döner.

## Craft ailesi

Ayrıntılı araç matrisi ve kalite kapıları için `sinema-kalitesi` skill'ine bak.

Beş CLI kurulu: `~/.local/bin/filmcraft-cli` (0.17.1), `~/.local/bin/soundcraft-cli` (0.17.1), `~/.local/bin/effectcraft-cli` (0.21.1), `~/.local/bin/vectorcraft-cli` (0.21.1), `~/.local/bin/photocraft-cli` (PhotoCraft uygulamasına sembolik bağ, 0.20.2). Beş canlı köprü `craft-ac` ile doğrulandı. Uygulamalı tarifler `sablonlar/craft-tarifler/`, ayrıntılar `docs/craft-ailesi.md`.

| Uygulama | Durum ve kalıcı kayıt |
|---|---|
| FilmCraft | Çok adımı tek `run script.jsonl` içinde çalıştır; sonda `file.save` veya `file.saveAs`. Ayrı çağrı projeyi kendiliğinden kaydetmez. |
| SoundCraft | `script tarif-v2.jsonl --save miks.scraft`; sonraki çağrıda `--in miks.scraft`. İthal izlere kalıcı ID ile eriş. |
| PhotoCraft | `run --new ... --cmd ... --params ... --out kapak.pcraft`; sonraki `run kapak.pcraft ... --out ...`. `batch --actions ... --in ... --out ...`. |
| EffectCraft | `--empty run --commands ... --save-as proje.ecproj`; sonraki çağrı `--project proje.ecproj` ve `--save`/`--save-as`. Hatalı batch durur. |
| VectorCraft | `run --commands ...`; devam için `--in dosya.vectorcraft`, kayıt için `file.saveAs`/`document.save` veya `--export`. Adımlar `$N.id`/`$N.ids` kullanır. |

Kritik tuzaklar: (1) SoundCraft `mix.mute` parametresi `value:true`; videonun ayrı açılan ses izini sustur. (2) Maximizer varsayılan `threshold:0` kazanç sağlamaz; testte `-8` hedefi tuttu. (3) `eq_1band` tipi sayıdır: 0 Peak, 1 Low Shelf, 2 High Shelf, 3 High Pass, 4 Low Pass, 5 Notch, 6 Band Pass; `freq`/`q` kullan. (4) SoundCraft iz sıra numarasını değil kalıcı ID'yi kullan. (5) EffectCraft maske koordinatı layer-space; `render-frame` ile bak. (6) Lottie, Noise/Glow/adjustment'ı atlar ve text animator'ı bake eder. (7) VectorCraft `dither:true` degrade SVG/PDF'de rasterlaşır. (8) Pathfinder sonrası yeni `$N.ids` ile devam et; `stroke.set {weight:...}` kullan. (9) FilmCraft `timeline.place` için video `audio:false` kaynak sesini engeller. (10) `track:"new"` yeni V3 açar; alfa MOV'u V2/V3, final WAV'ı A1'e koy.

Hat sırası: VectorCraft SVG/PNG → EffectCraft alfa ProRes 4444 → FilmCraft üst video izleri; FilmCraft referans MP4/WAV → SoundCraft 48 kHz/24-bit miks → FilmCraft A1; FilmCraft karesi → PhotoCraft kapak. Birleşik testte 3840×2160/25 fps, alfa kompozit ve Türkçe karakterler doğrulandı. Üretim işinde bu bölümün dışa aktarım onayı kuralını koru.


| Canlı mod | Başlatma | Bağlanma |
|---|---|---|
| FilmCraft 9876 | `craft-ac film [dosya]` | `filmcraft-kopru mcp --bridge 127.0.0.1:9876` |
| EffectCraft 9877 | `craft-ac effect [dosya]` | `effectcraft-cli mcp --bridge 9877` |
| SoundCraft 7801 | `craft-ac sound [dosya]` | `soundcraft-cli mcp --connect 7801` |
| PhotoCraft 7878 | `craft-ac photo [dosya]` | `photocraft-cli mcp --bridge 127.0.0.1:7878 --control-token-file "$HOME/.config/photocraft/control-token"` |
| VectorCraft 7979 | `craft-ac vector [dosya]` | `vectorcraft-cli mcp --connect 127.0.0.1:7979` |

Türkçe altyazı: `sablonlar/craft-tarifler/altyazi/whisper-srt.sh` ile SRT üret, sonra FilmCraft `captions.import` uygula. Bu derlemede `transcript.generate` yok. Rengi ortalamayla değil aynı karedeki bölge/piksel farkıyla ölç; düzeltilmiş orta alanda RGB mutlak fark 7,9/3,0/10,5 ve hedef <6 hâlâ karşılanmadı. Ses için `ses/temizle.sh` kullan; ölçülen gürültü tabanı −40,3 → −60,4 dB. FilmCraft maske takibi güvenilmez (yaklaşık 1670 px hata); EffectCraft nokta takibi de 58–63 px saptı. EffectCraft 4K25 6 sn ProRes 4444 render yaklaşık 107 sn sürer; zamanı planla.

## Kalite ve Sony FX30 (2026-10-21'de test edildi)
- **FX30 dosyaları açılıyor:** XAVC S-I (H.264 High 4:2:2 Intra 10-bit) ve XAVC HS (HEVC 4:2:2 10-bit) M4 donanım çözücüsüyle (VideoToolbox) çözülüyor. FilmCraft'ın kendi yazılım çözücüsü 4:2:2 10-bit desteklemiyor; bu yalnızca Mac'te çalışır.
- **S-Log3 çekimde:** önce Sony'nin resmi S-Log3→Rec.709 LUT'u `lut.import` ile alınır, `lumetri.setInputLut` ile klibe uygulanır; ardından Lumetri ile ince ayar.
- **Dışa aktarma kuralı:** Yalnız kullanıcı “al” dedikten sonra, yukarıdaki **Onay sonrası export** sırasını uygula; önayar adını tahmin etme ve çıktıyı iş klasörünün `06-teslim/` altına yaz. Dikey video için 2160×3840, yatay video için 3840×2160 kullan; işlem sonunda çözünürlük, süre ve codec bilgisini `ffprobe` ile doğrula. macOS'ta HEVC dışa aktarma 8-bit olduğundan 10-bit gerekliyse kullanılabilir önayarlar arasından uygun ProRes seçeneğini ara.
- **Geçişler:** 115 geçiş var (Cross Dissolve, Dip to Black/White, Push, Cross Zoom, Light Leak, Glitch, Film Dissolve, Morph Cut…) → `sequence.applyVideoTransition` / `sequence.setTransition`.
- **Ses efekti (SFX):** `public/sfx/katalog.json`'daki dosyalar `media_import` ile alınıp `timeline.place {track:"A2"…, seconds}` ile istenen ana yerleştirilir; müzik altında konuşma için `essentialSound.generateDucking`.
- **Simge/ürün/tablo:** şeffaf PNG `graphics.newFromFile {path}` ile eklenir; tablo/infografik gerekiyorsa Remotion ya da HTML ile PNG/MOV (alfa) olarak üretilip içe alınır; basit kutu+yazı `graphics.newRectangle` + `graphics.newText` ile yapılır.
