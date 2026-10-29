#!/usr/bin/env zsh
set -euo pipefail
repo=${0:A:h}
kuru=0
if [[ ${1:-} == --kuru ]]; then kuru=1; shift; fi
if (( $# )); then print -u2 'Kullanım: zsh kurulum.sh [--kuru]'; exit 2; fi
kur() {
  local kaynak=$1 hedef=$2 tarih yedek
  if [[ -L $hedef && ${hedef:A} == ${kaynak:A} ]]; then print "Zaten kurulu: $hedef"; return; fi
  if [[ -e $hedef || -L $hedef ]]; then
    tarih=$(date '+%Y%m%d-%H%M%S'); yedek="$hedef.yedek-$tarih"
    while [[ -e $yedek || -L $yedek ]]; do yedek="$yedek-1"; done
    print "Yedekle: $hedef → $yedek"
    (( kuru )) || mv -- "$hedef" "$yedek"
  fi
  print "Bağla: $hedef → $kaynak"
  if (( ! kuru )); then mkdir -p -- "${hedef:h}"; ln -s -- "$kaynak" "$hedef"; fi
}
for kaynak in "$repo"/bin/*; do kur "$kaynak" "$HOME/.local/bin/${kaynak:t}"; done
for kaynak in "$repo"/skills/*; do kur "$kaynak" "$HOME/.claude/skills/${kaynak:t}"; done
print '\nBağımlılıklar:'
for komut in ffmpeg node python3 ollama agy codex filmcraft-cli; do
  if (( $+commands[$komut] )); then print "VAR: $komut"; else print "EKSİK: $komut"; fi
done
print '\nFilmCraft MCP için örnek komutlar (çalıştırılmadı):'
print 'claude mcp add filmcraft -- ~/.local/bin/filmcraft-cli mcp --bridge 127.0.0.1:9876'
print 'claude mcp add filmcraft-headless -- ~/.local/bin/filmcraft-cli mcp'
print 'Remotion için: cd remotion && npm ci'
