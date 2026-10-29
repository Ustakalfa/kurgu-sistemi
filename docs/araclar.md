# Araç Başvurusu

Bu belge depodaki çalıştırılabilir araçların sözdizimini kaynak kodundan özetler. Yer tutucular gerçek yol değildir. Komuttan önce `--help` varsa kullanın; yazma hedefini ayrı bir çalışma klasörü seçin.

## bin/ araçları

## yeni-is

- Amaç: Standart iş klasörü ve başlangıç belgeleri üretir.
- Sözdizimi: `yeni-is "<etiket>" "<iş adı>" [--format 9x16|16x9|ikisi]`.
- Seçenekler/davranış: Seçenek yalnız `--format`; varsayılan davranış için betik kaynağına bakın.
- Örnek: `yeni-is "orta" "orta" [--format 9x16|16x9|ikisi]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## cekim-kontrol

- Amaç: Video dosyalarını salt okunur teknik denetler.
- Sözdizimi: `cekim-kontrol KLASOR [--gemini] [--hizli] [--cikti DOSYA]`.
- Seçenekler/davranış: `--gemini` görsel katman; `--hizli` süre sınırı; `--cikti` rapor yolu.
- Örnek: `cekim-kontrol "$HOME/Movies/Isler/2026-11-03_ornek-kafe_tanitim-reels/01-ham" [--gemini] [--hizli] [--cikti DOSYA]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## codex-run

- Amaç: Tür bazlı model zinciriyle Codex çalıştırır.
- Sözdizimi: `codex-run <basit|hafif|orta|ana|ana2|derin|astra> "prompt" [-s read-only|workspace-write]`.
- Seçenekler/davranış: Kayıt: `~/.codex/codex-run-kullanim.csv`; limit/boş/ret halinde sıradaki model.
- Örnek: `codex-run orta "prompt" [-s read-only|workspace-write]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## gemini-run

- Amaç: agy üzerinden model zinciri çalıştırır.
- Sözdizimi: `gemini-run <hizli|orta|derin|video|claude|opus> "prompt" [-d klasör]`.
- Seçenekler/davranış: Kayıt: `~/.gemini/gemini-run-kullanim.csv`; `-d` çalışma klasörü.
- Örnek: `gemini-run orta "prompt" [-d klasör]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## yerel-run

- Amaç: Ollama ile yerel metin işi yapar.
- Sözdizimi: `yerel-run <temizle|etiketle|ozet|cevir|serbest> "prompt" [-m model]`.
- Seçenekler/davranış: Prompt `-` ise stdin; kayıt `~/.ollama/yerel-run-kullanim.csv`.
- Örnek: `yerel-run orta "prompt" [-m model]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## codex-img

- Amaç: Tek PNG görsel üretimi ister.
- Sözdizimi: `codex-img cikti.png "tek satır prompt" [-r referans.png]`.
- Seçenekler/davranış: Çok satırlı prompt reddedilir; `-r` var olan referans ister; kendi kendine tekrar yok.
- Örnek: `codex-img cikti.png "tek satır prompt" [-r referans.png]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## codex-img-batch

- Amaç: Satır tabanlı görsel işlerini toplu yürütür.
- Sözdizimi: `codex-img-batch is-listesi.txt [paralel]`.
- Seçenekler/davranış: Liste biçimini betik başındaki açıklamayla doğrulayın; başarısız işi körlemesine yinelemeyin.
- Örnek: `codex-img-batch is-listesi.txt [paralel]`.
- Ürün: komuta göre stdout, rapor, klasör veya PNG.
- Tuzak: kullanıcı verisini prompta koymayın; kaynak/çıktı yolunu karıştırmayın; çıkış kodunu kontrol edin.

## remotion/araclar/nexus-reels.py

Alt komutlar `yaziya-dok`, `sec`, `kes`, `hepsi` ve özel `--self-test`tir.

| Seçenek | Kapsam | Anlam/varsayılan |
|---|---|---|
| `VIDEO` | tümü | kaynak video |
| `--cikti` | tümü | varsayılan `./cikti/<video_adi>/` |
| `--dry-run` | tümü | ffmpeg komutunu göster, işlem yapma |
| `--dil` | yazıya-dok/sec/hepsi | `tr` |
| `--adet` | sec/hepsi | 3 |
| `--min` / `--max` | sec/hepsi | 20 / 60 saniye |
| `--model` | sec/hepsi | `gemini` veya `yok` |
| `--mod` | kes/hepsi | `kirp` veya `bulanik` |
| `--x` | kes/hepsi | yatay odak 0–1; varsayılan 0.5 |
| `--logo` | kes/hepsi | sağ üst logo yolu |
| `--sfx` | kes/hepsi | kesim ve altyazı efektleri |
| `--sfx-gecis` | kes/hepsi | katalog adı |
| `--sfx-seviye` | kes/hepsi | varsayılan -14 dB; -60–0 |
| `--altyazi` / `--altyazisiz` | kes/hepsi | varsayılan altyazılı |
| `--secim` | kes | seçim JSON'u |


```sh
python3 remotion/araclar/nexus-reels.py --self-test
python3 remotion/araclar/nexus-reels.py hepsi video.mp4 --adet 3 --min 20 --max 45 --altyazi --sfx
```


Ürünler: `transkript.json`, `transkript.srt`, `transkript.txt`, `secim.json` ve MP4 klipler. Geçici WAV otomatik temizlenir. Ses iki geçişli loudnorm ile -14 LUFS, -1.5 dBTP hedefler.

## filmcraft-mcp.py


```sh
python3 remotion/araclar/filmcraft-mcp.py ~/.local/bin/filmcraft-cli adimlar.txt
```


İlk argüman CLI, ikinci argüman satır başına `arac_adi JSON` içeren dosyadır. MCP initialize eder, adımları sırayla çağırır; görsel sonucu `_png` veya `/tmp/x.png` yoluna yazar. Hata sonrası otomatik geri alma yoktur.

## paralaks.py

Sözdizimi: `python3 remotion/araclar/paralaks.py girdi cikti.mp4 hareket [saniye=4] [guc=1.0]`. Hareketler: `dolly`, `dolly-out`, `pan-sol`, `pan-sag`, `yuksel`, `in`, `orbit`. Çıktı 2160×3840, 30 fps, H.264'tür. Depth Anything modeli ilk kullanımda indirilebilir; ağ ve lisans koşullarını kontrol edin.

## sfx-olc.py


```sh
python3 remotion/araclar/sfx-olc.py KAYNAK olcum.json
```


WAV/MP3 dosyalarını ffprobe/ffmpeg ile ölçer; süre, örnekleme, kanal, codec, LUFS, tepe, baş sessizliği ve sınırlı etiketleri JSON'a yazar.

## sfx-hazirla.py


```sh
python3 remotion/araclar/sfx-hazirla.py KAYNAK remotion/public/sfx olcum.json
```


Başı kırpar, tepeyi normalize eder, 48 kHz stereo PCM WAV üretir; 30 saniyeyi aşanı kısaltıp fade uygular ve `katalog.json` yazar. Kaynak sınıflaması dosya adına dayanır; dinlenmiş kabul edilmez.

## kurulum.sh, dogrula.sh, senkronla.sh

- `./kurulum.sh --kuru|--bagimliliklar|--skills|--bin|--mcp|--remotion|--hepsi`: ayrıntı için kurulum belgesi.
- `./dogrula.sh`: sözdizimi, JSON, TypeScript, self-test, gizli içerik ve bağ denetimi.
- `./senkronla.sh`: yerel komut/beceri/Remotion kaynaklarını depoya rsync eder; WAV, video, node_modules, ortam dosyaları, proje dosyaları ve 50 MB üstünü dışlar. Seçeneği yoktur.

## remotion/avenox-studio/scripts

| Araç | Sözdizimi | Ürün / not |
|---|---|---|
| `autocut.sh` | `autocut.sh video [agresif|denge|koruyucu]` veya eşik ve margin | yeniden render etmeden Premiere XML; auto-editor yolu betikte sabittir ve taşınabilirliği doğrulanmalıdır |
| `remove-silence.py` | `python3 remove-silence.py input [output] [--db -30] [--min 0.6] [--pad 0.12]` | sessizliği bulur, A/V parçalarını tek H.264/AAC re-encode ile birleştirir |
| `transcribe.py` | `python3 transcribe.py INPUT OUTPREFIX` | mlx-whisper large-v3-turbo ile Türkçe zamanlı JSON ve düz metin |
| `mltgen.py` | `python3 mltgen.py edit.json out.mlt [--base KOK]` | clip/slide ve isteğe bağlı müzikten MLT XML |
| `vrender.sh` | `vrender.sh PROJECT.mlt [OUT.mp4] [fast|quality]` | fast: VideoToolbox; quality: libx264 CRF 18 |
| `slides2png.sh` | `slides2png.sh DECK.html OUTDIR [WIDTHxHEIGHT]` | decktape ile slayt PNG'leri ve ara PDF |
| `grabshot.sh` | `grabshot.sh [ad]` | panodaki PNG'yi `${STUDIO_JOBS:-$HOME/video/projects}/img/screenshots` altına yazar |

`autocut.sh` denge için %0,6 eşik/2 sn margin; agresif için %0,6/0,4 sn; koruyucu için %0,6/7,5 sn kullanır. Bu alt ağaçtaki araçlar ana `bin/` yüzeyi değildir; bağımlılıkları ayrıca doğrulayın.

## Ortam ve güvenlik

Araçlar `$HOME` kullanır; mutlak kişisel yol belgeye yazılmaz. CSV günlükleri prompt metnini değil tür/model/süre/sonucu tutar. Kaynağa yazan araçlarda önce `--dry-run` kullanın. Ham medya klasörünü çıktı hedefi yapmayın. Model/CLI sürümleri değişebileceği için hata anında kaynak betiği ve `--help` çıktısı son sözdür.

