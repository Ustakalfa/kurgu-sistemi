#!/usr/bin/env zsh
set -u
setopt null_glob pipe_fail
repo=${0:A:h}; hata=0; gecici=$(mktemp -d)
trap 'rm -rf -- "$gecici"' EXIT
cd "$repo" || exit 1
for komut in git grep python3; do
 if (( ! $+commands[$komut] )); then
  print -u2 "Gerekli araç yok: $komut"
  ((hata++))
 fi
done
liste() {
 git ls-files -co --exclude-standard | while IFS= read -r dosya; do
  [[ $dosya == vendor/* || $dosya == remotion/node_modules/* ]] && continue
  print -r -- "$dosya"
 done
}
if (( $+commands[git] && $+commands[grep] && $+commands[python3] )); then
while IFS= read -r dosya; do
 [[ -f $dosya ]] || continue
 bas=$(head -1 "$dosya")
 case $bas in *bash*) bash -n "$dosya" || ((hata++));; *zsh*) zsh -n "$dosya" || ((hata++));; esac
done < <(liste | grep -E '(^|/)[^/]+\.sh$|^bin/')
while IFS= read -r dosya; do
 [[ -f $dosya ]] || continue
 [[ $dosya == *.py || $(head -1 "$dosya") == *python* ]] || continue
 PYTHONPYCACHEPREFIX="$gecici" python3 -m py_compile "$dosya" || ((hata++))
done < <(liste | grep -E '(^|/)[^/]+\.py$|^bin/')
while IFS= read -r dosya; do
 [[ -f $dosya ]] || continue
 python3 -m json.tool "$dosya" >/dev/null || ((hata++))
done < <(liste | grep -E '(^|/)[^/]+\.json$')
for isaret in '<!-- kurgu-sistemi:basla -->' '<!-- kurgu-sistemi:bitis -->'; do
 grep -F -x -q -- "$isaret" claude/CLAUDE.kurgu.md || { print "Claude kural işareti eksik: $isaret"; ((hata++)); }
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
# Tarama metin dosyalarıyla sınırlıdır; eşleşen satırın kendisi rapora yazılmaz.
desen='Güncel Kafalar|guncel kafalar|Çekme Felek|cekme felek|Müfredat|mufredat|Macera Park|Coldwell|Yükseller|/Users/ustakalfa|api[_-]?key[[:space:]]*[:=][[:space:]]*[A-Za-z0-9]{12,}|sk-[A-Za-z0-9]{20,}'
: > "$gecici/tarama"
while IFS= read -r dosya; do
 [[ $dosya == senkronla.sh || $dosya == dogrula.sh || ! -f $dosya ]] && continue
 grep -E -i -l -- "$desen" "$dosya" >> "$gecici/tarama" 2>/dev/null || [[ $? == 1 ]] || { print -u2 "Taranamadı: $dosya"; ((hata++)); }
done < <(liste)
if [[ -s $gecici/tarama ]]; then
 print 'Gizlilik taraması: eşleşen dosyalar:'; cat "$gecici/tarama"; ((hata++))
fi
fi
print "Doğrulama: $([[ $hata == 0 ]] && print GEÇTİ || print BAŞARISIZ) ($hata hata)"
(( hata == 0 ))
