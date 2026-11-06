#!/usr/bin/env zsh
# Yalnız depo sahibi için: kişisel canlı kaynakları bu depoya eşitler.
# GÜVENLİK: Yalnız git ile izlenen Remotion dosyaları güncellenir; yeni canlı
# dosyalar otomatik kopyalanmaz. Korunan dosyalar asla ezilmez. Her dosya
# gizlilik deseniyle taranır. --kuru seçeneği yazmadan listeler.
set -euo pipefail
repo=${0:A:h}
kaynak=${KURGU_CANLI_KAYNAK:-"$HOME/Desktop/02 Projeler/Nexus Video"}
[[ -d $kaynak ]] || { print -u2 'Kaynak klasör yok; bu betik deponun sahibine özeldir.'; exit 1; }

# --- Seçenek: --kuru ---
kuru=0
for arg in "$@"; do
  [[ $arg == --kuru ]] && kuru=1
done

ortak=(--archive --exclude='.DS_Store' --exclude='__pycache__/' --exclude='*.wav' --exclude='*.mp4' --exclude='*.mov' --exclude='*.mxf' --exclude='.npmrc' --exclude='node_modules/' --exclude='.env*' --exclude='*.fcproj' --max-size=50m)

# --- Yardımcı işlevler ---
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

# --- Korunan dosya listesi ---
korunan_dosyalar=()
koruma_listesi="$repo/config/senkron-korunan.txt"
if [[ -f $koruma_listesi ]]; then
 while IFS= read -r satir; do
  satir=${satir%%#*}      # yorum sil
  satir=${${satir##[[:space:]]#}%%[[:space:]]#}  # baş/son boşluğu kırp (yol içi boşluk korunur)
  [[ -z $satir ]] && continue
  korunan_dosyalar+=("$satir")
 done < "$koruma_listesi"
fi

korunan_mi() {
 local hedef=$1
 for k in "${korunan_dosyalar[@]}"; do
  [[ $hedef == $k ]] && return 0
 done
 return 1
}

# --- Gizlilik deseni yükle ---
# Depo içindeki genel desen: mutlak kullanıcı yolu, API anahtar kalıpları, sk- anahtarları, e-posta
genel_desen='/Users/[^/$][^/$]+/|api[_-]?key[[:space:]]*[:=][[:space:]]*[A-Za-z0-9]{12,}|sk-[A-Za-z0-9]{20,}'
# Yerel ek desenler (kişiye özel, depo dışı)
yerel_desenler=()
yerel_desen_dosyasi="$HOME/.config/kurgu-sistemi/gizli-desenler.txt"
if [[ -f $yerel_desen_dosyasi ]]; then
 while IFS= read -r satir; do
  satir=${satir%%#*}
  [[ -z ${satir// /} ]] && continue
  yerel_desenler+=("$satir")
 done < "$yerel_desen_dosyasi"
else
 print "UYARI: Yerel gizli desen dosyası yok: $yerel_desen_dosyasi"
fi

gizlilik_tara() {
 local dosya=$1
 [[ -f $dosya ]] || return 0
 if grep -qE "$genel_desen" "$dosya" 2>/dev/null; then
  print "UYARI — Gizlilik deseni eşleşti (kopyalanmadı): $dosya"
  return 1
 fi
 for desen in "${yerel_desenler[@]}"; do
  if grep -qEi -- "$desen" "$dosya" 2>/dev/null; then
   print "UYARI — Yerel gizlilik deseni eşleşti (kopyalanmadı): $dosya"
   return 1
  fi
 done
 return 0
}

# --- Git ile izlenen Remotion dosya listesi ---
izlenen_dosyalar=()
while IFS= read -r dosya; do
 izlenen_dosyalar+=("$dosya")
done < <(git -C "$repo" ls-files remotion/ 2>/dev/null)

# --- Remotion dosyalarını güvenli güncelle ---
yeni_canli_dosyalar=()
for izlenen in "${izlenen_dosyalar[@]}"; do
 # Tekil dosya için canlıdaki karşılık yolu belirle
 depo_yol="$repo/$izlenen"
 # Dosyanın remotion/ içindeki göreli yolunu al
 goreli="${izlenen#remotion/}"
 canli_yol="$kaynak/$goreli"
 [[ -f $canli_yol ]] || continue

 # Korunan dosya mı?
 if korunan_mi "$izlenen"; then
  if farkli_mi "$depo_yol" "$canli_yol"; then
   print "Korunan dosya farklı (elle birleştir): $izlenen"
  fi
  continue
 fi

 # Farklı mı?
 farkli_mi "$depo_yol" "$canli_yol" || continue

 # Gizlilik tarama
 gizlilik_tara "$canli_yol" || continue

 # Kopyala (ya da kuru modda listele)
 if (( kuru )); then
  print "KOPYALANACAK: $canli_yol → $depo_yol"
 else
  mkdir -p "${depo_yol:h}"
  rsync --archive -- "$canli_yol" "$depo_yol"
  print "güncellendi: $izlenen"
 fi
done

# --- Canlıda olup depoda izlenmeyen yeni dosyaları raporla ---
for canli_alt in src araclar public/logo public/sfx; do
 [[ -d $kaynak/$canli_alt ]] || continue
 while IFS= read -r canli_dosya; do
  goreli_canli="${canli_dosya#$kaynak/$canli_alt/}"
  depo_esit="remotion/$canli_alt/$goreli_canli"
  bulundu=0
  for iz in "${izlenen_dosyalar[@]}"; do
   [[ $iz == $depo_esit ]] && { bulundu=1; break }
  done
  (( bulundu )) || yeni_canli_dosyalar+=("$canli_dosya")
 done < <(find "$kaynak/$canli_alt" -type f 2>/dev/null)
done

for yeni in "${yeni_canli_dosyalar[@]}"; do
 print "Yeni canlı dosya (elle karar ver): $yeni"
done

# --- bin/ ve skills/ bağ raporu (mevcut davranış korunuyor) ---
for depo in "$repo"/bin/*(.N); do
 ad=${depo:t}
 bag_durumunu_yaz "$ad" "$depo" "$HOME/.local/bin/$ad"
done
for depo in "$repo"/skills/*(/N); do
 ad=${depo:t}
 bag_durumunu_yaz "$ad" "$depo" "$HOME/.claude/skills/$ad"
 bag_durumunu_yaz "$ad" "$depo" "$kaynak/.claude/skills/$ad"
done

if (( kuru )); then
 print 'Kuru mod: hiçbir dosya yazılmadı. docs ve vendor her zaman korunur.'
else
 print 'Canlı kaynaklar eşitlendi (yalnız izlenen dosyalar); docs ve vendor korunur. ./dogrula.sh çalıştırın.'
fi
