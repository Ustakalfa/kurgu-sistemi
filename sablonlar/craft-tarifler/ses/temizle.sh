#!/bin/zsh
set -euo pipefail
if (( $# != 2 )); then echo 'Kullanım: ./temizle.sh girdi.wav cikti.wav' >&2; exit 2; fi
GIRDI="$1"; CIKTI="$2"
TMP_DIZIN=$(mktemp -d)
trap 'rm -rf "$TMP_DIZIN"' EXIT
ffmpeg -nostdin -v error -y -i "$GIRDI" -af 'highpass=f=70,bandreject=f=50:width_type=h:width=4,bandreject=f=100:width_type=h:width=6,anlmdn=s=7:p=0.002:r=0.006' -ar 48000 -ac 1 -c:a pcm_s24le "$TMP_DIZIN/on.wav"
python3 - "$TMP_DIZIN/on.wav" "$TMP_DIZIN/sc.wav" "$TMP_DIZIN/zincir.jsonl" <<'PY'
import json,sys
src,out,recipe=sys.argv[1:]
steps=[('session.new',{'name':'Gurultu Temizligi','sample_rate':48000,'bit_depth':24}),('file.import_audio',{'path':src})]
plugins=[('expander_gate',{'threshold':-43,'ratio':2.5,'range':12,'attack':5,'hold':80,'release':180}),('eq_7band',{'hpf_on':1,'hpf_freq':70,'hpf_slope':2,'low_mid_freq':50,'low_mid_gain':-18,'low_mid_q':10,'mid_freq':100,'mid_gain':-18,'mid_q':10}),('de_esser',{'freq':6500,'threshold':-30,'range':6}),('compressor',{'threshold':-24,'ratio':2.5,'attack':8,'release':140,'makeup':3})]
for i,(name,params) in enumerate(plugins):steps.append(('mix.insert',{'track':2,'slot':i,'plugin':name,'params':params}))
steps.append(('file.bounce_mix',{'path':out,'format':'wav','bit_depth':24}))
open(recipe,'w').write(''.join(k+' '+json.dumps(v)+'\n' for k,v in steps))
PY
"$HOME/.local/bin/soundcraft-cli" script "$TMP_DIZIN/zincir.jsonl" > "$TMP_DIZIN/soundcraft.log"
ffmpeg -nostdin -v error -y -i "$TMP_DIZIN/sc.wav" -af 'loudnorm=I=-14:TP=-1:LRA=7' -ar 48000 -c:a pcm_s24le "$CIKTI"
ffprobe -v error -show_entries stream=sample_rate,channels,duration -of json "$CIKTI"
