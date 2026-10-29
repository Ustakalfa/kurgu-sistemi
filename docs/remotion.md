# Remotion Rehberi

## Proje yapısı

- `src/Root.tsx`: kompozisyon kaydı.
- `src/marka.ts`: renkler ve Montserrat yükleme.
- `src/sfx.ts`: katalog doğrulamalı SFX yolu.
- `src/Reels*.tsx`: dikey kompozisyonlar.
- `public/`: render sırasında `staticFile` ile okunan varlıklar.
- `araclar/`: Reels, FilmCraft, paralaks ve SFX yardımcıları.
- `package.json`: `studio`, `render`, `still`, `tip`.

## Root.tsx kompozisyonları

| Kimlik | Boyut | FPS | Süre/props |
|---|---:|---:|---|
| NexusTanitim | 1080×1920 | 30 | varsayılan tanıtım props; metadata ile dinamik |
| NexusTanitimKare | 1080×1080 | 30 | aynı props ve dinamik süre |
| NexusAltyazili | 1080×1920 | 30 | altyazı props; dinamik süre |
| NexusSlaytReels | 1080×1920 | 30 | slayt props; dinamik süre |
| Reels03 | 1080×1920 | 30 | `REELS03_SURE` |
| Reels04 | 1080×1920 | 30 | `REELS04_SURE` |
| Reels05 | 1080×1920 | 30 | `REELS05_SURE` |
| Reels06 | 1080×1920 | 30 | `REELS06_SURE` |
| Reels07 | 1080×1920 | 30 | 1860 kare |
| Reels08 | 1080×1920 | 30 | `REELS08_SURE` |

## Reels07 ev stili

Reels07, bölüm başlangıçlarını kare cinsinden bir sahne haritasında tutar. `Altyazi` zamanlı vurgulu kelimeleri; `Gren` hareketli film grenini ve ilerleme çubuğunu; `Zemin` radyal marka arka planını; `Lazer` vurgu çizgisini; `Vizor` kayıt vizörünü; `Telefon` cihaz çerçevesini; `Bolum` bölüm etiketini; `Damga` yaylı sonuç damgasını üretir. `Parmak`, `Rozet`, `Satir`, `Kart` ve üst çubuk arayüz anlatımını destekler. `spring`, `interpolate`, deterministik `random` ve sahneye göre `Sequence` ritmi kurar.

Marka katmanı siyah/bordo/kırmızı/beyaz palet, Montserrat 600/800, güçlü gölge, güvenli kenar boşluğu ve seçici SFX kullanır. `marka.ts` içindeki kamuya uygun olmayan iletişim alanlarını genel şablonlara taşımayın.

## marka.ts

Doğrulanmış renk alanları: `bordo`, `kirmizi`, `antrasit`, `siyah`, `beyaz`. `yaziTipi`, Montserrat'ın normal stil, 600/800 ağırlık ve latin/latin-ext alt kümelerini yükler. İletişim nesnesi vardır; değerleri bu kamu belgesinde yayımlanmaz.

## SFX sistemi

`sfxYolu(ad)`, `katalog.json` içinde tam `sfx/<ad>.wav` kaydını arar, yoksa hata verir ve varsa `staticFile` yolu döndürür. Böylece yazım hatası sessiz render oluşturmaz.

## Seslendirme hattı

Edge TTS kullanılabilir ses adları sürüme göre değiştiğinden depoda doğrulanmış sabit bir ad yoktur. Önce `edge-tts --list-voices` çıktısından Türkçe sesi seçin. Hız parametresinin biçimini `edge-tts --help` ile doğrulayın; uydurma değer kullanmayın. Üretilen dosyayı 48 kHz çalışma sesine dönüştürün ve sahne kareleriyle hizalayın.

Whisper kontrolü:

```sh
whisper-cli -m ~/.local/share/whisper-cpp/models/ggml-small.bin -f ses.wav -l tr -ojf -osrt -of /tmp/whisper
```

JSON kelime/segment zamanlarını sahne süreleriyle karşılaştırın; özel sözcükleri ve noktalama işaretlerini elle düzeltin.

## Çalıştırma ve render

```sh
cd ~/kurgu-sistemi/remotion
npm ci
npm run tip
npm run studio
npm run render -- Reels07 out/reels07.mp4 --scale=2
```

Kompozisyonlar kaynakta 1080×1920 veya 1080×1080'dir; bu tabloda kaynak boyutu olarak kalır. **4K kuralı:** Her Remotion render komutu `--scale=2` içerir; bu dikey kaynaklarda çıktıyı 2160×3840 yapar. 1080 çözünürlüklü çıktı yasaktır. Yalnız ölçek büyütmek kaynak videoya ayrıntı eklemez; bu nedenle kaynak medya ve kadraj ayrıca denetlenir.

## nexus-reels.py ile uzun videodan Reels

```sh
python3 araclar/nexus-reels.py yaziya-dok uzun.mp4 --dil tr
python3 araclar/nexus-reels.py sec uzun.mp4 --adet 3 --min 20 --max 45 --model gemini
python3 araclar/nexus-reels.py kes uzun.mp4 --mod kirp --x 0.5 --altyazi --sfx
```

Tek çağrı:

```sh
python3 araclar/nexus-reels.py hepsi uzun.mp4 --adet 3 --min 20 --max 45 --altyazi
```

Önce `--dry-run` ile yolları denetleyin. `--model yok` doldurulacak seçim şablonu üretir.

## Yeni kompozisyon ekleme

1. Bileşeni ve açık props tipini yeni `src/*.tsx` dosyasında oluşturun.
2. Süreyi kare cinsinden tek bir sabitte veya props tabanlı hesapta tanımlayın.
3. Statik varlıkları `public/` altına, lisans kaydıyla koyun.
4. SFX için yalnız katalog adını kullanın.
5. `Root.tsx` içinde benzersiz `id`, bileşen, boyut, fps, süre ve gerekiyorsa `defaultProps/calculateMetadata` ekleyin.
6. `npm run tip` çalıştırın.
7. Studio'da ilk/son kare, güvenli alan, taşan metin ve eksik varlık denetimi yapın.
8. Kısa test renderını sesli izleyin.
9. Teslim oranı/fps'i çıktı dosyasında ffprobe ile doğrulayın.

## Görsel kalite kontrolü

- İlk karede yüklenmemiş font veya varlık parlaması olmadığını doğrulayın.
- Her sahne sınırının bir kare öncesi/sonrasını izleyin.
- 9:16 güvenli alanında altyazı ve çağrıyı alt arayüzlerden uzak tutun.
- `OffthreadVideo` kaynaklarının fps ve süre davranışını test edin.
- Seslendirme dosyası süresi ile `Vo.sure` değerini karşılaştırın.
- Rastgelelikte Remotion'ın deterministik `random` işlevini kullanın.
- Tam renderdan önce kısa kare aralığı veya still alın; CLI parametresini yardım çıktısından doğrulayın.
- Render sonrası ffprobe ile boyut, fps, süre ve ses akışını ölçün.

