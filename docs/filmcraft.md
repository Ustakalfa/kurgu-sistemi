# FilmCraft Kullanım Rehberi

## Bağlantı modları

Canlı mod, masaüstü uygulamasının 9876 portundaki kontrol köprüsüne bağlanır:

```sh
open -a FilmCraft --args --control 9876
filmcraft-cli mcp --bridge 127.0.0.1:9876
```

Başsız mod `filmcraft-cli mcp` ile çalışır. Claude kayıtları:

```sh
claude mcp add filmcraft -- "$HOME/.local/bin/filmcraft-cli" mcp --bridge 127.0.0.1:9876
claude mcp add filmcraft-headless -- "$HOME/.local/bin/filmcraft-cli" mcp
```

Canlı mod görsel uygulama durumuyla çalışmak; başsız mod otomasyon ve temiz oturum içindir. Aynı projeye iki yazıcı bağlamayın.

## Tick ve zaman takma adları

`timeline.razor` komut tanımında `time` tick (254016000000 tick/sn) ister; FilmCraft MCP sunucusu ve CLI komut çağrıları `seconds`, `frame` veya `timecode` takma adlarını da kabul eder. Diğer komutların zaman alanlarını kendi tanımlarından kontrol edin; dönen proje durumundaki tick değerini aynen koruyun.
```json
{"timecode":"00:00:05:00"}
{"seconds":5}
{"frame":150}
```

## Test edilmiş güvenli sıra

1. FilmCraft'ı başlat ve MCP'yi bağla.
2. `file.newProject` ile proje oluştur.
3. `file.newSequence` ile çözünürlük, fps ve 48 kHz sesi açıkça ver.
4. Medyayı içe aktar; dönen item kimliklerini kaydet.
5. `timeline.place` ile V1/A1'e yerleştir.
6. Proje/timeline durumunu yeniden oku.
7. `timeline.razor`, `timeline.trim`, `timeline.move` ile kurgu yap.
8. Transkript, altyazı, ses ve rengi uygula.
9. Scope ölç, kare render et ve gözle denetle.
10. Projeyi kaydet; onaydan sonra dışa aktar.

## Doğrulanmış komut örnekleri

| Kategori | Kimlik | Temel parametreler |
|---|---|---|
| proje | `file.newProject` | `name` |
| sekans | `file.newSequence` | `name,width,height,fps,sampleRate,video,audio,mix,trackType` |
| sekans | `file.newSequenceFromClip` | `items` |
| kutu | `file.newBin` | `name,parent` |
| değişim | `file.exportInterchange` | `format,path,sequence` |
| yerleştirme | `timeline.place` | `item/items,track,audioTrack,time,insert,sourceIn,duration,video,audio` |
| seçim | `timeline.select` | `clips,transitions,add,toggle,linked` |
| taşıma | `timeline.move` | `moves,insert,linked,copy` |
| kesme | `timeline.razor` | `time (tick); MCP/CLI: seconds/frame/timecode, track, clip` |
| kırpma | `timeline.trim` | `clip,edge,mode,delta/deltaFrames` |
| roll | `timeline.roll` | `left,right,delta/deltaFrames,followLinks` |
| slip | `timeline.slip` | `clip,delta/deltaFrames` |
| slide | `timeline.slide` | `clip,delta/deltaFrames` |
| hız | `timeline.rateStretch` | `clip,edge,delta` |
| iz | `timeline.setTrack` | `track,locked,syncLock,enabled,muted,solo,name,volumeDb,pan,label` |
| oynatma kafası | `playhead.set` | `time/frame/seconds/timecode` |
| kaynak | `source.open` | `item/clip` |
| kaynak | `source.insert` | boş nesne |
| kaynak | `source.overwrite` | boş nesne |
| otomasyon | `clip.automateToSequence` | `items,ordering,placement,method,overlapFrames,stillFrames,videoTransition,audioTransition,ignoreAudio,ignoreVideo` |
| efekt | `effects.apply` | `clips,effect` |
| efekt | `effects.setParam` | `clip,effect,param,mask,value,time,keyframe,merge,begin` |
| efekt | `effects.remove` | `clip,index` |
| işaret | `markers.addChapter` | `time,name,comment,color` |
| işaret | `markers.addFlashCue` | `time,name,comment,color` |
| işaret | `markers.exportCsv` | `path` |

Transkript, altyazı, grafik, ses, renk/Lumetri/scopes, maske, multicam, dışa aktarma ve dosya kategorilerinde ek kimlikler `remotion/araclar/filmcraft-komutlar.txt` dosyasında sürüme bağlı olarak listelenir. Bu çalışma sırasında tam çıktı araç sınırında kesildiği için tabloda görülmeyen parametreleri “doğrulanmadı” kabul edin; çalıştırmadan önce ilgili satırı bu dosyadan okuyun.

## 4K sekans

Yatay UHD:

```json
{"name":"Ana-4K","width":3840,"height":2160,"fps":25,"sampleRate":48000,"video":3,"audio":3,"mix":"Stereo","trackType":"Standard"}
```

Dikey 4K:

```json
{"name":"Dikey-4K","width":2160,"height":3840,"fps":30,"sampleRate":48000,"video":3,"audio":3,"mix":"Stereo","trackType":"Standard"}
```

FPS kaynağa/teslim şartına göre seçilir; örnek değer zorunlu değildir. Sekans oluşturulduktan sonra yanlış fps'i gizlemek için hız değişimi yapmayın.

## Çok kameralı eşitleme

1. Tüm kameraları ve ayrı sesi içe aktarın.
2. Kamera saat/fps ve ses örnekleme hızını inceleyin.
3. Ortak alkış veya dalga formu tepesini işaretleyin.
4. Multicam komut kimliğini başvuru dosyasından sürüme göre doğrulayın.
5. Ses tabanlı eşitlemeyi çalıştırın; bulunmazsa işaretleri elle hizalayın.
6. Baş, orta ve sonda dudak senkronunu kontrol edin.
7. Drift varsa klip hızını körlemesine değiştirmeyin; kaynağın gerçek fps/ses saatini araştırın.
8. Ana sesi seçin, diğerlerini yedek/ortam olarak tutun.
9. Kamera açılarını izlerken kesimleri yapın.
10. Multicam sonucunu normal sekans halinde yeniden açıp boş kare denetimi yapın.

## Renk düzenleme

1. S-Log3 olduğunu metadata ve çekim notuyla doğrulayın.
2. Uygun S-Log3 → çalışma renk uzayı teknik LUT'unu uygulayın.
3. `scopes.read` ile waveform/parade/vectorscope ölçün.
4. Pozlama, sıcaklık ve tint ile nötr başlangıç kurun.
5. Ten tonunu vectorscope ten çizgisi çevresinde doğal tutun.
6. Parlak alanları bastırın; gölgede ayrıntıyı koruyun.
7. Referans planı seçip benzer planlara `lumetri.applyMatch` uygulayın.
8. Her eşleşmeyi yeniden ölçün; otomatik eşleşmeyi nihai kabul etmeyin.
9. Yaratıcı look'u teknik düzeltmenin üzerine ekleyin.
10. Aynı zaman noktasını düzeltme kapalı/açık FilmCraft MCP aracı `render_frame` ile alın.
11. Farklı ekran ve tam oynatmada banding, gürültü ve ten kontrolü yapın.

`render_frame`, `filmcraft-cli commands` listesindeki bir komut değil, FilmCraft MCP sunucusunun kare denetim aracıdır. Claude canlı FilmCraft MCP üzerinden kurgu ve renk kararlarını uygular; Codex yalnız verilen penceresiz adım dosyasını çalıştırabilir.

## Teslim kuralı

Önce inceleme çıktısı verilir. Kullanıcı açıkça onaylamadan nihai 4K dışa aktarma yapılmaz. Dışa aktarılan dosya çözünürlük, fps, süre, ses kanalı, ilk/son kare ve renk açısından yeniden açılıp kontrol edilir.

## Adım dosyası çalıştırma

```text
file.newProject {"name":"Ornek"}
file.newSequence {"name":"Dikey-4K","width":2160,"height":3840,"fps":30,"sampleRate":48000,"video":3,"audio":3}
playhead.set {"seconds":0}
```

```sh
python3 remotion/araclar/filmcraft-mcp.py "$HOME/.local/bin/filmcraft-cli" adimlar.txt
```

Her satır araç adı ve tek JSON nesnesidir. Betik sırayla çalışır; işlem ortasında hata olursa önce FilmCraft durumunu okuyun, bütün dosyayı körlemesine yeniden çalıştırmayın.

