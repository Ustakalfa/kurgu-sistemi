---
name: sinema-kalitesi
description: Video, grafik, efekt veya müzik içeren her üretimde araç seçimi ve kalite kontrolü için kullan.
---
# Sinema kalitesi

4K (3840×2160 veya dikey 2160×3840), 25 fps, 48 kHz. Teslim export'u yok; yalnız QC için kısa test aralığı. AI video kullanma.

## Hangi iş hangi araçta
| İş | Araç ve komut | Durum | Tuzak |
|---|---|---|---|
| Kesim | FilmCraft `timeline.razor`, PySceneDetect `detect-adaptive list-scenes` | GÜVENİLİR | Kesim tespiti 0 kare hata; karar görsel. |
| Renk | `renk/renk_lut.py` → FilmCraft `lut.import`, `lumetri.setInputLut` | SINIRLI | Yalnız çekime LUT; kanal ortalaması yerel farkı gizler. |
| Grafik/yazı | Remotion `npx remotion bundle` | GÜVENİLİR | EffectCraft uzun metni taşır; 4K'da 72 px küçük. |
| Işık/efekt shader | `@remotion/three` ThreeCanvas + ShaderMaterial | SINIRLI | EffectCraft ışık huzmesi çamurlu; video kareleriyle doğrula. |
| 3D | Remotion `@remotion/three` (TextGeometry, statik TTF) | GÜVENİLİR | Filmde kanıtlandı; değişken font olmaz, `--gl=angle`. EffectCraft 3D yedek. |
| Kişi maskesi | SAM 2.1 `maske/sam2_kisi.py` | GÜVENİLİR | Kişide temiz; küçük nesne/nokta takibinde KULLANMA. |
| Gürültü | `ses/temizle-dfn.sh` DeepFilterNet Rust | GÜVENİLİR | 24-bit girdi reddedilir; 16-bit'e çevir. |
| Altyazı | `whisper-cli -l tr -osrt` → `captions.import` | GÜVENİLİR | İlk sessizliği `silencedetect` ile hizala. |
| Müzik sözsüz üretim | ACE-Step `muzik/muzik-uret.sh ace` (uzun, yükselen yapı) veya Magenta RT `muzik/muzik-uret.sh magenta` (gerçek zamanlı, `--no-mlxfn`, CC BY 4.0 atıf) | SINIRLI | ACE `thinking=false`, ~24 GB tepe bellek. Kulak onayı şart. Türkçe ACE vokal KULLANMA. |
| Müzik hazır | Lisanslı kütüphane (Pixabay, Content ID kontrollü) | GÜVENİLİR | Kaynak ve lisansı kaydet. |
| Müzik uydurma | `muzik/music_fit.py` (librosa, vuruşa göre süre) | SINIRLI | Vuruş kesimi müzikal cümleyi bozabilir; kulakla kontrol. |
| Ses efekti | Lisanslı arşiv → SoundCraft `file.import_audio` | SINIRLI | Kaynak ve lisansı kaydet; içe alma yeni iz açar. |
| Miks | SoundCraft `script ... --save ...` → ffmpeg `loudnorm` | GÜVENİLİR | A1'de tek miks; stemler `.scraft` içinde. |
| Kapak | PhotoCraft `run ... --out ...` | SINIRLI | Küçük boyutta Türkçe başlığı kontrol et. |
| Vektör | VectorCraft `file.new`, `document.export` | GÜVENİLİR | SVG'de `dither:true` rasterlaşır. |
| Ağır çekim | RIFE kare aralama | SINIRLI | 50→100 kare ~14 sn; görsel kalite doğrulanmadı. |
| Büyütme | Real-ESRGAN durağan görsel | SINIRLI | Video için KULLANMA; kare ~3,7 dk. |
| Çok kamera | FilmCraft ses senkronu | GÜVENİLİR | 1,32 sn/33 kare kayma 0 kare hatayla bulundu. |

## Birleştirme ve format sözleşmesi
1. Kaynaklar `01-ham`, stem ve SoundCraft oturumu `02-ses`, grafik `03-grafik`, FilmCraft proje/LUT `04-kurgu`, ölçüm `05-kontrol` içinde. Müşteri medyasını depoya koyma.
2. FilmCraft'ta 4K25/48 kHz sekansı baştan kur; tek `run` ve sonda `file.save`. V1 çekim, V2/V3 çakışmayan grafik, A1 yalnız son miks. Kaynak sesi `audio:false` ile kapat.
3. Remotion/EffectCraft grafiği alfa ProRes 4444, çekim ProRes 422 HQ 4K25. Alfa kenarını açık ve koyu fonda kontrol et; açık fonda yaklaşık 35/255 saçak görüldü.
4. Revizyonda `media.replaceFootage`; etiket eski kalabilir, `media.status` ile gerçek yolu doğrula. LUT yalnız çekime, look bütün filme. Kart sırasında altyazı yok.
5. Sahne A son kare ≈ B ilk kare; geçiş tabakası oluştur. Ses 48 kHz/24-bit WAV; ayrı stemleri `.scraft` içinde tut. Teslim export'u üretme.

## Kalite kapıları
- Renk: aynı zaman ve bölgede piksel RGB MAE, en büyük fark ve piksel başına ΔE2000 ölç. Ölçülen LUT sonucu 2,4/2,0/2,4 ve ΔE 2,01; <2 hedefi kıl payı geçmedi. Ortalama Lab yeterli değil.
- Türkçe `ğ ı İ ş ö ü ç`; font, satır ve %200 kenar kontrolü. Vurucu cümle ≥2,5 sn ekranda.
- Güvenli alan: görünür metin/panel sınırını ölç; önceki alfa sınırında 648 taşan piksel vardı.
- Sahne son/ilk kareleri ve parlaklık eğrisini ölç; 0,5 sn'de 150→940 flaş, geçişi ≥1 sn'ye yay ve saf beyaza çıkarma.
- Tek kareye güvenme: her canvas sahnesinde giriş/orta/çıkış video karelerini ve temas tabakasını incele.
- Miks: −14 LUFS ve true peak ≤−1 dBTP; `ebur128=peak=true` ile ölç, sample peak ile karıştırma.
- Tam sekans: blackdetect/freezedetect ve kare gözden geçirme; kısa testteki 1 olay tam taramanın yerini tutmaz.

## Remotion ve Codex tuzakları
Canvas için `getContext('2d',{willReadFrequently:true})` + `useLayoutEffect`; GPU canvas tek karede doğru, videoda eski/boş kare verebilir. Fontu `staticFile` + `FontFace` + `delayRender` ile yükle; Three TextGeometry değişken fontu statikleştir ve TTFLoader sonucunu FontLoader.parse ile çevir. `public/` symlink bundle'a girmez; gerçek dosya koy. `<Img>` kullan. Alfa render `--image-format=png`, WebGL `--gl=angle`. Onaylı sahneleri bundle'dan render et. Codex sandbox Chrome/Metal işlerini çalıştıramayabilir; dış ortamda video karelerini doğrula. Yazma hedefi çalışma klasörü içinde olsun.

## Müzik karar akışı
Lisanslı uygun parça varsa önce onu seç, ritim ve cümleyi dinleyerek `music_fit.py` ile oturt. Özgün sözsüz gerekiyorsa hızlı taslak için Magenta RT (`--no-mlxfn`, atıf), daha özgül enerji eğrisi için ACE-Step (`thinking=false`, CPU offload) kullan. Türkçe sözlü ACE çıktısı anlaşılmadı; kullanma. Her seçimde lisans, süre, LUFS ve konuşma altındaki seviye kontrol edilir.
