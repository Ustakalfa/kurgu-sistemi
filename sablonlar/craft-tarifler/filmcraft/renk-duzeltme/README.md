# Renk düzeltme

`renk-tarif.jsonl` LUT'u uygular, `look-tarif.jsonl` ayrı görünüm ayarıdır. İkisi de örnek projedeki klip ID 15'e göre yazılmıştır; kendi projende ID'yi değiştir. `renk-duzeltme.cube` ölçülmüş 17³ LUT'tur; kaynakta üretim betiği yoktu.

Piksel bazlı orta alan mutlak RGB farkı önce 21,4/18,6/24,3, düzeltme sonrası 7,9/3,0/10,5, look sonrası 9,5/2,9/11,2. Hedef <6 kırmızı ve mavide tutmadı. Kanal eğrileriyle düzelt; bölge ortalamaları tek başına yeterli değil.
