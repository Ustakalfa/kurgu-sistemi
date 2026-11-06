# Craft ailesi: uygulamalı çalışma rehberi

31 Ekim 2026 tarihli headless denemelerinin kalıcı özeti. Girdiler sentetiktir; müşteri medyası yoktur. Kaynaklar iki uygulama notu, gerçek konuşmayla yapılan dış doğrulama ve tarif dosyalarıdır. Ses konusunda dış doğrulama ilk nottaki eksik sentetik konuşma denemesinin yerine geçer. Denemeler o tarihteki sürümlerle yapıldı (FilmCraft 0.15, SoundCraft 0.15, PhotoCraft 0.18, EffectCraft 0.19, VectorCraft 0.19). 6 Kasım 2026 itibarıyla doğrulanan sürümler: FilmCraft 0.17.1, EffectCraft 0.21.1, SoundCraft 0.17.1, PhotoCraft 0.20.2, VectorCraft 0.21.1, PdfCraft 0.18.2 ([Sürümler](surumler.md)); yeni sürümde komutları `<uygulama>-cli commands` ile yeniden doğrulayın. CLI konumları `~/.local/bin/{filmcraft,soundcraft,photocraft,effectcraft,vectorcraft}-cli`; PhotoCraft girdisi uygulama içindeki CLI'ye sembolik bağdır. Canlı köprüler `craft-ac` ile başlatıldığında beş uygulamada da test edildi.

## Kalıcılık ve çalışma düzeni

| Uygulama | Tek oturum | Devam ve kayıt |
|---|---|---|
| FilmCraft | `filmcraft-cli run hat.jsonl` | Sonda `file.save`/`file.saveAs`; ayrı komut durumu paylaşmaz. |
| SoundCraft | `soundcraft-cli script tarif-v2.jsonl --save miks.scraft` | `--in miks.scraft`; izlere kalıcı ID ile eriş. |
| PhotoCraft | `photocraft-cli run --new '{...}' --cmd ... --params '{...}' --out kapak.pcraft` | `run kapak.pcraft ... --out ...`; `batch` klasörde çoklu dosya işler. |
| EffectCraft | `effectcraft-cli --empty run --commands effectcraft-tarif.jsonl --save-as effectcraft-ana.ecproj --json` | `--project ... run --commands ... --save`; hata batch'i durdurur, kaydedilmemiş bellek gider. |
| VectorCraft | `vectorcraft-cli run --commands vectorcraft-tarif.jsonl` | `--in dosya.vectorcraft`; `file.saveAs`/`document.save` veya `--export`; sonuç kimliği `$N.id`/`$N.ids`. |

Tariflerin tümü [`sablonlar/craft-tarifler/`](../sablonlar/craft-tarifler/) altında, uygulama klasörlerine ayrılmıştır. Komutları girdilerin bulunduğu çalışma klasöründen çalıştırın. `hat.jsonl` içindeki `$GIRDI`/`$CIKTI` yer tutucuları çalıştırmadan önce gerçek yollara açılmalıdır; JSONL kabuk değişkeni açmaz. Tariflerdeki medya dosyaları bu depoda bulunmaz; sentetik girdiyi `test-medya-hazirla.sh` ve 4K test videosuyla oluşturun. Uygulama projeleri ve renderlar çalışma klasörüne yazılır.

## SoundCraft: konuşma ve müzik

`test-medya-hazirla.sh`, `say -v Yelda` ile Türkçe konuşma, 50 Hz uğultu, beyaz gürültü ve tıklama eklenmiş 48 kHz/24-bit WAV ile müzik yatağı üretir. macOS sandbox'ında `say` başarısız olmuş ve ilk denemede konuşmasız AIFF oluşmuştu; bu yüzden ilk `soundcraft-tarif.jsonl` miksine güvenilmez. Dış doğrulamada gerçek 31,6 sn konuşma ile `tarif-v2.jsonl` çalıştırıldı. Başlangıçta sessiz bir ölçüm aralığı bırakılmadığı için konuşma öncesi gürültü tabanı ölçülemedi.

| Test edilmiş komut | Örnek parametre | Gözlem |
|---|---|---|
| `session.new`, `file.import_audio`, `file.import_video` | `{"sample_rate":48000,"bit_depth":24}`, `{"path":"konusma-kirli.wav"}`, `{"path":"test4k.mp4"}` | İçe aktarmada konuşma ID 2, müzik 5; video ses izi 8, video izi 11. ID'yi her işte yeniden kontrol et. |
| `track.rename`, `track.inspect`, `session.inspect` | `{"track":2,"name":"Konuşma"}`, `{"track":5}`, `{"detail":"full"}` | Ad ve otomasyon görüldü. |
| `mix.mute` | `{"tracks":[8],"value":true}` | Videonun ayrı ses izi sustu; `mute` anahtarı geçersiz. 440 Hz bandı yaklaşık −23'ten −31 dB'ye indi. |
| `mix.insert` EQ | `{"track":2,"slot":0,"plugin":"eq_1band","params":{"type":3,"freq":80}}`; slot 1: `{"type":5,"freq":50,"q":8}` | High pass ve notch çalıştı; 50 Hz uğultu bağıl olarak yalnız ~6 dB azaldı. |
| `mix.insert` dinamik | slot 2 `expander_gate` (−45/4/20/150), slot 3 `de_esser` (6500/−30/8), slot 4 `compressor` (−24/3/5/120/makeup 4), slot 5 `maximizer` (threshold −8, ceiling −1.2, release 60) | Varsayılan maximizer threshold 0 sesi yükseltmedi; −10 denemesi −12,2 LUFS ile hedefi aştı. |
| `mix.volume`, `automation.write_range` | `{"tracks":[5],"db":-6}`, `{"track":5,"param":"volume","start":0,"end":25,"value":-18}` | Konuşma altında müzik azaldı. |
| `file.bounce_mix`, `file.bounce_stems` | `{"path":"miks-v3.wav","format":"wav","bit_depth":24}`, `{"dir":"stemler-v3","format":"wav","bit_depth":24}` | Final miks ve ayrık stem üretildi. |

EQ tipleri: 0 Peak, 1 Low Shelf, 2 High Shelf, 3 High Pass, 4 Low Pass, 5 Notch, 6 Band Pass. Parametreler `freq`, `gain`, `q` (0,1–10), `output_gain`; `frequency` değil. `transport.locate` için `at` gerekir, `position` hata verir. `track.color` dize renk değil `[r,g,b]` veya palet indeksi alır. `session.audio_health`, `engine.plugins`, `engine.clap_plugins`, `engine.vst3_plugins`, `engine.history`, `transport.status` ve `transport.rtz` de çalıştı. Eklenti kataloğunda 30 eklenti vardı; denoise/spectral temizleme yoktur. Ağır geniş bant gürültüyü önce harici araçla temizleyin; ağır uğultuda ikinci HP ve `q:10` notch deneyin.

Dış doğrulama: v2 **−13,9 LUFS integrated**, **LRA 6,3**, **−2,8 dB peak**. İlk gerçek konuşmalı tarif −21,6 LUFS ve −7,9 dB sample peak verdi. Sandbox içindeki ilk notun −25,5 LUFS / loudnorm sonrası −16,4 LUFS ölçümü konuşmasız girdi nedeniyle prodüksiyon sonucu değildir. Ölçümü `ffmpeg -i miks-v3.wav -filter_complex ebur128=peak=true -f null -` ve `ffprobe` ile yineleyin; true peak ve sample peak ayrımını koruyun.

## EffectCraft: hareketli grafik

4K25/6 sn Rec.709 16 bpc yazılım render projesinde Türkçe başlık, position/scale/opacity keyframe, Easy Ease, `fadeUpCharacters`, Gaussian Blur, Glow, çizgi ve Trim Paths, Noise adjustment, precomp ve expression test edildi. `effect.list` 308 efekt döndürdü; CLI kataloğu 742 komuttur. Ana tariften sonra ek testleri aynı `.ecproj` ile çalıştırın. `file.import` SVG, PNG ve MP4'ü uyarısız aldı.

| Test edilmiş komut | Örnek parametre | Gözlem |
|---|---|---|
| `comp.new`, `layer.newText` | `{"width":3840,"height":2160,"frameRate":25,"duration":6}`; `{"text":"Çağrı Işığı Öğün Şükür İğne","size":210}` | Türkçe glyph ve tracking doğru. |
| `prop.addKey`, `keys.selectAll`, `keys.easyEase` | `{"path":"transform/position","time":1.2,"value":[1920,1060]}`, `{"which":"both"}` | Animasyon eğrisi çalıştı. |
| `layer.addMask`, `layer.mask.shape` | `{"shape":"rect","rect":[-1700,-320,3400,640]}` | Maske **layer-space**; ilk comp-space denemesi yazıyı kesti. |
| `effect.apply`, `prop.set`, `layer.applyTextPreset` | `{"effect":"Glow","layers":["TURKCE_BASLIK"]}`, `{"preset":"fadeUpCharacters"}` | Harf bazlı selector oluştu. |
| `layer.setTrackMatte`, `layer.setBlendMode` | `{"layer":"LT_YAZI","matte":"LT_MATTE","kind":"alpha"}`, `{"mode":"Screen"}` | Lower-third testinde çalıştı. |
| `file.exportLottie` | `{"comp":"ANA_4K25_6SN","textAsShapes":true,"includeExpressions":true}` | Çıktı var; Noise, Glow, adjustment yok; text animator statik bake edildi. |
| `renderQueue.add`, `renderQueue.render` | `{"format":"h264","channels":"rgb","bitrate":35000,"frameRate":25}`, `{"wait":true}` | 150 kare `Done`; aynı ayarlarla `setOutputModule` çağrısı “nothing to change” hatası verdi. |

`render-frame --comp ANA_4K25_6SN --time 1.5 --max-side 960` maske kusurunu yakaladı; düzeltme sonrası yeniden render edildi. Doğrulanan çıktılar: H.264 3840×2160/25 `yuv420p` 6 sn; opak ProRes 422 HQ `yuv422p10le` 6 sn; alfa ProRes 4444 `yuva444p12le` 6 sn; vektör köprüsü alfa MOV 3 sn. Kuyruk denemesi 105,785 sn, düzeltilmiş doğrudan render 150,48 sn sürdü; içerik farklı olduğu için performans kıyası yapılmaz. Doğrudan render tek çıktı, queue durum/log/batch için uygundur. Alfa kenarlarını açık ve koyu fonda kontrol edin.

## VectorCraft: rozet ve vektör

`vectorcraft-tarif.jsonl` 3840×2160 şeffaf artboard, üç duraklı degrade, kontur, ellipse/yıldız Pathfinder, Türkçe outline metin üretir. Katalog 885 komut; sonuç dosyası 69 nesneli glyph/path ağacı gösterdi.

| Test edilmiş komut | Örnek parametre | Gözlem |
|---|---|---|
| `file.new`, `shape.rectangle`, `paint.setFill` | `{"backgroundContents":"transparent"}`, `{"radius":220}`, `{"gradient":{"kind":"linear","dither":true}}` | 4K rozet. |
| `stroke.set` | `{"id":"$2.id","weight":18,"join":"round"}` | `stroke.setWidth` bilinmeyen komut. |
| `object.pathfinder.unite`, `minusFront` | `{"ids":["$7.id","$10.id"]}`, sonra `{"ids":["$13.ids.0","$14.id"]}` | Yeni geometri ID'siyle ilerlenir. |
| `text.create`, `type.createOutlines` | `{"text":"Çağrı Işığı Öğün Şükür İğne","size":150}`, `{}` | Türkçe doğru, outline sonrası metin düzenlenemez. |
| `document.export` | `{"format":"svg","svg":{"outlineText":true}}`; `{"format":"png","background":"transparent"}` | PNG 3840×2160 RGBA; SVG/PDF'de dither degrade raster image + clip oldu. |

Canlı metinli `.vectorcraft` kopyasını outline işleminden önce saklayın. Tam vektör SVG için dither kapatın; görsel eşleşme gerekirse şeffaf PNG de çıkarın. PDF 1.7 tek sayfa doğrulandı. EffectCraft SVG/PNG'yi içe alıp scale/opacity ve Screen blend ile animasyonladı.

## PhotoCraft: kapak ve batch

`photocraft-tarif.sh` 3840×2160 RGB 8-bit kapak oluşturur: degrade, gömülü 4K kare smart object, curves/vibrance, düzenlenebilir Türkçe başlık, dış stroke, drop shadow, unsharp mask, lens correction/vinyet. `photocraft-batch-adimlar.json` üç kareyi 1280×720'ye indirir. `--params` ilgili `--cmd` önündedir. JPEG kalitesi `--quality 90`; batch action biçimi `[id,params]` çiftidir.

| Test edilmiş komut | Örnek parametre | Gözlem |
|---|---|---|
| `layer.newFillLayer.gradient`, `file.placeEmbedded` | `{"from":"#101629","to":"#1e7e86","angle":25}`, `{"path":"kapak-kare.png","smartObject":true,"scale":85}` | Gömülü kare katman 7. |
| `layer.newAdjustmentLayer.curves`, `.vibrance` | `{"points":[[0,0],[128,140],[255,255]]}`, `{"vibrance":20,"saturation":5}` | Ayar katmanları oluştu. |
| `type.create`, `type.info`, `type.insertText` | `{"x":180,"y":950,"text":"ÇAĞRI IŞIĞI ÖĞÜN ŞÜKÜR İĞNE","size":170}` | Baz çizgisi x/y; Türkçe karakterler korundu, metin düzenlenebilir. |
| `layer.layerStyle.stroke`, `.dropShadow` | `{"size":8,"position":"outside"}`, `{"opacity":75,"distance":16,"size":28}` | Kontur ve gölge. |
| `filter.sharpen.unsharpMask`, `filter.lensCorrection` | `{"amount":80,"radius":1.5,"threshold":2}`, `{"vignetteAmount":-25,"vignetteMidpoint":55}` | Smart object üzerinde uygulandı. |
| `image.imageSize`, `batch` | `{"width":1280,"height":720,"resample":"lanczos"}` | Üç PNG üretildi. |

Levels, brightness/contrast, hue/saturation, color balance, photo filter, exposure, selective color, gradient map, undo/redo ve outer glow/inner shadow komutları da çalıştı. `.pcraft`, PSD, 4K PNG/JPEG ve 1280×720 PNG üretildi. Başlığın küçük boyutta okunurluğunu görsel kontrol edin.

## Birleşik hat ve kabul ölçümleri

1. VectorCraft'ta `.vectorcraft` kaynak, SVG ve şeffaf PNG üret. EffectCraft'a içe al; 4K25 Rec.709 comp'ta animasyonla ve alfa ProRes 4444 MOV çıkar.
2. FilmCraft'ta `file.newProject → file.import → file.newSequence` (3840×2160, 25 fps, 48 kHz) uygula. `timeline.place` ile kaynak MP4'ü V1'e `audio:false`, EffectCraft MOV'u V2'ye, vektör köprüsü MOV'u `track:"new"` ile V3'e, SoundCraft WAV'ı A1'e `duration:{"seconds":8}` ile yerleştir; `file.saveAs` ile bitir.
3. FilmCraft referans MP4 ve ayrı WAV stem'lerini SoundCraft'a ver. Video içinden açılan ses izini sustur, v2 zinciriyle bounce al, ölç. FilmCraft'a final WAV'ı zaman sıfırından koy. Kurguda dışa aktarım için mevcut onay kuralını uygula.
4. MP4'ten `ffmpeg -ss 2 -i test4k.mp4 -frames:v 1 kapak-kare.png` ile kare al; PhotoCraft kapağı ve batch varyantları üret.

Birleşik `hat.jsonl` tek run içinde başarıyla tamamlandı; 960×540 render-frame yaklaşık 0,7–0,85 sn sürdü. EffectCraft başlık/çizgi/alfa, VectorCraft rozet ve PhotoCraft Türkçe kapak görsel olarak doğrulandı. Son teslimde 4K çözünürlük, 25 fps, alfa pix_fmt, 48 kHz/24-bit WAV, LUFS ve peak ile karelerin görsel doğrulamasını yineleyin. Headless testlerde canlı bridge kullanılmadı.

## Derin tur 2 (31 Ekim 2026)

Başlatıcı: `craft-ac <film|effect|sound|photo|vector> [dosya]`. FilmCraft ve PhotoCraft kontrol anahtarı `$HOME/.config/.../control-token` altında tutulur; depoya yazılmaz.

| Uygulama | Port | Canlı bağlanma |
|---|---:|---|
| FilmCraft | 9876 | `filmcraft-kopru mcp --bridge 127.0.0.1:9876` |
| EffectCraft | 9877 | `effectcraft-cli mcp --bridge 9877` |
| SoundCraft | 7801 | `soundcraft-cli mcp --connect 7801` |
| PhotoCraft | 7878 | `photocraft-cli mcp --bridge 127.0.0.1:7878 --control-token-file "$HOME/.config/photocraft/control-token"` |
| VectorCraft | 7979 | `vectorcraft-cli mcp --connect 127.0.0.1:7979` |

| Durum | Ölçüm ve sınır |
|---|---|
| Güvenilir | Çok kamera ses senkronu 1,32 sn kaymayı 33 kareyle, 0 kare hatayla buldu. Yerel Whisper 35 sn Türkçe konuşmayı 13 sn'de, %1,7 kelime hatasıyla SRT'ye çevirdi; `captions.import` çalıştı. Ses temizliği gürültü tabanını −40,3 → −60,4 dB, konuşmayı −23,5 → −14,1 LUFS getirdi. PhotoCraft akıllı nesne ve metinle 3 kapak üretti. VectorCraft SVG adları korundu ve raster `<image>` oluşmadı. |
| Sınırlı | Renk orta alan piksel RGB farkı 21,4/18,6/24,3 → 7,9/3,0/10,5; <6 hedefi kırmızı/mavide tutmadı. EffectCraft kelime zamanlaması en çok 1 kare saptı ama yerleşim kötü; tek metin katmanı ve animator gerekir. 4K25 6 sn ProRes alfa render yaklaşık 107 sn. 3D paralaks çalıştı; advanced renderer bayrağı belirsiz. 40 efektin yalnız yaklaşık 12'sinde görünür etki doğrulandı. PhotoCraft seçim maskesinin doğruluğu ölçülmedi. |
| Kullanılamaz / güvenilmez | FilmCraft 0.15'te `transcript.generate` derlenmemiş. FilmCraft `masks.track` 2 sn'de yaklaşık 1670 px hata; EffectCraft nokta takibi 58–63 px hata. Key Light sentetik yeşil perdede alfa ayırmadı. `.ectemplate`, FilmCraft `.fcgt` içine doğrudan geçmiyor. Katmanlı SVG EffectCraft'a tek katman geliyor. |

Tarifler `sablonlar/craft-tarifler/` altında. Renk için kare/bölge piksel farkını ölç; ortalama renk eşitliği yeterli değil. Ses `ses/temizle.sh`, Türkçe altyazı `altyazi/whisper-srt.sh` ve ardından FilmCraft `captions.import` ile yapılır. SoundCraft `import_audio` yeni iz açar; `execute` parametresi `command` adını taşır. EffectCraft `layer.newText` varsayılan 72 px olduğundan 4K boyutunu açıkça belirt. VectorCraft yeni belge komutu `file.new`; örtülü pencerede ekran görüntüsü yerine `render_preview` kullan.

## Tur 3 (Kasım 2026)

Güncel araç seçimi ve kalite kapıları: [sinema-kalitesi matrisi](../skills/sinema-kalitesi/SKILL.md). FilmCraft 0.17.1, EffectCraft 0.21.1, SoundCraft 0.17.1, PhotoCraft 0.20.2, VectorCraft 0.21.1 ve PdfCraft 0.18.2 doğrulandı. DeepFilterNet Rust ikilisi 16-bit girdide gürültü tabanını −40,3 → −56,5 dB düşürdü; loudnorm sonrası −61,4 dB. SAM 2.1 kişi maskesinde başarılı, küçük nesnede başarısız. 33³ LUT piksel MAE R/G/B 2,4/2,0/2,4 ve ΔE2000 2,01 verdi; renk kapısı kıl payı kaldı. Remotion yazı ve shader için tercih edildi. ACE-Step sözsüz üretim kullanılabilir, Türkçe sözler anlaşılmadı. Magenta RT `--no-mlxfn` ile gerçek zamanda çalıştı; CC BY 4.0 atıf gerektirir. Kısa QC'de alfa saçağı ve tarama olayı kaldığı için tam sekans kontrolü zorunludur. Teslim export'u bu tariflerin kapsamında değildir.
