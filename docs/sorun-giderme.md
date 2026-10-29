# Sorun Giderme

Önce hatanın tam çıktısını, çalıştırılan komutu, çalışma dizinini ve araç sürümünü kaydedin. Ham medyaya yazmayın; belirsiz yazma işlemini başka araçla otomatik yinelemeyin.

| Belirti | Olası neden | Çözüm |
|---|---|---|
| komut bulunamadı | `~/.local/bin` PATH'te değil | `which`, `echo $PATH`, sembolik bağı kontrol et |
| alt modül klasörü boş | recursive clone yapılmadı | `git submodule update --init --recursive` |
| kurulum seçenek göstermiyor | seçeneksiz çağrı | `./kurulum.sh --kuru` veya açık bölüm seç |
| Homebrew paket hatası | eski formül/indeks | `brew bundle --file Brewfile` çıktısındaki ilk hatayı çöz |
| `agy` yok | dış araç kurulmadı | resmi kaynaktan `~/.local/bin/agy` yerleşimini doğrula |
| Codex giriş istiyor | oturum yok/süresi doldu | CLI yardımındaki güncel giriş akışını kullan |
| Ollama yanıt vermiyor | servis kapalı | `brew services start ollama`; sonra `ollama list` |
| model bulunamadı | pull yapılmadı | kurulumdaki iki `ollama pull` komutunu çalıştır |
| Whisper modeli yok | indirme yarım | `~/.local/share/whisper-cpp/models/ggml-small.bin` boyutunu denetle |
| Whisper Türkçeyi yanlış algılıyor | dil otomatik/yanlış ses | 16 kHz mono WAV ve `-l tr`; özel adları elle düzelt |
| transkript JSON yok | whisper komutu başarısız | stderr, model yolu ve WAV açılabilirliğini kontrol et |
| `cekim-kontrol` video bulmuyor | uzantı destek dışı/yanlış klasör | kaynak uzantısını ve klasörü kontrol et |
| rapor başka yere yazıldı | hedef korumalı/yazılamıyor | uyarıdaki cwd çıktısını kullan veya `--cikti` ver |
| Gemini katmanı çalışmadı | kota, agy, klasör | CSV günlüğü ve `-d` yolunu kontrol et |
| MCP listede yok | kayıt yapılmadı | `./kurulum.sh --mcp` |
| MCP bağlanmıyor | FilmCraft köprüsü kapalı | uygulamayı `open -a FilmCraft --args --control 9876` ile aç |
| port dolu | başka süreç 9876 kullanıyor | süreci belirle; rastgele öldürmeden sahipliğini doğrula |
| FilmCraft komutu parametre reddediyor | sürüm/şema farkı | `filmcraft-komutlar.txt` satırını tekrar oku |
| adım dosyası yarıda kaldı | bir MCP çağrısı hata verdi | mevcut proje durumunu oku; tamamını kör tekrar etme |
| çevrimdışı medya | taşınmış kaynak | proje içindeki yolu yeniden bağla; hamı kopyalama |
| ses kayıyor | fps veya örnekleme farkı | baş/orta/son senkron, 48 kHz ve gerçek fps kontrolü |
| LUT görünmüyor | yanlış LUT klasörü | FilmCraft'ın sürüme özgü LUT yolunu uygulama içinden doğrula |
| görüntü fazla kontrastlı | çift LUT/dönüşüm | teknik dönüşüm zincirini tekilleştir |
| scope ve görüntü uyuşmuyor | yanlış seçili klip/katman | oynatma kafası ve etkin efektleri kontrol et |
| altyazı taşmış | satır uzun/güvenli alan dışı | satırı böl, fontu ve alt boşluğu düzelt |
| SFX bulunamadı | katalog adı yanlış/WAV yok | `katalog.json` kaydı ve public dosyasını kontrol et |
| Remotion tip hatası | props/import uyumsuz | `npm run tip`te ilk hatadan başla |
| Remotion varlık 404 | public yolu yanlış | `staticFile` yolunu public köküne göre yaz |
| render belleği doluyor | 4K, uzun kompozisyon, paralellik | uygulamaları kapat; bölümlü render/proxy; CLI yardımından concurrency doğrula |
| render siyah kare | kaynak decode veya Sequence aralığı | sorunlu kareyi Studio'da aç, kaynak codec'i kontrol et |
| render ses yok | Audio kaynağı/codec | statik yol, kanal ve ffprobe ile çıktı akışını kontrol et |
| `npm ci` başarısız | Node sürümü/lock | `remotion/NODE_SURUMU.md`de doğrulanmış sürüme dön |
| font yüklenmiyor | ağ/önbellek | ilk çalışmayı ağ varken yap; lisanslı yerel alternatifi doğrula |
| nexus seçim boş | model yanıtı/limit | `--model yok` ile şablon oluştur, elle doldur |
| seçimler çakışıyor | zaman aralıkları kesişiyor | uyarıdaki atlanan aralıkları düzelt |
| loudnorm ölçümü yok | ses akışı/ffmpeg | ffprobe ile ses akışını ve ffmpeg stderr'ini incele |
| `dogrula.sh` gizli içerik buldu | kamu dosyasına veri sızdı | satırı kaldır, yer tutucu kullan, tekrar tara |
| yedek geri gelmedi | `.yedek-* ` hedefi var | bağlantıyı doğrula, doğru zaman damgalı yedeği seç |
| disk hızla doluyor | proxy/render/model | türetilmişleri ayır; onaylı teslimi koruyarak temizlik planla |

`render_frame` CLI komut listesinde görünmez çünkü FilmCraft MCP aracıdır; Claude MCP üzerinden kareyi denetlemelidir. `timeline.razor` tanımında `time` tick (254016000000 tick/sn) ister; MCP ve CLI komut çağrılarında `seconds`, `frame` veya `timecode` takma adı kabul edilir.

## Tanı sırası

1. `pwd` ve hedef yolu kontrol edin.
2. `which ffmpeg whisper-cli node python3 uv ollama agy codex filmcraft-cli` ile yüzeyi belirleyin.
3. Araç `--version` veya `--help` çıktısını alın.
4. Girdiyi ffprobe ile okuyun.
5. Varsa `--dry-run` kullanın.
6. En küçük tek klip/tek sahneyle yeniden üretin.
7. Logun ilk kök hatasını çözün; son zincir hatasına takılmayın.
8. Düzeltmeden sonra aynı küçük testi ve `./dogrula.sh` komutunu çalıştırın.

## Veri kurtarma

Ham dosyayı silmeyin veya üzerine yazmayın. Kurulumun taşıdığı önceki hedefler `.yedek-<zaman>` adını alır. Geri almadan önce sembolik bağın hedefini ve yedeğin içeriğini salt okunur inceleyin. FilmCraft projesi açılmıyorsa önce proje dosyasının kopyasını alın; elle JSON düzenleme biçimi doğrulanmadı.

## FilmCraft köprüsü için derin tanı

```sh
open -a FilmCraft --args --control 9876
claude mcp add filmcraft -- "$HOME/.local/bin/filmcraft-cli" mcp --bridge 127.0.0.1:9876
```

Uygulama tamamen açılmadan ilk çağrıyı göndermeyin. Aynı portta eski bir süreç varsa önce hangi uygulamaya ait olduğunu belirleyin. MCP kaydını silip yeniden eklemek proje durumunu düzeltmez; sorun kayıt mı, köprü mü, komut şeması mı ayrıştırılmalıdır.

## Render belleği için kontrollü azaltma

1. Aynı sahneyi kaynak çözünürlükte kısa aralıkla render edin.
2. Büyük görselleri hedef boyuta yaklaştırın.
3. Eşzamanlı tarayıcı ve kurgu uygulamalarını kapatın.
4. Proxy yalnız kurgu içindir; nihai kaliteyi proxy'den üretmeyin.
5. Uzun kompozisyonu mantıksal bölümlere ayırıp kayıpsız/uygun ara çıktı stratejisini proje gereksinimine göre doğrulayın.
6. Bellek ayarları ve concurrency seçeneklerini kurulu Remotion sürümünün yardımından okuyun.

## Türkçe transkript kalite kapısı

Whisper çıktısında ekler, birleşik kelimeler, sayılar ve yabancı sözcükler elle dinlenir. Modelin noktalaması kurgu nefesiyle aynı olmayabilir. SRT zamanları yalnız metne bakılarak kaydırılmaz; gerçek ses ve dudak hareketi birlikte izlenir.

