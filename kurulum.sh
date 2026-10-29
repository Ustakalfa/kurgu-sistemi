#!/usr/bin/env zsh
set -u
setopt pipe_fail null_glob
repo=${0:A:h}
kuru=0; evet=0; bag=0; skills=0; bin=0; mcp=0; remotion=0; claude_md=0; claude_md_kaldir=0; hooks=0
kullanim() { print 'Kullanım: ./kurulum.sh [--kuru] [--evet] [--bagimliliklar] [--skills] [--bin] [--mcp] [--remotion] [--claude-md] [--claude-md-kaldir] [--hooks] [--hepsi]'; }
for arg in "$@"; do
 case $arg in
 --kuru) kuru=1;; --evet) evet=1;; --bagimliliklar) bag=1;; --skills) skills=1;; --bin) bin=1;; --mcp) mcp=1;; --remotion) remotion=1;; --claude-md) claude_md=1;; --claude-md-kaldir) claude_md_kaldir=1;; --hooks) hooks=1;; --hepsi) bag=1; skills=1; bin=1; mcp=1; remotion=1; claude_md=1; hooks=1;; *) kullanim; exit 2;; esac
done
if (( claude_md && claude_md_kaldir )); then print -u2 "--claude-md ile --claude-md-kaldir birlikte kullanılamaz."; exit 2; fi
if (( ! (bag+skills+bin+mcp+remotion+claude_md+claude_md_kaldir+hooks) )); then
 if (( kuru )); then bag=1; skills=1; bin=1; mcp=1; remotion=1; claude_md=1; hooks=1; else kullanim; exit 2; fi
fi
if [[ $(uname -s) != Darwin ]]; then
 print -u2 'Bu kurulum yalnız macOS içindir. Linux desteklenmiyor; docs/kurulum.md içindeki elle adımlara bakın.'; exit 1
fi
if (( ! $+commands[brew] )); then
 print -u2 'Homebrew yok. Resmî Homebrew kurulum yönergesindeki komutu inceleyip kendiniz çalıştırın: https://brew.sh/'; exit 1
fi
if [[ ! -f "$repo/vendor/avenoxskills/skills/avenox-video/SKILL.md" ]]; then
 if (( kuru )); then print 'Gerekli: git submodule update --init --recursive';
 else command git submodule update --init --recursive || exit 1; fi
fi
if (( ! kuru && ! evet && (skills || bin || mcp || claude_md || claude_md_kaldir || hooks) )); then
 print -n 'Genel kullanıcı ayarları (~/.claude/skills, ~/.local/bin, Claude MCP, ~/.claude/CLAUDE.md ve hookify kuralı) değişecek. Onaylıyor musunuz? [e/H] '
 read -r yanit
 [[ $yanit == e || $yanit == E ]] || { print 'Kurulum iptal edildi.'; exit 1; }
fi
model_ayar="$HOME/.config/kurgu-sistemi/modeller.env"
if [[ ! -e $model_ayar ]]; then
 print "Model ayarı: $repo/config/modeller.ornek.env → $model_ayar"
 if (( ! kuru )); then mkdir -p -- "${model_ayar:h}"; cp -- "$repo/config/modeller.ornek.env" "$model_ayar"; fi
fi
yedek_tarihi=$(date '+%Y%m%d-%H%M%S')
run() { print -r -- "Komut: ${(q)@}"; (( kuru )) || "$@"; }
bagla() {
 local kaynak hedef yedek_kok ad yedek eski_hedef yedek_dizin
 kaynak=$1; hedef=$2; yedek_kok=$3; ad=${hedef:t}
 [[ -e $kaynak ]] || { print -u2 "Kaynak yok: $kaynak"; return 1; }
 if [[ -L $hedef && ${hedef:A} == ${kaynak:A} ]]; then print "Zaten bağlı: $hedef"; return 0; fi
 if [[ -L $hedef ]]; then
  eski_hedef=$(readlink "$hedef")
  yedek_dizin="$yedek_kok/$yedek_tarihi"
  print "Bağ yedeği: $hedef kaldırılacak; $ad -> $eski_hedef → $yedek_dizin/baglar.txt"
  if (( ! kuru )); then
   mkdir -p -- "$yedek_dizin"
   print -r -- "$ad -> $eski_hedef" >> "$yedek_dizin/baglar.txt"
   rm -- "$hedef"
  fi
 elif [[ -e $hedef ]]; then
  yedek_dizin="$yedek_kok/$yedek_tarihi"
  yedek="$yedek_dizin/$ad"
  while [[ -e $yedek || -L $yedek ]]; do yedek+="-1"; done
  print "Yedek: $hedef → $yedek"
  if (( ! kuru )); then mkdir -p -- "$yedek_dizin"; mv -- "$hedef" "$yedek"; fi
 fi
 print "Bağla: $hedef → $kaynak"
 if (( ! kuru )); then mkdir -p -- "${hedef:h}"; ln -s -- "$kaynak" "$hedef"; fi
}
# İşaretli genel kuralları korunan metnin içinde güncelle/sil.
claude_md_duzenle() {
 local hedef="$HOME/.claude/CLAUDE.md" yeni eski
 yeni=$(mktemp) || return 1
 if [[ -f $hedef ]]; then cp -- "$hedef" "$yeni" || return 1; else : > "$yeni"; fi
 python3 - "$yeni" "$repo/claude/CLAUDE.kurgu.md" "$claude_md_kaldir" <<'PYCLAUDE'
from pathlib import Path
import sys
path, source, remove = Path(sys.argv[1]), Path(sys.argv[2]), int(sys.argv[3])
text = path.read_text()
start, end = '<!-- kurgu-sistemi:basla -->', '<!-- kurgu-sistemi:bitis -->'
if text.count(start) != text.count(end) or text.count(start) > 1:
    raise SystemExit('Claude kural işaretleri bozuk; dosya değiştirilmedi.')
if start in text:
    a, b = text.index(start), text.index(end) + len(end)
    if b <= a: raise SystemExit('Claude kural işaretleri ters; dosya değiştirilmedi.')
    text = (text[:a].rstrip() + '\n' + text[b:].lstrip()).strip()
if not remove:
    text = (text.rstrip() + '\n\n' + source.read_text().strip()).strip()
path.write_text(text + '\n' if text else '')
PYCLAUDE
 local durum=$?
 if (( durum )); then rm -f -- "$yeni"; return $durum; fi
 if (( kuru )); then
  print "Claude genel kural farkı: $hedef"
  if [[ -f $hedef ]]; then diff -u --label "$hedef (mevcut)" --label "$hedef (önerilen)" "$hedef" "$yeni" || true; else diff -u --label "$hedef (mevcut)" --label "$hedef (önerilen)" /dev/null "$yeni" || true; fi
 else
  if [[ -f $hedef ]] && cmp -s -- "$hedef" "$yeni"; then print "Claude kuralları zaten güncel: $hedef"
  else
   mkdir -p -- "${hedef:h}"
   if [[ -f $hedef ]]; then
    local yedek="$hedef.yedek-$yedek_tarihi"
    while [[ -e $yedek ]]; do yedek+="-1"; done
    cp -- "$hedef" "$yedek" || return 1
    print "Yedek: $yedek"
   fi
   cp -- "$yeni" "$hedef" || return 1
   print "Claude kuralları güncellendi: $hedef"
  fi
 fi
 rm -f -- "$yeni"
}
if (( claude_md || claude_md_kaldir )); then claude_md_duzenle || exit 1; fi
if (( hooks )); then
 if [[ -d "$HOME/.claude/plugins/cache/claude-code-plugins/hookify" ]]; then
  bagla "$repo/hooks/hookify.video-hatti.local.md" "$repo/.claude/hookify.video-hatti.local.md" "$repo/.claude/hooks-yedek"
 else
  print 'hookify eklentisi yok; /plugin ile kurulabilir'
 fi
fi
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
  bagla "$repo/$kaynak" "$HOME/.claude/skills/$ad" "$HOME/.claude/skills-yedek"
 done < "$repo/skills/HARITA.md"
fi
if (( bin )); then for kaynak in "$repo"/bin/*; do bagla "$kaynak" "$HOME/.local/bin/${kaynak:t}" "$HOME/.local/bin-yedek"; done; fi
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

case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) print -u2 'UYARI: ~/.local/bin PATH içinde değil. ~/.zshrc dosyanıza şu satırı ekleyin: export PATH="$HOME/.local/bin:$PATH"' ;; esac
print '\nELLE YAPILACAKLAR (ayrıntı: docs/kurulum.md):'
[[ -d /Applications/FilmCraft.app && -x "$HOME/.local/bin/filmcraft-cli" ]] || print -r -- '- FilmCraft.app ve filmcraft-cli: resmî kaynaktan kurun.'
(( $+commands[agy] )) || print -r -- '- agy: kurup hesabınızla giriş yapın.'
[[ -f "$HOME/.codex/auth.json" ]] || print -r -- '- Codex: codex login ile giriş yapın.'
[[ -d "$HOME/.claude" ]] || print -r -- '- Claude: resmî giriş akışını tamamlayın.'
print -r -- '- Sony LUT: resmî LUT dosyasını edinip FilmCraft içinde tanıtın.'
print -r -- '- Montserrat: Remotion yüklemesini doğrulayın; gerekirse yazı tipini kurun.'
[[ -n "$(find "$repo/remotion/public/sfx" -type f -name '*.wav' -print -quit 2>/dev/null)" ]] || print -r -- '- SFX WAV: lisanslı ses dosyalarını remotion/public/sfx içine ekleyin.'
