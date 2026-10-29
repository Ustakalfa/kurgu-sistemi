#!/usr/bin/env zsh
set -euo pipefail
setopt null_glob
repo=${0:A:h}
nexus="$HOME/Desktop/02 Projeler/Nexus Video"
beyin="$HOME/Documents/Yeni Beyin"
ortak=(--archive --exclude='.DS_Store' --exclude='__pycache__/' --exclude='test-ciktisi/' --exclude='*.wav' --exclude='*.mp4' --exclude='*.mov' --exclude='*.mxf' --exclude='.npmrc' --exclude='node_modules/' --exclude='LICENSE' --exclude='CekmeFelek.tsx' --exclude='GKTanitim*.tsx' --exclude='cekme-felek-cekimler.json' --exclude='cikti/' --exclude='out/' --exclude='.env*' --exclude='*.fcproj' --max-size=50m)
esitle() { mkdir -p "$2"; rsync "${ortak[@]}" --delete "$1/" "$2/"; }
for ad in filmcraft-kurgu avenox-video avenox-roughcut avenox-graphics avenox-thumbnail; do
  esitle "$nexus/.claude/skills/$ad" "$repo/skills/$ad"
done
mkdir -p "$repo/bin"
for ad in yeni-is cekim-kontrol gemini-run codex-run codex-img codex-img-batch yerel-run; do
  rsync --archive --max-size=50m "$HOME/.local/bin/$ad" "$repo/bin/$ad"
done
for ad in src araclar avenox-studio; do esitle "$nexus/$ad" "$repo/remotion/$ad"; done
for ad in package.json package-lock.json tsconfig.json README.md NODE_SURUMU.md R08_BRIEF.md R08_NOTLAR.md props-reels03.json .gitignore; do
  rsync --archive --max-size=50m "$nexus/$ad" "$repo/remotion/$ad"
done
mkdir -p "$repo/remotion/public/logo"
rsync --archive --delete --exclude='.DS_Store' --max-size=50m "$nexus/public/logo/" "$repo/remotion/public/logo/"
mkdir -p "$repo/remotion/public/sfx"
rsync "${ortak[@]}" --delete "$nexus/public/sfx/" "$repo/remotion/public/sfx/"
rsync --archive "$beyin/.claude/hookify.video-hatti.local.md" "$repo/hooks/"
