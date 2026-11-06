#!/usr/bin/env zsh
set -euo pipefail
if (( $# != 2 )); then print -u2 'Kullanım: whisper-srt.sh girdi-video-veya-ses cikti.srt'; exit 2; fi
girdi=${1:A}; cikti=${2:A}; kok=${cikti%.srt}; gecici=$(mktemp -d)
trap 'rm -rf -- "$gecici"' EXIT
model="$HOME/.local/share/whisper/ggml-large-v3-turbo-q8_0.bin"
[[ -s $model ]] || { print -u2 "Whisper modeli yok: $model"; exit 1; }
ffmpeg -nostdin -v error -y -i "$girdi" -vn -ac 1 -ar 16000 -c:a pcm_s16le "$gecici/ses.wav"
whisper-cli -m "$model" -l tr -f "$gecici/ses.wav" -osrt -ojf -ml 42 -sow -of "$gecici/cikti"
ffmpeg -nostdin -i "$gecici/ses.wav" -af 'silencedetect=noise=-35dB:d=0.12' -f null - 2> "$gecici/sessizlik.log" || true
python3 - "$gecici/cikti.srt" "$gecici/sessizlik.log" "$cikti" <<'PY'
from pathlib import Path
import re, sys
src, log, dst = map(Path, sys.argv[1:])
text = src.read_text(encoding='utf-8')
lines = log.read_text(errors='replace').splitlines()
first = next((float(m.group(1)) for line in lines if (m := re.search(r'silence_end:\s*([0-9.]+)', line))), 0.0)
def ms(stamp):
    h, m, rest = stamp.split(':'); s, milli = rest.split(',')
    return ((int(h)*60+int(m))*60+int(s))*1000+int(milli)
def stamp(value):
    value = max(0, value); h, value = divmod(value, 3600000); m, value = divmod(value, 60000); s, value = divmod(value, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{value:03d}'
pattern = re.compile(r'(?m)^(\d\d:\d\d:\d\d,\d{3}) --> (\d\d:\d\d:\d\d,\d{3})$')
def align(match):
    start, end = map(ms, match.groups())
    if start < round(first*1000) < end:
        start = round(first*1000)
    return f'{stamp(start)} --> {stamp(end)}'
dst.write_text(pattern.sub(align, text, count=1), encoding='utf-8')
PY
cp -- "$gecici/cikti.json" "${kok}.json"
print "SRT: $cikti; kelime zamanları: ${kok}.json"
print "FilmCraft örnek JSONL: {\"id\":\"captions.import\",\"params\":{\"path\":\"$cikti\",\"name\":\"Türkçe\"}}"
