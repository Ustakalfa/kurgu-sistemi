#!/usr/bin/env zsh
set -u
setopt pipe_fail null_glob
repo=${0:A:h}
kuru=0; bag=0; skills=0; bin=0; mcp=0; remotion=0
kullanim() { print 'Kullanım: ./kurulum.sh [--kuru] [--bagimliliklar] [--skills] [--bin] [--mcp] [--remotion] [--hepsi]'; }
for arg in "$@"; do
 case $arg in
 --kuru) kuru=1;; --bagimliliklar) bag=1;; --skills) skills=1;; --bin) bin=1;; --mcp) mcp=1;; --remotion) remotion=1;; --hepsi) bag=1; skills=1; bin=1; mcp=1; remotion=1;; *) kullanim; exit 2;; esac
done
if (( ! (bag+skills+bin+mcp+remotion) )); then
 if (( kuru )); then bag=1; skills=1; bin=1; mcp=1; remotion=1; else kullanim; exit 2; fi
fi
if [[ ! -f "$repo/vendor/avenoxskills/skills/avenox-video/SKILL.md" ]]; then print -u2 'Uyarı: alt modüller eksik. git submodule update --init --recursive çalıştırın.'; fi
run() { print -r -- "Komut: ${(q)@}"; (( kuru )) || "$@"; }
bagla() {
 local kaynak=$1 hedef=$2 yedek
 [[ -e $kaynak ]] || { print -u2 "Kaynak yok: $kaynak"; return 1; }
 if [[ -L $hedef && ${hedef:A} == ${kaynak:A} ]]; then print "Zaten bağlı: $hedef"; return 0; fi
 if [[ -e $hedef || -L $hedef ]]; then
  yedek="$hedef.yedek-$(date '+%Y%m%d-%H%M%S')"
  while [[ -e $yedek || -L $yedek ]]; do yedek+="-1"; done
  print "Yedek: $hedef → $yedek"; (( kuru )) || mv -- "$hedef" "$yedek"
 fi
 print "Bağla: $hedef → $kaynak"
 if (( ! kuru )); then mkdir -p -- "${hedef:h}"; ln -s -- "$kaynak" "$hedef"; fi
}
if (( bag )); then
 run brew bundle --file "$repo/Brewfile"
 run uv tool install edge-tts
 run uv tool install auto-editor
 run npm install -g @openai/codex
 run ollama pull qwen3.5:9b
 run ollama pull gemma4:e4b
 model="$HOME/.local/share/whisper-cpp/models/ggml-small.bin"
 if [[ ! -s $model ]]; then
  print "Model indir: $model"
  if (( ! kuru )); then mkdir -p -- "${model:h}"; curl -fL --retry 3 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin' -o "$model"; fi
 fi
fi
if (( skills )); then
 while IFS='|' read -r _ ad kaynak _; do
  ad=${${ad## }%% }; kaynak=${${kaynak## }%% }
  [[ $kaynak == skills/* || $kaynak == vendor/* ]] || continue
  bagla "$repo/$kaynak" "$HOME/.claude/skills/$ad"
 done < "$repo/skills/HARITA.md"
fi
if (( bin )); then for kaynak in "$repo"/bin/*; do bagla "$kaynak" "$HOME/.local/bin/${kaynak:t}"; done; fi
if (( mcp )); then
 run claude mcp add filmcraft -- "$HOME/.local/bin/filmcraft-cli" mcp --bridge 127.0.0.1:9876
 run claude mcp add filmcraft-headless -- "$HOME/.local/bin/filmcraft-cli" mcp
else
 print 'MCP isteğe bağlı: --mcp veya --hepsi ile claude mcp add çalışır.'
fi
if (( remotion )); then print 'Remotion: npm ci'; (( kuru )) || (cd "$repo/remotion" && npm ci); fi
print '\nBağımlılık raporu:'
for komut in ffmpeg whisper-cli node python3 uv ollama agy codex filmcraft-cli edge-tts auto-editor gh; do
 if (( $+commands[$komut] )); then surum=$("$komut" --version 2>&1 | head -1); print "VAR $komut: $surum"; else print "YOK $komut"; fi
done
[[ -d /Applications/FilmCraft.app ]] && print 'VAR FilmCraft.app' || print 'YOK FilmCraft.app'
if (( $+commands[ollama] )); then ollama list 2>/dev/null | head -4; fi
print 'Node uyumluluğu: remotion/NODE_SURUMU.md (22.23.3 ve 24.22.0 doğrulanmış).'
