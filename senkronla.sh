#!/usr/bin/env zsh
set -euo pipefail
repo=${0:A:h}
kaynak=${KURGU_CANLI_KAYNAK:-"$HOME/Desktop/02 Projeler/Nexus Video"}
[[ -d $kaynak ]] || { print -u2 'Canlı kaynak bulunamadı.'; exit 1; }
ortak=(--archive --exclude='.DS_Store' --exclude='__pycache__/' --exclude='*.wav' --exclude='*.mp4' --exclude='*.mov' --exclude='*.mxf' --exclude='.npmrc' --exclude='node_modules/' --exclude='.env*' --exclude='*.fcproj' --max-size=50m)
for ad in filmcraft-kurgu; do
 [[ -d "$kaynak/.claude/skills/$ad" ]] && rsync "${ortak[@]}" "$kaynak/.claude/skills/$ad/" "$repo/skills/$ad/"
done
for ad in yeni-is cekim-kontrol gemini-run codex-run codex-img codex-img-batch yerel-run; do
 [[ -f "$HOME/.local/bin/$ad" ]] && rsync --archive "$HOME/.local/bin/$ad" "$repo/bin/$ad"
done
for ad in src araclar avenox-studio; do
 [[ -d "$kaynak/$ad" ]] && rsync "${ortak[@]}" "$kaynak/$ad/" "$repo/remotion/$ad/"
done
for ad in package.json package-lock.json tsconfig.json README.md NODE_SURUMU.md R08_BRIEF.md R08_NOTLAR.md props-reels03.json; do
 [[ -f "$kaynak/$ad" ]] && rsync --archive "$kaynak/$ad" "$repo/remotion/$ad"
done
for ad in logo sfx; do
 [[ -d "$kaynak/public/$ad" ]] && rsync "${ortak[@]}" "$kaynak/public/$ad/" "$repo/remotion/public/$ad/"
done
print 'Canlı kaynaklar eşitlendi; docs ve vendor korunur. ./dogrula.sh çalıştırın.'
