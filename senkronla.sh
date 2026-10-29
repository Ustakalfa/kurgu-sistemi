#!/usr/bin/env zsh
# Yalnız depo sahibi için: kişisel canlı kaynakları bu depoya eşitler.
set -euo pipefail
repo=${0:A:h}
kaynak=${KURGU_CANLI_KAYNAK:-"$HOME/Desktop/02 Projeler/Nexus Video"}
[[ -d $kaynak ]] || { print -u2 'Kaynak klasör yok; bu betik deponun sahibine özeldir.'; exit 1; }
ortak=(--archive --exclude='.DS_Store' --exclude='__pycache__/' --exclude='*.wav' --exclude='*.mp4' --exclude='*.mov' --exclude='*.mxf' --exclude='.npmrc' --exclude='node_modules/' --exclude='.env*' --exclude='*.fcproj' --max-size=50m)
farkli_mi() {
 local depo=$1 canli=$2
 if [[ -f $depo && -f $canli ]]; then
  ! cmp -s -- "$depo" "$canli"
 elif [[ -d $depo && -d $canli ]]; then
  ! diff -qr -- "$depo" "$canli" >/dev/null 2>&1
 else
  return 0
 fi
}
bag_durumunu_yaz() {
 local ad=$1 depo=$2 canli=$3
 [[ -e $canli || -L $canli ]] || return 0
 if [[ -L $canli && ${canli:A} == ${depo:A} ]]; then
  print "bağlı: $canli → $depo"
 elif farkli_mi "$depo" "$canli"; then
  print "FARKLI — elle birleştir veya ./kurulum.sh --bin --skills ile depoya bağla: $ad ($canli)"
 fi
}
for depo in "$repo"/bin/*(.N); do
 ad=${depo:t}
 bag_durumunu_yaz "$ad" "$depo" "$HOME/.local/bin/$ad"
done
for depo in "$repo"/skills/*(/N); do
 ad=${depo:t}
 bag_durumunu_yaz "$ad" "$depo" "$HOME/.claude/skills/$ad"
 bag_durumunu_yaz "$ad" "$depo" "$kaynak/.claude/skills/$ad"
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
