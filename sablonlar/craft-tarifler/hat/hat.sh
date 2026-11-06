#!/usr/bin/env zsh
set -euo pipefail
(( $# == 2 )) || { print -u2 'Kullanım: hat.sh is-klasoru adimlar.jsonl'; exit 2; }
work=${1:A}; script=${2:A}; mkdir -p "$work"/{01-ham,02-ses,03-grafik,04-kurgu,05-kontrol}
[[ -f $script ]] || { print -u2 'Adım dosyası yok'; exit 1; }
grep -q '"id"[[:space:]]*:[[:space:]]*"file.save' "$script" || { print -u2 'Son kayıt adımı eksik'; exit 1; }
(cd "$work" && filmcraft-cli run "$script")
