# Örnek İş: Örnek Kafe — Tanıtım Reels

Bu senaryo kurgusaldır; komut yüzeyi depodaki betiklerden alınmıştır. Amaç, 9:16 ve yaklaşık 35 saniyelik bir tanıtım videosunu ham çekimden onaylı 4K teslime kadar göstermektir.

## 1. İş klasörü

```sh
yeni-is "Ornek Kafe" "Tanitim Reels" --format 9x16
```

Bu örneğin iş kökü: `$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/`.

Örnek ekran çıktısı (temsili):

```text
İş klasörü oluşturuldu.
Format: 9x16
Sonraki adım: ham çekimleri ilgili klasöre kopyalayın.
```

Çıktı metni sürüme göre değişebilir. Kullanıcı kamera kartını `01-ham/` altına aktarır ve ayrı yedeği doğrular.

## 2. Teknik çekim kontrolü

```sh
cekim-kontrol "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/01-ham" --hizli --cikti "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/00-brief/cekim-kontrol.md"
```

Örnek rapor parçası (temsili):

```text
Klip sayısı: 18
Toplam süre: 00:12:41.000
Katmanlar: yerel ölçüm
Kurguda dikkat: bir klibin fps'i çoğunluktan farklı; bilinçli ağır çekim olabilir.
```

Bu değerler gerçek bir müşteriye ait değildir. Raporun gerçek değerleri kurguda karar vermeden önce okunur.

## 3. Görsel inceleme

```sh
gemini-run video "Her klip için iyi/kötü anları zaman koduyla yaz; odak, kadraj, istenmeyen nesne ve ses-görüntü sorunlarını belirt." -d "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/01-ham"
```

Sonuç `00-brief/gorsel-inceleme.md` dosyasına insan tarafından kaydedilir. Modelin zaman kodları klip açılarak örneklenir.

## 4. Transkript ve kısa an seçimi

```sh
python3 remotion/araclar/nexus-reels.py yaziya-dok "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/01-ham/roportaj.mp4" --cikti "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/00-brief/transkript" --dil tr
python3 remotion/araclar/nexus-reels.py sec "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/01-ham/roportaj.mp4" --cikti "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/00-brief/transkript" --adet 3 --min 20 --max 45 --model gemini
```

Ürünler: `transkript.json`, `transkript.srt`, `transkript.txt`, `secim.json`.

## 5. Kurgu planı

| Çıktı zamanı | Kaynak/an | Görüntü | Ses/metin | Amaç |
|---:|---|---|---|---|
| 00:00–00:02 | espresso yakın plan | hızlı makro, buhar | kısa vurgu + “Güne iyi başla” | kanca |
| 00:02–00:06 | dış cephe/genel | kapıdan içeri hareket | ortam + müzik girişi | mekânı kur |
| 00:06–00:11 | öğütme/demleme | üç ritmik detay | iki yumuşak geçiş SFX'i | zanaat |
| 00:11–00:17 | röportaj seçmesi | çalışan orta plan | temizlenmiş cümle | güven |
| 00:17–00:24 | ürün ve servis | 50p kaynak yavaşlatma | müzik yükselir | iştah |
| 00:24–00:30 | masa/arkadaşlar | doğal tepki | ortam sesi geri gelir | deneyim |
| 00:30–00:35 | kahve + logo alanı | sabit kapanış | kısa çağrı | kapanış |

Plan, `skills/kurgu-ustasi/SKILL.md`, `docs/Kurgu Ustalığı Rehberi.md` ve `docs/Kurgu Dersleri.md` ilkeleriyle karşılaştırılır. Çekimde olmayan bir sahne planlanmaz.

## 6. FilmCraft adım dosyası

`adimlar.txt`:

```text
file.newProject {"name":"Ornek-Kafe-Tanitim"}
file.newSequence {"name":"Dikey-4K-30","width":2160,"height":3840,"fps":30,"sampleRate":48000,"video":3,"audio":3,"mix":"Stereo","trackType":"Standard"}
playhead.set {"seconds":0}
```

```sh
python3 remotion/araclar/filmcraft-mcp.py "$HOME/.local/bin/filmcraft-cli" adimlar.txt
```

İçe aktarma aracının kimliği ve dönen item kimlikleri FilmCraft sürümündeki `filmcraft-komutlar.txt` satırından çalışma anında doğrulanır. Ardından her gerçek item için örnek yerleştirme:

```json
{"item":"DÖNEN_ITEM_KIMLIGI","track":"V1","audioTrack":"A1","seconds":0,"insert":false,"video":true,"audio":true}
```

Claude kurguyu FilmCraft MCP ile yürütür. `timeline.razor` komut tanımında `time` tick (254016000000 tick/sn) ister; MCP ve CLI komut çağrılarında `seconds`, `frame` veya `timecode` takma adı kabul edilir. Kurguda `timeline.razor`, `timeline.trim`, `timeline.move` kullanılır. Yer tutucu kimlik gerçek komut değildir; MCP yanıtındaki kimlikle değiştirilir.

## 7. Ses

Diyalog A1'de temizlenir; müzik A2'de konuşma altında otomasyonla kısılır; ortam A3'te kesimleri birbirine bağlar. SFX kataloğundaki geçiş/vurgu adları önce dinlenir. Taşma, kulaklık ve hoparlör kontrolü yapılır. Gerekirse yerel metin temizliği:

```sh
printf '%s' "Konuşma dökümü" | yerel-run temizle -
```

Model çıktısı ses kesme kararı değildir; temiz metin ile gerçek ses karşılaştırılır.

## 8. Altyazı

Whisper SRT başlangıç noktasıdır. Her satır en fazla iki okunabilir satıra bölünür; kanca kelimesi marka rengiyle vurgulanır; ekran altındaki arayüz güvenli alanı korunur. Yazım ve zamanlama gerçek sesle izlenir.

## 9. Renk

1. Klip metadata'sından S-Log3 kaynakları ayır.
2. Uygun teknik LUT'u uygula.
3. `scopes.read` ile waveform/RGB parade/vectorscope ölç.
4. Beyaz denge ve pozlamayı birincil kontrollerle düzelt.
5. Ten tonunu ten çizgisi çevresinde doğal tut.
6. Kahve fincanı/parlak metalde tepeyi bastır.
7. Referans iç planı seç; benzer planlara `lumetri.applyMatch` uygula.
8. Dış planı ayrıca düzelt; otomatik eşleşmeye kör güvenme.
9. Sıcak ama nötrleri kirletmeyen look ekle.
10. Aynı kareyi önce/sonra FilmCraft MCP aracı `render_frame` ile karşılaştır.

## 10. Remotion marka katmanı

Yeni kompozisyon `Root.tsx`e benzersiz kimlikle eklenir veya uygun var olan kompozisyon props ile kullanılır. Önizleme:

```sh
cd ~/kurgu-sistemi/remotion
npm run tip
npm run studio
```

4K render yalnız kullanıcı açıkça “al” dedikten sonra yapılır; öncesinde Remotion Studio önizlemesi kullanılır. `--scale=2`, @remotion/cli içindeki `scaleOption` ile doğrulanmıştır.

4K render:

```sh
npm run render -- NexusTanitim "$HOME/Movies/Isler/<YYYY-AA-GG>_ornek-kafe_tanitim-reels/06-teslim/marka-katmani.mp4" --scale=2
```

Kompozisyon kaynağı 1080×1920'dir; `--scale=2` çıktıyı 2160×3840 yapar. 1080 çözünürlüklü render yasaktır.

## 11. Kullanıcı kontrol listesi

- [ ] İlk iki saniye vaat/kanca açık mı?
- [ ] Mekân ve ürün gerçeğe uygun mu?
- [ ] Konuşma doğal ve anlaşılır mı?
- [ ] Müzik ve SFX rahatsız ediyor mu?
- [ ] Altyazı doğru, okunur ve güvenli alanda mı?
- [ ] Renk/ten/ürün tonu doğal mı?
- [ ] Logo boyutu ve kapanış süresi uygun mu?
- [ ] Çıkarılması gereken kişi/nesne var mı?
- [ ] Süre ve 9:16 oranı uygun mu?
- [ ] Bu sürüm 4K nihai dışa aktarma için onaylandı mı?

## 12. Revizyon turu

Örnek geri bildirim: “00:17 ürün planı uzun; 00:24 ortam sesi belirgin olsun; kapanış bir saniye uzasın.” Her madde zaman koduyla kayıt edilir. FilmCraft'ta ilgili trim ve ses otomasyonu değiştirilir; tüm videoyu baştan kurmak yerine hedefli revizyon yapılır. Yeni inceleme dosyası eski sürümün üzerine yazılmaz.

## 13. Onay sonrası 4K

Açık onaydan sonra 2160×3840, doğru fps ve 48 kHz sesle dışa aktarılır. Dosya ffprobe ile ölçülür, baştan sona örneklenir, ilk/son kare ve ses kontrol edilir. Teslim klasöründe yalnız onaylı sürüm ve gerekliyse sağlama notu bulunur.

## 14. Kurgu Dersleri kaydı

Örnek genellenebilir ders:

> Yakın ürün planından insan tepkisine geçmeden önce kısa bir ortam sesi köprüsü, görsel kesimi daha doğal hissettirdi. Ölçüm: iki inceleme sürümü aynı görüntüyle karşılaştırıldı; yalnız ses köprüsü olan sürüm onaylandı. Sonraki işte J-cut denemesi kurgu planına baştan eklenecek.

Ders; işletme, kişi, mutlak yol veya gizli bilgi içermez.

