#!/usr/bin/env zsh
set -u
setopt null_glob pipe_fail
repo=${0:A:h}; hata=0; gecici=$(mktemp -d)
trap 'rm -rf -- "$gecici"' EXIT
cd "$repo" || exit 1
for komut in grep python3; do
 if (( ! $+commands[$komut] )); then
  print -u2 "Gerekli araç yok: $komut"
  ((hata++))
 fi
done

# --- Dosya listesi: git > rg > find (sırayla) ---
liste() {
 if (( $+commands[git] )) && git -C "$repo" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$repo" ls-files -co --exclude-standard | while IFS= read -r dosya; do
   [[ $dosya == vendor/* || $dosya == remotion/node_modules/* ]] && continue
   [[ -f $dosya ]] && print -r -- "$dosya"
  done
 elif (( $+commands[rg] )); then
  rg --files --hidden -g '!.git' | while IFS= read -r dosya; do
   [[ $dosya == vendor/* || $dosya == remotion/node_modules/* ]] && continue
   print -r -- "$dosya"
  done
 else
  find . -type f \
   -not -path './.git/*' \
   -not -path './vendor/*' \
   -not -path './remotion/node_modules/*' | sed 's|^\./||'
 fi
}

# Liste boş mu denetle
liste_ciktisi=$(liste)
if [[ -z $liste_ciktisi ]]; then
 print -u2 'HATA: Dosya listesi boş çıktı; tarama yapılamadı.'
 ((hata++))
fi

if (( $+commands[grep] && $+commands[python3] )); then
while IFS= read -r dosya; do
 [[ -f $dosya ]] || continue
 bas=$(head -1 "$dosya")
 case $bas in *bash*) bash -n "$dosya" || ((hata++));; *zsh*) zsh -n "$dosya" || ((hata++));; esac
done < <(print -r -- "$liste_ciktisi" | grep -E '(^|/)[^/]+\.sh$|^bin/')
while IFS= read -r dosya; do
 [[ -f $dosya ]] || continue
 [[ $dosya == *.py || $(head -1 "$dosya") == *python* ]] || continue
 PYTHONPYCACHEPREFIX="$gecici" python3 -m py_compile "$dosya" || ((hata++))
done < <(print -r -- "$liste_ciktisi" | grep -E '(^|/)[^/]+\.py$|^bin/')
while IFS= read -r dosya; do
 [[ -f $dosya ]] || continue
 python3 -m json.tool "$dosya" >/dev/null || ((hata++))
done < <(print -r -- "$liste_ciktisi" | grep -E '(^|/)[^/]+\.json$')
for isaret in '<!-- kurgu-sistemi:basla -->' '<!-- kurgu-sistemi:bitis -->'; do
 grep -F -x -q -- "$isaret" claude/CLAUDE.kurgu.md || { print "Claude kural işareti eksik: $isaret"; ((hata++)); }
done

# FilmCraft sürüm denetimi: sürüm uyumsuzluğu UYARI (hata değil)
beklenen_surum='filmcraft-cli 0.17.1'
if [[ -x "$HOME/.local/bin/filmcraft-cli" ]]; then
 surum=$("$HOME/.local/bin/filmcraft-cli" --version 2>/dev/null)
 [[ $surum == $beklenen_surum ]] || print "UYARI: FilmCraft CLI beklenen sürüm '$beklenen_surum', bulunan: '$surum'"
fi

for arac in filmcraft-ac filmcraft-kopru; do
 [[ -x "$HOME/.local/bin/$arac" ]] || { print "FilmCraft başlatıcısı yok: $arac"; ((hata++)); }
done
[[ -x bin/craft-ac ]] || { print 'Craft başlatıcısı yok: bin/craft-ac'; ((hata++)); }
for arac in effectcraft soundcraft vectorcraft photocraft; do
 cli="$HOME/.local/bin/$arac-cli"
 if [[ ! -x $cli ]] || ! "$cli" --version >/dev/null 2>&1; then
  print "UYARI: $arac-cli sürüm komutu çalışmadı"
 fi
done
[[ -f skills/kurgu-ekip/SKILL.md ]] || { print 'kurgu-ekip skill dosyası yok'; ((hata++)); }
for dosya in skills/*/SKILL.md(N); do
 head -30 "$dosya" | grep -q '^name:' || { print "name eksik: $dosya"; ((hata++)); }
 head -30 "$dosya" | grep -q '^description:' || { print "description eksik: $dosya"; ((hata++)); }
done
while IFS='|' read -r _ _ kaynak _; do
 kaynak=${${kaynak## }%% }
 [[ $kaynak == skills/* || $kaynak == vendor/* ]] || continue
 [[ -e $kaynak ]] || { print "Harita yolu yok: $kaynak"; ((hata++)); }
done < skills/HARITA.md
# Mevcut SessionStart kancasını koruyarak ekleme, tekrar ve kaldırma.
python3 - "$repo/araclar/kanca.py" "$gecici" <<'PYK'
import importlib.util
import json
from pathlib import Path
import sys
spec = importlib.util.spec_from_file_location('kanca', sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
path = Path(sys.argv[2]) / 'settings.json'
original = {'hooks': {'SessionStart': [{'hooks': [{'type': 'command', 'command': 'diger-komut'}]}]}, 'other': 1}
path.write_text(json.dumps(original))
command = '/ornek/.local/bin/kurgu-guncelle --sessiz'
first = module.duzenle(json.loads(path.read_text()), command)
second = module.duzenle(first, command)
assert first == second
assert len(second['hooks']['SessionStart']) == 2
assert module.duzenle(second, command, True) == original
PYK
[[ $? == 0 ]] || ((hata++))

# --- Gizlilik deseni ---
# Genel desen: mutlak kullanıcı yolu (/Users/<ad> ama /Users/<ad> veya $HOME yer tutucularını yakalamasın),
# API anahtar/token kalıpları, sk- anahtarları.
# Kişi adlarını, e-posta adreslerini içeren yerel desen dosyası depo DIŞINDA tutulur.
genel_desen='/Users/[^/$][^/$]+/|api[_-]?key[[:space:]]*[:=][[:space:]]*[A-Za-z0-9]{12,}|sk-[A-Za-z0-9]{20,}'
yerel_desenler=()
yerel_desen_dosyasi="$HOME/.config/kurgu-sistemi/gizli-desenler.txt"
if [[ -f $yerel_desen_dosyasi ]]; then
 while IFS= read -r satir; do
  satir=${satir%%#*}
  [[ -z ${satir// /} ]] && continue
  yerel_desenler+=("$satir")
 done < "$yerel_desen_dosyasi"
else
 print "UYARI: Yerel gizli desen dosyası yok: $yerel_desen_dosyasi (kişisel ek desenler taranmıyor)"
fi

: > "$gecici/tarama"
while IFS= read -r dosya; do
 # dogrula.sh ve senkronla.sh kendi desen satırları yüzünden muaf
 [[ $dosya == dogrula.sh || $dosya == senkronla.sh || ! -f $dosya ]] && continue
 # Genel desen
 if grep -qE "$genel_desen" "$dosya" 2>/dev/null; then
  print -r -- "$dosya" >> "$gecici/tarama"
  continue
 fi
 # Yerel desenler
 for desen in "${yerel_desenler[@]}"; do
  if grep -qEi -- "$desen" "$dosya" 2>/dev/null; then
   print -r -- "$dosya" >> "$gecici/tarama"
   break
  fi
 done
done < <(print -r -- "$liste_ciktisi")
if [[ -s $gecici/tarama ]]; then
 print 'Gizlilik taraması: eşleşen dosyalar:'; cat "$gecici/tarama"; ((hata++))
fi
fi
print "Doğrulama: $([[ $hata == 0 ]] && print GEÇTİ || print BAŞARISIZ) ($hata hata)"
(( hata == 0 ))
