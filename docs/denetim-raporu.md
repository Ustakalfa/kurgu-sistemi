# Doğruluk Denetimi Raporu

Denetim tarihi: **2026-10-29**. Bu tur, geri yüklenen ayrıntılı belgelere yerinde düzeltme uygular. Satır sayıları ayrıca denetlenir.

## Doğrulanan ve uygulanan bulgular

| Belge | Bulgu ve düzeltme | Kaynak |
|---|---|---|
| README | Sabit gelecek tarihli iş yolu tarih yer tutucusuna çevrildi. | `bin/yeni-is` tarih ve klasör üretimi |
| README | Claude kaptan, Codex işçi, Gemini göz akışı; kurgu-ekip ve kurulum seçenekleri eklendi. | `claude/CLAUDE.kurgu.md`, `skills/kurgu-ekip/SKILL.md`, `kurulum.sh` |
| mimari | Claude'un FilmCraft MCP ile kurgu ve rengi yürüttüğü; Codex'in verilen penceresiz adım dosyasını yürütebildiği netleşti. | İŞ-1 kural bloğu ve skill'ler |
| mimari | Kısa `applyMatch` kimliği `lumetri.applyMatch` olarak düzeltildi. | `remotion/araclar/filmcraft-komutlar.txt` |
| mimari | İş klasörü tarihi yer tutucu oldu; `.fcproj` ve onaylı çıktı yolları korundu. | `bin/yeni-is` |
| kurulum | `--claude-md`, `--claude-md-kaldir`, `--hooks` ve `--hepsi` etkisi eklendi. | `kurulum.sh` seçenek ayrıştırması ve işlevleri |
| araçlar | Gelecek tarihli örnek iş yolu yer tutucu oldu. | `bin/yeni-is` |
| filmcraft | Renk eşleme komutunun tam kimliği ve `render_frame` MCP aracı kimliği açıklandı. | Komut kataloğu; FilmCraft MCP araç yüzeyi |
| filmcraft | Kesme zamanının tick tanımı ve MCP/CLI takma adları açıklandı. | `timeline.razor` tanımı; MCP sunucu talimatı |
| remotion | `--scale=2` kesin kural ve onay sonrası nihai render belirtildi. | `remotion/package.json`, @remotion/cli `scaleOption` doğrulaması |
| sorun giderme | `render_frame` CLI listesinde bulunmamasının nedeni ve kesme zamanı açıklandı. | FilmCraft MCP araç yüzeyi ve komut tanımı |
| örnek iş | Tarih yer tutucu, tam komut kimliği ve onay sonrası 4K render açıklandı. | `bin/yeni-is`, komut kataloğu, `remotion/package.json` |
| ekip düzeni | Ayrıntılı rol ve model tabloları korunarak İŞ-1 kural bloğu, skill ve kurulum bağı başa eklendi. | `claude/CLAUDE.kurgu.md`, `skills/kurgu-ekip/SKILL.md`, `kurulum.sh` |
| Claude bloğu | Kurgu Dersleri yolu depo dışından çalışan Claude için `KURGU_DERSLERI` veya depo yolu olarak iki yerde netleşti. | `skills/kurgu-ustasi/SKILL.md` |
| yerel değişiklikler | Taşınabilirlik farkları ve salt okunur vendor ilkesi korundu. | `bin/yeni-is`, `kurulum.sh`, depo düzeni |

## Geri alınan yanlış bulgular

- **`render_frame` yok — geri alındı:** `render_frame`, `filmcraft-cli commands` komutu değil FilmCraft MCP sunucusunun aracıdır. Renk önce/sonra ve kritik kare kontrolünde kalır.
- **`timeline.razor` yalnız tick kabul eder — geri alındı:** komut tanımında `time` tick (254016000000 tick/sn) ister; FilmCraft MCP sunucusu ve CLI komut çağrıları `seconds`, `frame` veya `timecode` takma adlarını da kabul eder.
- **Remotion `--scale` doğrulanmadı — geri alındı:** @remotion/cli içindeki `scaleOption` doğrulandı. `--scale=2` 4K render kuralıdır.

## Kaynak ve sınırlar

- FilmCraft komut kataloğu `remotion/araclar/filmcraft-komutlar.txt`, yerel komutların adlarını ve tanımdaki alanlarını verir. MCP araçları bu listeden ayrı bir yüzeydir.
- `bin/yeni-is`, tarihli `$HOME/Movies/Isler/<YYYY-AA-GG>_<musteri>_<is>/` ağacını ve `00-brief`–`06-teslim` dizinlerini üretir; iş klasörü yolu `YENI_IS_KOK` ile değiştirilebilir.
- `remotion/package.json` içindeki `render` betiği `remotion render` çağırır; kaynak kompozisyon ölçüleri `remotion/src/Root.tsx` içindedir.
- `kurulum.sh` güncel seçenek yüzeyi yetkilidir; `--claude-md-kaldir`, `--hepsi` kapsamında değildir.
- Dış araçların resmi indirme URL'leri depo içinde kaynaklanmadığı yerlerde belge uydurma URL vermez.
- `paralaks.py`, `filmcraft-mcp.py`, `sfx-hazirla.py` ve `sfx-olc.py` gibi araçlarda genel `--help` varsayımı yerine kaynak kodundaki argümanlar esas alınır.
- `docs/surumler.md` bu turda değiştirilmedi.

## Bu turun koruma ilkesi

Ayrıntılı belge bölümleri yerinde tutuldu; yalnız yanlış satırlar düzeltildi veya eksik bilgi eklendi. Her README ve `docs/*.md` dosyasının önce/sonra satır sayısı iş raporunda karşılaştırılır; hiçbir dosya önceki sayısının %95 altına inmemelidir. `vendor/` yalnız okundu; Git çalıştırılmadı.
