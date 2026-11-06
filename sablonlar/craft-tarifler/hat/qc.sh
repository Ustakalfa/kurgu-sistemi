#!/usr/bin/env zsh
set -euo pipefail
(( $# == 3 )) || { print -u2 'Kullanım: qc.sh is-klasoru kisa-test.mov miks.wav'; exit 2; }
work=${1:A}; video=${2:A}; audio=${3:A}; mkdir -p "$work/05-kontrol"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate -of json "$video" > "$work/05-kontrol/format.json"
ffmpeg -hide_banner -i "$audio" -filter_complex 'ebur128=peak=true' -f null - 2> "$work/05-kontrol/ses.txt"
ffmpeg -hide_banner -i "$video" -vf 'blackdetect=d=0.1:pix_th=0.1,freezedetect=n=-50dB:d=0.5' -an -f null - 2> "$work/05-kontrol/tarama.txt"
print 'Kısa test ölçüldü; tam sekans ve görsel kare kontrolü ayrıca gerekir.'
