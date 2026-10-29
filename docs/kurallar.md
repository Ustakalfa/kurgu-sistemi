# Video üretim kuralları

## 20–21 Ekim 2026 — Sorumluluk ve akış

Kullanıcı bütün Reels ve normal videoların kurgusunu Claude'a verdi. Gerekçe: mevcut `remotion/` ev stili atlanınca sonuç beklentiyi karşılamadı. Claude Opus plan ve denetimden, Codex uygulamadan sorumludur. Gemini ham videoyu izleyip en iyi anları ve zaman kodlarını çıkarır; yerel Ollama döküm temizleme gibi yardımcı işleri yapar. Kullanıcı çekimi kendisi aktarır; otomatik aktarım kurulmaz. Önce deponun `remotion/` hattı, `src/Reels07.tsx`, `src/marka.ts` ve ses kataloğu kullanılır. Kurgu FilmCraft 0.10.0 üzerinden yürür.

## 21 Ekim 2026 — Teslim

Kurgu tamamlanınca FilmCraft `.fcproj` dosyası kaydedilir ve kullanıcıya kontrol için gösterilir. Kullanıcı “al” veya “oldu, sen al” demedikçe export yapılmaz. Gerekçe: son kalite ve teslim kararı kullanıcıdadır; erken export zaman ve hata riskidir. Doğrulamada tam export yerine kare renderı kullanılır.

## 28 Ekim 2026 — 4K

Her video çıktısı 4K olur: dikey 2160×3840, yatay 3840×2160. HD render yapılmaz; sekans baştan 4K kurulur. Gerekçe: HD kalite beklentisini karşılamaz. Yatay 4K kaynaktan dikey kırpmanın doğal genişliği yaklaşık 1215 piksel olduğundan büyütme gereksinimi kullanıcıya açıkça söylenir. Kapaklar da en az 2160×3840 hazırlanır.

## 28 Ekim 2026 — Zorunlu renk

Her klip teslimden önce renk düzenlemesinden geçer. S-Log3 ise Sony resmî LUT uygulanır. Scopes ile waveform, parade ve vektörskop ölçülerek pozlama, beyaz denge ve ten rengi düzeltilir. Dikkat dağıtan parlak alanlar bastırılır; farklı çekimler `lumetri.applyMatch` ile eşleştirilir. En son hafif marka look'u uygulanır; önce/sonra kareleri kontrol edilir ve gösterilir. 8 bit kaynakta sert grade yapılmaz. Gerekçe: düzeltilmemiş ham kayıt profesyonel görünmez. Bu işlem export onayı yerine geçmez.
