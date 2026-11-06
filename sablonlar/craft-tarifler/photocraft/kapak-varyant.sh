#!/bin/zsh
set -e
CLI="$HOME/.local/bin/photocraft-cli"
$CLI run kapak-sablon.pcraft --cmd layer.smartObjects.replaceContents --params '{"layer":6,"path":"kapak-kare-2.png"}' --cmd type.edit --params '{"layer":7,"text":"DERT NEDİR?"}' --out kapak-2.pcraft > kapak-2.log
$CLI run kapak-sablon.pcraft --cmd layer.smartObjects.replaceContents --params '{"layer":6,"path":"kapak-kare-3.png"}' --cmd type.edit --params '{"layer":7,"text":"YENİ BÖLÜM"}' --out kapak-3.pcraft > kapak-3.log
$CLI run kapak-sablon.pcraft --cmd type.edit --params '{"layer":7,"text":"ÇAĞRI IŞIĞI"}' --out kapak-1.pcraft > kapak-1.log
for i in 1 2 3; do $CLI convert kapak-$i.pcraft kapak-$i.png > kapak-$i-convert.log; done
ffmpeg -nostdin -v error -y -i kapak-1.png -i kapak-2.png -i kapak-3.png -filter_complex 'hstack=inputs=3' -frames:v 1 kapak-temas.jpg
