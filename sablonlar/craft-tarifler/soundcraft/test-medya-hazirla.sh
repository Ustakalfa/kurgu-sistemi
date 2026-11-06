#!/bin/zsh
set -euo pipefail
cd "${GIRDI:-$PWD}"

metin='Merhaba. Bu kayıt, SoundCraft ses temizliği ve miks denemesi için hazırlanmıştır. Alçak frekanslı uğultuyu, arka plan gürültüsünü ve ani tıklamaları temizleyeceğiz. Ardından konuşmanın altında müzik seviyesini otomasyonla azaltacağız. Hedefimiz YouTube için eksi on dört LUFS ve eksi bir desibel gerçek tepe değeridir. Türkçe karakter testi: Çağrı Işığı Öğün Şükür İğne. Temiz, anlaşılır ve dengeli bir sonuç arıyoruz.'
say -v Yelda -r 175 -o konusma-yelda.aiff "$metin"

ffmpeg -hide_banner -y -i konusma-yelda.aiff -af 'apad,atrim=0:25,aresample=48000' -c:a pcm_s24le konusma-temiz.wav

ffmpeg -hide_banner -y \
  -i konusma-temiz.wav \
  -f lavfi -i 'sine=frequency=50:sample_rate=48000:duration=25' \
  -f lavfi -i 'anoisesrc=color=white:sample_rate=48000:duration=25:amplitude=0.0178' \
  -f lavfi -i 'anoisesrc=color=white:sample_rate=48000:duration=0.003:amplitude=0.95' \
  -f lavfi -i 'anoisesrc=color=white:sample_rate=48000:duration=0.003:amplitude=0.95' \
  -f lavfi -i 'anoisesrc=color=white:sample_rate=48000:duration=0.003:amplitude=0.95' \
  -f lavfi -i 'anoisesrc=color=white:sample_rate=48000:duration=0.003:amplitude=0.95' \
  -filter_complex '[0:a]volume=0.88[vo];[1:a]volume=0.035[hum];[3:a]adelay=2000:all=1[c1];[4:a]adelay=9000:all=1[c2];[5:a]adelay=17000:all=1[c3];[6:a]adelay=23000:all=1[c4];[vo][hum][2:a][c1][c2][c3][c4]amix=inputs=7:normalize=0,alimiter=limit=0.98,atrim=0:25' \
  -ar 48000 -ac 1 -c:a pcm_s24le konusma-kirli.wav

ffmpeg -hide_banner -y \
  -f lavfi -i "aevalsrc=0.10*sin(2*PI*(if(lt(mod(t\,8)\,2)\,130.81\,if(lt(mod(t\,8)\,4)\,174.61\,if(lt(mod(t\,8)\,6)\,196\,146.83))))*t)+0.07*sin(2*PI*(if(lt(mod(t\,8)\,2)\,164.81\,if(lt(mod(t\,8)\,4)\,220\,if(lt(mod(t\,8)\,6)\,246.94\,185))))*t)+0.05*sin(2*PI*(if(lt(mod(t\,8)\,2)\,196\,if(lt(mod(t\,8)\,4)\,261.63\,if(lt(mod(t\,8)\,6)\,293.66\,220))))*t):s=48000:d=30" \
  -f lavfi -i 'anoisesrc=color=pink:sample_rate=48000:duration=30:amplitude=0.09' \
  -filter_complex '[0:a]aecho=0.8:0.5:80:0.18,lowpass=f=3500,afade=t=in:d=1,afade=t=out:st=28:d=2[harm];[1:a]highpass=f=90,lowpass=f=180,agate=threshold=0.045:ratio=8:attack=2:release=80,volume=0.45[beat];[harm][beat]amix=inputs=2:normalize=0,alimiter=limit=0.8' \
  -ar 48000 -ac 2 -c:a pcm_s24le muzik-yatagi.wav

ffmpeg -hide_banner -y -ss 2 -i test4k.mp4 -frames:v 1 -vf 'scale=3840:2160:flags=lanczos' kapak-kare.png
mkdir -p batch-girdi batch-cikti
for t in 0 1.5 3; do
  n=${t//./_}
  ffmpeg -hide_banner -loglevel error -y -ss "$t" -i test4k.mp4 -frames:v 1 -vf 'scale=1920:1080:flags=lanczos' "batch-girdi/kare-${n}.png"
done
