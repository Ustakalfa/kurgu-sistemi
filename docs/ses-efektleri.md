# Ses Efektleri

## Katalog

`remotion/public/sfx/katalog.json` her kayıt için `dosya`, `kategori`, `ad`, `kaynak`, `orijinal`, `sure_sn` ve `uyarilar` alanlarını taşır. `dosya`, Remotion public köküne göre yoldur; `ad` dosya adına uygun slug; uyarılar kalite riskleridir.

| Kategori | Adet |
|---|---:|
| acilis | 2 |
| bildirim | 9 |
| dijital | 6 |
| dramatik | 6 |
| foto | 4 |
| gecis | 17 |
| metin | 13 |
| ortam | 7 |
| vurgu | 12 |
| **Toplam** | **76** |

Sayılar mevcut katalogdan hesaplandı; katalog değişirse `jq -r 'group_by(.kategori)[] | "\\(.[0].kategori) \\(length)"' remotion/public/sfx/katalog.json` ile yenileyin.

## TypeScript API

`sfx.ts`, kataloğu içe aktarır ve `SfxKaydi`, `sfxKatalogu`, `sfxYolu(ad)` dışa verir. Çağrı tam dosya gövdesini kullanır:

```ts
import {sfxYolu} from './sfx';
const kaynak = sfxYolu('gecis--whoosh-yumusak');
```

Kayıt yoksa işlev hata fırlatır; sessizce yanlış efekt seçmez. Dönen değer `staticFile(kayit.dosya)` sonucudur.

## Ölçüm ve hazırlama


```sh
python3 remotion/araclar/sfx-olc.py KAYNAK /tmp/olcum.json
python3 remotion/araclar/sfx-hazirla.py KAYNAK remotion/public/sfx /tmp/olcum.json
```


Ölçüm WAV/MP3 okur; önizleme adlı dosyaları atlar. Hazırlama baş sessizliğini -50 dB eşiğiyle kırpar, kaynak tepesini -1 dBFS'e yaklaştırır, limiter uygular, 48 kHz stereo 16-bit PCM üretir. 30 saniyeyi aşan kaynak 30 saniyede kesilir ve son iki saniyeye fade uygulanır.

## WAV dosyaları neden depoda yok?

`senkronla.sh` bütün `*.wav` dosyalarını açıkça dışlar. Bunun nedenleri boyut, lisans ve yeniden üretilebilirliktir. Katalog metadata sağlar; ses varlıklarının dağıtım hakkı ayrıca doğrulanmalıdır. Eksik WAV'ı uydurma URL'den indirmeyin.

## Kendi kütüphanenizden yeniden üretim

1. Lisansını bildiğiniz WAV/MP3 kaynaklarını tek bir klasörde toplayın.
2. Dosya adlarını değiştirmeden ölçüm JSON'u üretin.
3. Ölçümde taşma, düşük örnekleme ve uzun baş sessizliğini inceleyin.
4. `sfx-hazirla.py` içindeki sınıflama tablolarının kaynak adlarınızla uyuştuğunu doğrulayın.
5. Hazırlama komutunu çalıştırın.
6. Yeni `katalog.json` sayılarını kontrol edin.
7. Her efekti kulakla dinleyin; dosya adına dayalı sınıflama kalite garantisi değildir.
8. Remotion tip kontrolü ve kısa bir render yapın.

## Karışım ilkeleri

SFX hikâyeyi ve hareketi destekler; her kesime efekt konmaz. `nexus-reels.py` geçiş düzeyi varsayılanı -14 dB'dir ve kabul aralığı -60–0 dB'dir. Konuşma varken efekti kısın, kulaklık ve hoparlörde denetleyin, kaynakta bozulma uyarısı varsa yükseltmeyin. Telif/lisans kaydını proje notunda tutun.

