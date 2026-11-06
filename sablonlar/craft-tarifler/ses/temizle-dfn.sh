#!/usr/bin/env zsh
set -euo pipefail
(( $# == 2 )) || { print -u2 'Kullanım: temizle-dfn.sh girdi.wav cikti.wav'; exit 2; }
input=$1; output=$2; temp=$(mktemp -d); trap 'rm -rf -- "$temp"' EXIT
binary=${DEEP_FILTER_BIN:-$HOME/.local/share/kurgu-araclar/deep-filter/deep-filter-0.5.6-aarch64-apple-darwin}
ffmpeg -v error -y -i "$input" -ar 48000 -ac 1 -c:a pcm_s16le "$temp/girdi.wav"
"$binary" "$temp/girdi.wav" -o "$temp"
clean=$(find "$temp" -type f -name '*_DeepFilterNet*.wav' -print -quit)
[[ -n $clean ]] || { print -u2 'DeepFilterNet çıktısı bulunamadı'; exit 1; }
ffmpeg -v error -y -i "$clean" -af 'highpass=f=80,bandreject=f=50:w=10,bandreject=f=100:w=10,loudnorm=I=-14:TP=-1:LRA=11' -ar 48000 -c:a pcm_s24le "$output"
