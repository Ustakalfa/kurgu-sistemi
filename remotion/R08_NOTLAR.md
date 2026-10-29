# Reels 08 — üretim ve kontrol notları

## 21 Ekim 2026 — CTA sahnesi kaldırıldı

Kullanıcı kararıyla 1014–1129. karelerdeki küçük kutu / “SANA UYGUN DÜZEN” / “MESAJ AT” CTA sahnesi tamamen kaldırıldı. `vo9` seslendirmesi ve altyazısı ile CTA bildirim sesi çıkarıldı. G2 sahnesi 1013. karede bitiyor; logo kapanışı 1014. karede başlıyor ve önceki gibi 70 kare sürüyor. Yeni toplam süre `REELS08_SURE = 1084` kare (30 fps'de 36,133 saniye). Aşağıdaki eski süre, sahne ve teslim bilgileri ilk sürüme aittir.

`npx tsc --noEmit` geçti. `npx remotion render src/index.ts Reels08 cikti/reels-08.mp4` komutu 900 saniyelik sınırla tamamlandı; günlük `cikti/r08_remotion_render.log` içinde. Yeni MP4 `ffprobe` ile doğrulandı: 1080 × 1920 H.264/AAC, 36,139 saniye.

## Seslendirme ve kurgu

Hazır `public/reels/r08/vo1.wav`–`vo9.wav` kullanıldı. Yeni TTS üretilmedi. Süreler `ffprobe` ile ölçüldü; 30 fps zaman çizelgesinde sesler özgün hızda oynatılıyor.

| VO | Süre (s) | Başlangıç (kare) | Whisper küçük model çıktısı |
|---|---:|---:|---|
| 1 | 3,312 | 3 | Ruj nerede, fırça nerede, **aina** nerede? |
| 2 | 2,928 | 107 | Cevap basit, hepsi tek kutuda. |
| 3 | 4,824 | 198 | İki gizli sürgü kilit. Dışarıda tek bir çıkıntı yok. |
| 4 | 5,496 | 346 | **Kapı aç**, ayna hazır. 105 derecede kendiliğinden durur. |
| 5 | 3,624 | 514 | Her bölme gerçek ürün ölçülerine göre çizildi. |
| 6 | 5,016 | 627 | Ruj, fırça, **paleti** ya da bakım. 6 farklı iç düzen. |
| 7 | 3,240 | 781 | İçini sen seç, biz senin için üretelim. |
| 8 | 4,344 | 882 | Daha fazlası mı lazım? 2 katlı G2. |
| 9 | 3,744 | 1016 | Sana uygun düzen için bize mesaj at **kutuyaz**. |

Toplam ses dosyası süresi **36,528 saniye**. Whisper çıktısındaki kalın sözcükler brief metninden küçük otomatik yazıya döküm farkları gösteriyor; `vo9` cümlesi briefteki güncel CTA satırıdır. Hazır ve önceden doğrulandığı belirtilen sesler değiştirilmedi. Whisper ham çıktıları `cikti/r08_whisper/` içinde, çalışma günlüğü `cikti/r08_whisper.log` içinde.

Tam kurgu **1200 kare / 40 saniye**. Briefteki 32–36 saniyelik hedef, yalnız VO dosyalarının toplamı bile 36,528 saniye olduğundan ve kapanış için ek süre gerektiğinden özgün hızla karşılanamıyor. Sesleri kesmemek ve hızlandırmamak için geçişler kısa, kapanış 70 kare tutuldu. Sahne sınırları: 0, 105, 196, 344, 512, 625, 779, 880, 1014, 1130 ve 1200. Kaynak CAD klipleri her sahnenin VO uzunluğuna kare eşlemeyle yayıldı; 1 ve 2. sahneler aynı 150 karelik dönüşü aralıksız paylaşıyor.

## CAD ve tasarım kararları

- `~/nexus-cad/reels/klipler.py`, `reels.py` içindeki gerçek CAD geometrisini kullanarak 7 klasörde toplam **834 RGBA PNG** üretir. CAD kaynakları değiştirilmedi.
- Kaynak kareler 720 × 1280, Remotion kadrajı 1080 × 1920. Şeffaf kareler ekranda 1,5 kat görüntülenir. Bu çözünürlük, tam CAD dizisi ve Remotion renderını makul sürede tutarken ürünün yaklaşık %80–85 yatay yer kaplamasını sağlar.
- Ana aydınlatma `render3.py` düzeninden, düşük şiddetli bordo kenar ışığı `#C20D38` ile tamamlandı. Arka plan, ürün gölgesi, metin ve rozetler Remotion'da üretildi; CAD PNG'lerinde bulunmaz.
- Kapak animasyonu briefteki 0→102° hedefini kullanır. Ekrandaki 105° ifadesi seslendirmedeki fiziksel durma açısıdır.
- Açılışta CAD küçültülmüş ve karanlıktan görünür hâle gelerek yaklaşır; kilitte yakın plan geri çekilir; ürün sahnesinde hafif bir ileri itme vardır.
- `k2_kilit` sağ sürgüyü 30–48, sol sürgüyü 60–78. karelerde kilitler. `k5_duzenler` A–F varyantlarını 24'er kare gösterir. `k6_patlatma` modülü ve kapağı yükseltip geri oturtur; `k7_g2` üst tepsiyi yana ve yukarı taşır.
- `public/reels/r07/logo-acilis.mp4`, yalnız R08 varlığına kopyalanıp kapanış kartında sessiz kullanıldı.

## Kontrol

- `npx tsc --noEmit` geçti.
- Remotion test kareleri tam videodan önce üretildi ve kanca, kilit, ayna, ürünler, altı düzen, G2, CTA ve kapanış görsel olarak incelendi. Beyaz altyazıdaki sert kontur bu kontrolden sonra kaldırıldı.
- Remotion komutları süre sınırı ve ayrı günlüklerle çalıştırıldı; günlükler `cikti/r08_test/`, `cikti/r08_kontrol/` ve `cikti/r08_remotion_render.log` içinde.
- Teslim: `cikti/reels-08.mp4`, `cikti/reels-08-kapak.png`, `cikti/r08_kontrol/` içindeki 10 orta kare ve `montaj.jpg`. Son video `ffprobe` ile doğrulandı: 1080 × 1920 H.264, 48 kHz stereo AAC, 40,000 saniye. Ses çözümlemesinde ortalama -19,0 dB, tepe -1,1 dB; çözme hatası yok.
