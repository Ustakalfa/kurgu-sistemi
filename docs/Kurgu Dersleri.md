---
tur: kavram
etiketler: [video, kurgu, geri-bildirim]
olusturuldu: 2026-10-21
guncellendi: 2026-11-06
kaynak_sayisi: 0
durum: taslak
---

# Kurgu Dersleri — kullanıcının geri bildirim defteri

Her kurgudan sonra kullanıcının düzeltme ve beğeni notları buraya **tarihli** işlenir. Claude her kurgu planından önce bu sayfayı okur; tekrar eden notlar zamanla Kurgu Ustalığı Rehberi'ne kalıcı kural olarak taşınır.

Biçim: `- [YYYY-AA-GG] iş türü (format) — not → çıkarılan kural`

## Genel zevk

### Genel kurallar
- [2026-10-28] "Bundan sonra her videoyu mutlaka renk düzenlemesinden geçir." → Her kurgu, kilitlendikten sonra ve dışa aktarmadan önce renk düzenlemesinden geçer: S-Log3 ise önce Sony resmî LUT; scopes.read (waveform, parade, vektörskop) ile pozlama, beyaz denge ve ten rengi ölçülerek düzeltilir; dikkat dağıtan parlak alanlar (ekran, pencere) bastırılır; farklı çekimler lumetri.applyMatch ile eşlenir; marka look'u en son ve hafif. Önce/sonra kareleri yan yana kullanıcıya gösterilir. 8 bit kaynakta sert grade yok (bantlanma).
- [2026-10-28] "Videoları sakın HD render alma, hepsi 4K olacak." → Sekans baştan 4K kurulur (dikey 2160×3840, yatay 3840×2160); dışa aktarma 4K (Match Source – Adaptive High Bitrate, ~50 Mbps). Kapaklar da 2160×3840.
- [2026-10-25] Bir özel gün videosu (9:16) — "Sunum gibi olmasın" (4 kez tekrarladı) → ortada sert kenarlı fotoğraf + başlık kartı + siyah zeminde bekleyen yazı = slayt. Kural: görseller tam ekran ya da kenarları ekran dışına taşan, karanlığa eriyen; sürekli kamera hareketi + parallax; film yanığı/ışık sızması/whip geçişleri; yazı kelime kelime ve az.
- [2026-10-25] Aynı iş — "Senaryoyu adam akıllı yap", "29 Ekim'in hikâyesi belli olsun" → kural: özel gün işinde slogan değil, saat damgalı gerçek hikâye; kanca 0. saniyede cümleyle.
- [2026-10-25] Aynı iş — seslendirme + arkada "kısık ama belli" müzik istedi → kural: müzik konuşma altında ~-20 dB, aralarda ~-14 dB, kapanışta öne çıkar.

- [2026-10-25] Aynı iş v8 — "Seste konuşmalar yok" (gönderilen ses dosyasında seslendirme -35 LUFS'ta, müzik altında kaybolmuştu; toplam LUFS'a bakıp onaylanmıştı) → KURAL: sesi göndermeden önce konuşma ile müzik ayrı ayrı ve saniye saniye ölçülür; konuşma müzikten en az ~10 dB yüksek olmalı. Toplam -14 LUFS tek başına onay değildir.
- [2026-10-25] Aynı iş — "Nexus Reels'lerinde nasıl yapıyorduk öyle yap" → KURAL: önce deponun `remotion/` hattı; ses Remotion'da katman katman (her VO cümlesi kendi Sequence'ında volume=1, müzik ayrı Audio düşük volume), önceden karıştırılmış tek WAV'a güvenme.
- [2026-10-25] Aynı iş — belirli efektler ve görseller beğenilmedi; kelime kelime yazı ve daktilo damga kaldı. Müziği kullanıcı seçti → kullanıcının verdiği müziğin önerdiği noktadan başla, kesmeleri ölçü başına oturt.

- [2026-10-26] Aynı iş v9 — "Kapanış can alıcı değil" + "bayrak belli olmuyor" → kural: kapanış müziğin en güçlü vuruşuna otursun ve 5-7 sn sürsün; kalabalık uzun söz kapanışa konmaz. Bayrak katmanında maske kumaşı kesiyor muydu diye karede kontrol et.
- [2026-10-26] Aynı iş v10 — "Bayrakta takılma ve bozulmalar var" → kural: stok videoyu yavaşlatırken ara kare üretme (minterpolate) ve ileri-geri (palindrom) döngü kullanma; yüksek fps kaynağı düşük fps'e 1:1 yeniden zamanla (60→30 = 0,5×), uzun süre gerekiyorsa klibi sahne kesmelerinde yeniden başlat; Remotion'da `OffthreadVideo` kullan; teslimden önce donmuş kare ölç (signalstats YDIF).
- [2026-10-27] Aynı iş v11 — sentetik ses uygun bulunmadı; kullanıcı insan sesiyle seslendirdi, sonuç "çok güzel oldu" → kural: müşteri işinde seslendirme insan sesiyle (kullanıcı üretir), Claude cümlelere böler, hızlandırmadan yerleştirir; teslim öncesi karışık ses yazıya dökülüp her cümlenin müzik altından okunduğu doğrulanır.

## Teknik

- [2026-10-29] FilmCraft `export --preset` altyazı izini videoya yakmayabiliyor (burnCaptions varsayılan kapalı) → altyazılı Reels'i `file.exportMedia` ile `burnCaptions: true` vererek al; teslimden önce çıktıdan altyazılı bir kare çıkarıp bak.
- [2026-10-27] FilmCraft dışa aktarmada loudness efektinin true_peak_dbtp sınırı uygulanmıyor → teslimden önce her çıktıyı loudnorm ile ölç; tepe > -1 dBTP ise ffmpeg ile yalnız sesi sınırla (192 kHz'e yükseltme, alimiter limit=0.79 attack=2 release=80, sonra 48 kHz; -c:v copy).
- [2026-10-28] Ortam fonu (ambient pad) meditasyon müziği gibi bulundu → konuşmalı Reels/TikTok/Shorts fonu konuya göre seçilir: düşündürücü/analitik konuya sakin elektrik piyano, iç hesaplaşma/manevi kapanışa piyano+yaylı, gündelik/esprili konuya rehavetli lo-fi; ne davullu pop ne drone.
- [2026-10-29] Bir müşteri işinde, söylenen konuşma değil anlatıcı sesi doğru çıktı; ama Reels'te kanca ağır duygusal ifadeyle değil, merak uyandıran kısa bir soruyla açılır; duygusal en ağır cümle ortaya konur.
- [2026-10-29] Aynı iş — "Seste biraz bozulma var" (gürültü temizliği sonrası compressor makeup +2 dB limitersiz tamsayıya yazılmış, dosya 0 dBFS'te kırpılıyordu) → KURAL: temizlenmiş konuşma dosyası zincir boyunca float kalır, sonda hedef loudness (≈-14,5 LUFS) + aşırı örnekli limiter (-2 dBTP) ile tek seferde yazılır; kurguda konuşmaya ek kazanç verilmez. Teslim öncesi astats Flat factor = 0 olmalı (0 değilse kırpılma var). Her konuşma kesimine 2 karelik constant_power çapraz geçiş.
- [2026-10-31] Craft derin tur 2 — renk eşleşmesini ortalama renk ile değil, aynı karede bölge/piksel farkıyla ölç; bu testte düzeltme büyük iyileşti ama kırmızı ve mavi kanal hedefi (<6) tutmadı, RGB eğrileriyle ince ayar gerekir.
- [2026-10-31] Craft derin tur 2 — FilmCraft'ın bu derlemesinde yerleşik Whisper yok; Türkçe hat yerel Whisper → UTF-8 SRT → `captions.import` olmalı, sessizlikten başlayan ilk altyazı ayrıca hizalanmalı.
- [2026-10-31] Craft derin tur 2 — kelime senkronunda ayrı kelime katmanları yerine tek metin katmanı ve kelime bazlı range selector/text animator kullan; zamanlama iyi olsa da katmanlı yerleşim dağınık kalıyor.
- [2026-10-31] Craft derin tur 2 — otomatik maske ve nokta takibini güvenilir sayma; testte hata 58–63 px, FilmCraft maske takibinde yaklaşık 1.670 px oldu. Elle düzeltme anahtar kareleri ve render denetimi şart.
- [2026-10-31] Craft derin tur 2 — 4K25/6 sn ProRes 4444 alfa EffectCraft renderı yaklaşık 107 sn sürüyor; uzun grafik işlerini buna göre planla, önizlemede çeyrek çözünürlük kullan.
- [2026-10-31] Craft derin tur 2 — gürültülü konuşmada ses temizleme hattı (ffmpeg ön temizlik → SoundCraft gate/EQ/de-esser/compressor → loudnorm) gürültü tabanını −40,3'ten −60,4 dB'e, konuşmayı −14,1 LUFS'e getirdi; her çıktı yine ölçülmeli.
- [2026-10-31] Craft uçtan uca hat — FilmCraft'a referans video alınırken kaynak ses ayrıca gelmesin: `timeline.place` adımında `audio:false` kullan; gelmiş ses izini sustur ve SoundCraft final miksini A1'e zaman sıfırından yerleştir.
- [2026-10-31] SoundCraft gerçek konuşma testi — maximizer varsayılan `threshold:0` ile sesi yükseltmez; −14 LUFS çevresi için `threshold:-8`, `ceiling:-1.2`, `release:60` başlangıcı −13,9 LUFS verdi, her miks yeniden ölçülür.
- [2026-10-31] SoundCraft gerçek konuşma testi — yerleşik denoise/spectral eklentisi yok; geniş bant gürültüyü önce başka araçla temizle.
- [2026-11-04] Bir müşteri işi (9:16) — müşteri işine başlamadan iş klasörü araştırılmadı; masaüstünde onaylı renk rehberi, font, şablon ve fotoğraf arşivi vardı → KURAL: müşteri işine başlamadan müşterinin iş klasöründe ve arşivinde ara; marka paketi ve project-memory varsa tasarım oradan kurulur.
- [2026-11-04] Aynı iş — çekim yoksa yalnız grafik slayt gibi kalıyor; müşterinin kendi fotoğrafları + kelimesi kelimesine seslendirme senkronu + marka diyagonali kampanya hissini verdi → KURAL: çekimsiz işte önce müşterinin görsel arşivi taranır, Real-ESRGAN ile büyütülür, özne yazının altında kalacak şekilde çerçevelenir.
- [2026-11-04] Aynı iş, teknik — Remotion'da düz `<img>` büyük PNG'lerde render'da boş kare verir → daima `Img`. Codex sandbox'ında Remotion render açılmaz (Chromium izni); render ve görsel denetim Claude'un kabuğunda. Geçiş sesi sözcüğün ilk hecesine binmesin; sesi efekt tek tek ölçülür.
- [2026-11-05] Dublaj denemesi — ses sentezi mp3 dosyalarının sonunda ~0,7-0,9 sn sessizlik var; ham süreyle sığdırma hesabı bazı satırları %50-280 hızlandırdı → KURAL: sığdırma hızını sessizliği kırpılmış konuşma süresiyle ölç, hız +%15'i geçiyorsa önce metni kısalt; ayrıca gömülü altyazılı videoda yeni altyazı, kaynağın altyazı kutusu kare kare ölçülüp opak plakayla örtülür.
- [2026-11-05] Birden fazla görsel üretiminde — paralel görsel üretimde kareler dosyalara karıştı; ayrı klasör de bunu tek başına çözmedi → görsel üretimi tek koldan yürüt; üretimden sonra etiketli temas tabakasıyla her dosyanın içeriğini denetle.
- [2026-11-05] three.js ShaderMaterial içinde sRGB doku, çıktı encode edilmeden kullanıldığında görüntü ezik ve turunculaştı → `NoColorSpace` kullan; çıktıyı kaynak kareyle yan yana karşılaştır.
- [2026-11-05] Yapay zekâ derinlik haritası iyi görünse de yüksek dolly hareketinde görüntüyü yırtıyor → haritayı yumuşat; büyük hareketi zoom/pan kamera yolundan al.
- [2026-11-05] Remotion'da "Bir Nokta" — Remotion 2D canvas video renderında eski/boş kareyi önlemek için `getContext('2d', {willReadFrequently:true})` ve `useLayoutEffect` kullan; tek kare önizlemesi yetmez, video karelerini kontrol et.
- [2026-11-05] Aynı iş — flaşı parlaklık eğrisiyle ölç: 0,5 saniyede 150→940 sıçrama flaştır; en az 1 saniyeye yay ve saf beyaza çıkma.
- [2026-11-05] Aynı iş — vurucu cümleyi ekranda en az 2,5 saniye tut; giriş/çıkış animasyonu bu okunma süresini yemesin.
- [2026-11-05] Aynı iş — renk eşlemede kanal başına histogram eşlemeli 33³ LUT'u yalnız çekime uygula; yalnız kazanç eğrisi siyah noktayı düzeltmez.
- [2026-11-05] ACE-Step 1.5 — `uv run` kullanma; `thinking=false`, `offload_to_cpu=true`, `offload_dit_to_cpu=true`, `backend="mlx"`; çalıştırmadan önce `instruction.txt`yi sil, stdin'e `yes ""` ver ve ağır işleri aynı anda çalıştırma. Sözsüz kullanılabilir, Türkçe vokal kullanılmaz.
- [2026-11-05] Aynı iş — her sahne dönüşümünde A'nın son karesiyle B'nin ilk karesini temas tabakasında karşılaştır; konum, ölçek, ışık ve renk sürekliliğini görmeden sahneyi onaylama.
- [2026-11-05] Kullanıcı: "videoları kafana göre kurgulama, ArtCraft araçlarını kullan" → kural: kurgu planı önce onaylatılır, kurgu Craft ailesinde yapılır; Remotion yalnız Craft'ın karşılamadığı yerde.
- [2026-11-05] Altyazı bant sorunu — altyazı arkasındaki bant sert kenarlarıyla görünür oldu → bant kullanma; okunurluk için gölge yeterli.
- [2026-11-06] Satır maskesi ve Türkçe büyük harf — satır maskesi (overflow:hidden) yazı boyuna eşit yapılınca büyük harf Ü/Ö/İ noktaları kesildi → KURAL: yazı açılış maskesine üstte ~0,22em, altta ~0,1em pay ver (padding + negatif margin); kaydırma yüzdesini %135'e çıkar; Türkçe büyük harfi her zaman kare çıktısında kontrol et.
- [2026-11-06] Sahne çıkışı ve nesne çakışması — sahne çıkışı ile sonraki nesnenin hareketi çakışınca vurgu çubuğu nesnenin üstünde kaldı → KURAL: çıkan öğeler, yerine gelen nesne hareket etmeden ÖNCE bitsin (en az 2-3 kare boşluk); geçiş karelerini tek tek render edip bak.
- [2026-11-06] PSD şablonu → motion: psd-tools ile gizli grupları önce visible=True yapmadan composite boş döner; vektör akıllı nesneler (.ai) qlmanage ile yüksek çözünürlükte rasterlanır (beyaz zemin, sonra alfa anahtarla). Real-ESRGAN ürün/etiket için iyi, yüz için kötü (cilde boya dokusu).
- [2026-11-06] arka plan `codex-run` ile çağrılınca "Reading additional input from stdin" deyip %0 CPU'da 9 dk takıldı → **kural:** arka plan `codex-run` komutuna `< /dev/null` ekle; 2 dk içinde dosya çıkmıyorsa süreç durumuna bak.
- [2026-11-06] FilmCraft `captions.setStyle` `size` 4K dikeyde çok büyük geldi; 40 + Bold + outline 3 + margin 0.30 onaylandı → **kural:** 4K dikeyde altyazı boyutu 40 ile başla, render_frame ile bak.
- [2026-11-06] Sabit köşe logosu yakın planda yüzü/eli kapattı → **kural:** logo yerleştirdikten sonra 2 sn'lik tam taramada yüz/el çakışması ara; çakışan bölümde logoyu gizle ya da kaydır.
- [2026-11-06] Kullanıcı düz kesim + statik logo açılış/kapanışını beğenmedi → **kural:** tanıtım Reels'te varsayılan: logo ortada belirip köşeye kayar, punchline'da 0,25 sn yumuşak %112 yakınlaşma, kesimlerde 12 karelik çapraz geçiş, kapanışta bulanık+kararan arka plan, büyüyerek gelen logo, alttan kayan tek satır CTA, siyaha iniş.
- [2026-11-06] FilmCraft SRT içindeki `<font color>` etiketini yok sayar; altyazı stili iz başınadır → **kural:** vurgulu (renkli) altyazı için ayrı caption izi aç (captions.import) ve onu ayrı renkle stillendir.

## Kaçınılacaklar

- [2026-10-25] Bayrakla aynı karede uyumsuz içerik; bayrağa yazı/logo bindirmek; bayrak rengini marka tonuna çekmek; AI ile tarihî figür yüzü; özel güne başka tarihin sembolünü zorlamak.
- [2026-11-05] Görüntüyü büken genel efektler — kullanıcı: "efektler tuhaf, görüntüyü bozuyor" → kural: görüntüyü büken genel efekt yok.

Bağlantılar: Kurgu Ustalığı Rehberi · skills/sinema-kalitesi/SKILL.md
