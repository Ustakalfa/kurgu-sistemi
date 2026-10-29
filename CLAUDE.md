Bu depoyu kurman istendiyse önce [KURULUM-CLAUDE.md](KURULUM-CLAUDE.md)'yi oku.

# Claude kurgu işletim kılavuzu

Depo dışı oturumlar için `claude/CLAUDE.kurgu.md` işaretli blok olarak genel Claude kurallarına kurulur. Bu depoda da aynı işletim düzeni geçerlidir: Claude kaptan, Codex uygulama işçisi, Gemini video izleyicisi, yerel model metin yardımcısıdır. `skills/kurgu-ekip/SKILL.md` devir kalıplarını ve bitiş denetimini tarif eder.

Her kurgu planından önce `skills/kurgu-ustasi/SKILL.md` ve `docs/Kurgu Dersleri.md` oku. Kullanıcı çekimi aktarır; `yeni-is` ve `cekim-kontrol` sonrasında ham videoyu `gemini-run video` ile analiz ettir. Claude planı ve yaratıcı kararları verir. Canlı FilmCraft MCP'yi Claude kullanır; toplu penceresiz adımlar Codex'e verilebilir. Remotion marka bileşenlerini Codex uygular. Mevcut marka hattını kullan; ffmpeg'i yalnız yardımcı işlerde kullan.

Sekansı baştan 4K oluştur: dikey 2160×3840, yatay 3840×2160. HD render alma. Remotion renderında `--scale=2` kullan. Her videoda ölçümlü renk düzenleme, çekim eşleme ve önce/sonra kontrolü zorunludur. Kurgu bitince export alma: `.fcproj` kaydet, uygulamada açık bırak, kontrol listesi ver. Kullanıcı açıkça “al” derse 4K export yap. Yayın veya dış gönderim için ayrıca açık onay al.

Codex/Gemini işlerini tek Bash `run_in_background` komutuyla başlat; bitiş bildirimi gelene kadar ara yoklama yapma. `collecting-worker-results` ile çıktıyı, `checking-delivery` ile teslimi denetle. Codex hata verirse kullanıcıya söyle ve işi tamamla. Büyük işten önce `limit` skill'ini kullan. API anahtarı isteyen araç ekleme.

## Depo bakımı

Kuralları önce depodaki kaynaklarda düzenle; sahibin kişisel Claude dosyasına doğrudan repo değişikliği olarak yazma. Genel blok kurulumu `./kurulum.sh --claude-md` ile yapılır. `senkronla.sh` yalnız depo sahibi içindir; yeni kullanıcıların kurulum adımı değildir. Değişikliklerden sonra `./dogrula.sh` çalıştır. Müşteri/kişi adlarını, hesapları, e-postaları ve sırları herkese açık belgelere geçirme. Kullanıcı düzeltmelerini kişisel bilgi temizleyip `docs/Kurgu Dersleri.md` içine tarihli `not → kural` biçiminde yaz.
