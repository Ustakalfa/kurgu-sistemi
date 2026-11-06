# Türkçe SRT

`./whisper-srt.sh girdi.mp4 cikti.srt` 16 kHz WAV çıkarır, yerel büyük Türkçe modelle SRT ve tam JSON üretir. İlk altyazı başlangıcını `silencedetect` ile ilk konuşmaya hizalar ve FilmCraft `captions.import` örnek satırını basar. Ölçülen 35 sn konuşma 13 sn'de çözüldü; 58 kelimede 1 hata (%1,7). İlk sessizlik algısını ve zamanları dinleyerek kontrol et. Bu FilmCraft derlemesinde `transcript.generate` yok.
