---
name: kurgu-ekip
description: "Video kurgu işinde ya da Codex, Gemini veya yerel modele iş devrederken kullan."
---

# Kurgu ekibi

Claude rota, yaratıcı karar ve denetim sahibidir. Codex uygulama işçisidir; Gemini videoyu izler; yerel model düşük riskli metni temizler. FilmCraft canlı MCP işlemlerini Claude yapar; doğrulanmış penceresiz adım dosyasını Codex çalıştırabilir.

## Codex'e brief ve devir

Brief dosyasında şu başlıkları doldur: **Görev**, **Kaynaklar**, **Yazılacak dosyalar**, **Yasaklar**, **Kontrol**, **Rapor biçimi**. Kaynakların gerçek yolunu ve izinli yazma alanını açıkça belirt. Brief'i tek tırnaklı heredoc ile dosyaya yaz; çift tırnaklı metindeki ters tırnak ve `$(...)` kabuk ikamesi tehlikelidir.

Claude Code Bash aracında `run_in_background` ile tek komut çalıştır:

```sh
cd <iş klasörü> && codex-run <tür> "$(cat brief.md)" -s workspace-write > log 2>&1
```

Salt okuma için `-s read-only` kullan. `basit` kısa yanıt, `hafif` okuma, `orta` sade yazma, `ana` kod ve analiz, `ana2` ikinci paralel iş, `derin` karmaşık iş; `astra` yalnız kullanıcı isterse. Zincirler `$HOME/.config/kurgu-sistemi/modeller.env` içindedir. İşe ara yoklama yapmadan bitiş bildirimini bekle. İptalde önce sarmalayıcı zsh, sonra alt `codex exec` sürecini durdur. Git işlemlerini Claude yapar; Codex sandbox'ı `.git` oluşturamaz.

## Video ve yerel metin

```sh
gemini-run video 'Zaman kodlu en iyi anları, ekrandaki yazıları ve ses sorunlarını listele.' -d <01-ham> > video-analiz.md 2> video-analiz.log
cat döküm.txt | yerel-run temizle - > döküm-temiz.txt
```

Gemini için de Claude Code Bash `run_in_background` ile tek komut başlat; bitişi bekle. Yerel modele yaratıcı metin veya müşteri metni yazdırma. Çıktıları Claude doğrular.

## İş sırası

| Aşama | Sorumlu |
| --- | --- |
| `yeni-is` | Claude brief ve klasör |
| `cekim-kontrol` | Codex uygulama, Claude rapor denetimi |
| `gemini-run video` | Gemini izler, Claude bulguyu okur |
| Kurgu planı | Claude; önce `kurgu-ustasi` ve Kurgu Dersleri |
| FilmCraft | Claude MCP canlı mod; toplu penceresiz adımlar Codex'e verilebilir |
| Renk | Claude MCP; her videoda zorunlu |
| Remotion marka katmanı | Codex; mevcut tasarım ve 4K |
| `.fcproj` teslim | Claude kaydeder, uygulamada açık bırakır; export yok |
| Onay | Kullanıcı kontrol eder ve açıkça “al” der |
| 4K export | Yalnız onaydan sonra Claude; dikey 2160×3840 / yatay 3840×2160 |
| Ders kaydı | Claude; tarihli, kişisel bilgi temizlenmiş `not → kural` |

## Bitiş denetimi ve hata

Logu, gerçek dosyaları ve `collecting-worker-results` skill'ini incele. Türkçe karakter, boş dosya/yol, zaman kodu, 4K sekans, renk öncesi/sonrası ve `.fcproj` teslimini kontrol et. Düzeltmeyi aynı işçiye net brief ile geri ver. Teslimden önce `checking-delivery` uygula; kullanıcıya sonucu sormadan göster.

`codex-run` yoksa veya hata verirse kullanıcıya bildirip uygulamayı Claude tamamlar. `gemini-run`/`agy` yoksa video izlemenin yapılamadığını açıkça bildir; izlenmiş gibi karar verme, kurulumu veya kullanıcıdan zaman kodlu gözlem almayı iste. `yerel-run`/Ollama yoksa kısa metin işini Claude denetiminde başka uygun araçla yap. FilmCraft yoksa `.fcproj` teslimi yapılamadığını bildir; komut ya da parametre uydurma. Görsel için `codex-img` tek üretimdir; varyantları yerelde türet, logo/görseli kodla çizme.
