# SoundCraft tarifi

Konuşma, müzik ve referans videodan 48 kHz/24-bit miks ve stem üretir. `test-medya-hazirla.sh` için çalışma klasöründe `test4k.mp4`, macOS `say` Yelda sesi ve `ffmpeg` gerekir; betiği oraya kopyalayıp çalıştırın. Sonra `soundcraft-cli script tarif-v2.jsonl --save miks.scraft` çalıştırın. `soundcraft-tarif.jsonl` ilk, hedefi kaçıran denemedir. İz ID'leri medya içe aktarma sırasına bağlıdır; çalıştırmadan önce kontrol edin.

Doğrulanan v2 sonuç: −13,9 LUFS integrated, LRA 6,3, −2,8 dB peak. `ffmpeg` ebur128 ve `ffprobe` ile tekrar ölçün.
