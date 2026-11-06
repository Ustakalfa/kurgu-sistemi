# Kurgu sistemi kuralları

Kaynak: kişisel çalışma notlarının müşteri ve hesap bilgisi çıkarılmış taşınabilir özeti. Tarihler, kararların notlara işlendiği günlerdir.

## Kalite kapıları

Her video ve reklam için aşağıdaki denetimler zorunludur:

- **4K zorunluluğu.** Sekans baştan 4K kurulur: yatay 3840×2160, dikey 2160×3840. HD master veya render alınmaz; 1080 türevleri yalnız onaylı 4K exporttan üretilir.
- **Ölçümle renk düzeltme.** Her videoda waveform/vektörskop ile pozlama, beyaz dengesi ve ten tonu ölçülür; hafif look uygulanır; önce/sonra kare yan yana kayıt edilir.
- **TAM sekans tarama (teslim öncesi zorunlu).** Baştan sona yaklaşık 2 sn'de bir kare, her grafik/geçişin hemen sonrası, ses LUFS/TP, altyazı görünürlüğü ve son kare kontrol edilir. Her düzeltmeden sonra tarama yeniden yapılır.
- **Anlam haritası zorunluluğu.** Uzun kayıttan kısa video çıkarırken önce anlam haritası ve video listesi hazırlanır, kullanıcı onaylanır; nicelik değil nitelik.
- **Büyük kararlar önceden onaylanır.** Büyük yaratıcı kurgu kararları ve kurgu planı üretimden önce kullanıcıya gösterilip onaylanır.
- **Export yalnız açık onayla.** `.fcproj` kaydedilir, açık bırakılır; kullanıcı "al" demeden 4K export alınmaz. Onaylanmış çıktı `06-teslim/` içine alınır.

## Araç kararları

- Kurgu, renk ve teslim → **FilmCraft** (MCP + başsız).
- Hareketli grafik, ışık, gren, 3D efekt, alfa katmanı → **EffectCraft** (ProRes 4444 alfa çıktı).
- Ses temizliği, miks, MIDI beste → **SoundCraft**.
- Kapak ve küçük resim → **PhotoCraft**.
- Logo ve ikon → **VectorCraft**.
- Belge üretimi → **PdfCraft**.
- Tipografi, hareketli yazı, kıyas grafikleri → **Remotion** (Craft'ın karşılamadığı; kıyas sonucu: yazı grafiğinde Remotion, görüntü efektinde EffectCraft).
- Yerel yapay zekâ ile video üretimi yapılmaz. Müzik üretimi: Magenta RT small (sözsüz, CC BY 4.0 atıf gerektirir), ACE-Step 1.5 (MIT).
- Kullanıcı onayı olmadan paylaşım/yayın yapılmaz.

## Bireysel kurallar tablosu

| Tarih | Kural | Neden | Nasıl uygulanır | Nerede uygulanır |
| --- | --- | --- | --- | --- |
| 2026-10-19 | Claude kaptan, Codex işçi | Yaratıcı karar ile uygulama ayrılır | Claude brief ve denetim yapar; uygulamayı `codex-run` ile devreder | Genel blok, `kurgu-ekip` skill'i |
| 2026-10-19 | İşçi sonucu kendiliğinden gösterilir | Kullanıcı durumu sormak zorunda kalmasın | Tek `run_in_background`, bitiş bildirimi, çıktı denetimi; ara yoklama yok | Genel blok, `kurgu-ekip` |
| 2026-10-20 | Kota korunur | Gereksiz yoklama ve yinelenen okuma maliyetlidir | Büyük işten önce `limit`; küçük işleri tek brief; uzun sohbeti taşı | Genel blok, `kurgu-ekip` |
| 2026-10-21 | Gemini her videoyu izler | Kurgu kararı gerçek ham görüntüye dayanır | `gemini-run video -d <klasör>` ile zaman kodlu analiz | Genel blok, `kurgu-ustasi`, `kurgu-ekip` |
| 2026-10-21 | Yerel model yalnız yardımcı metin işler | Yaratıcı Türkçe ve özet güvenilirliği sınırlıdır | `yerel-run` sonucu denetlenir; müşteri metni yazdırılmaz | Genel blok, `kurgu-ekip` |
| 2026-10-21 | Mevcut görsel hat korunur | Yeniden tasarım ev stilini bozabilir | Mevcut Remotion bileşenleri ve marka varlıkları kullanılır; ffmpeg yardımcıdır | Genel blok, `filmcraft-kurgu` |
| 2026-10-21 | Kurgu bitince export yok | Son kontrol ve teslim kararı kullanıcıdadır | `.fcproj` kaydet, açık bırak, liste ver; “al” ile export | Genel blok, kurgu skill'leri |
| 2026-10-21 | Dış paylaşım açık onay ister | Yayın kararı kullanıcıdadır | Gönderi/yayın öncesinde onayı al | Genel blok |
| 2026-10-21 | Görsel tek üretimdir | Yinelenen üretim kota tüketir | `codex-img` bir kez; varyantlar yerelde; kodla logo çizme | Genel blok, `kurgu-ekip` |
| 2026-10-21 | Eklenti sade tutulur | Gereksiz eklenti bağlam yükler | API anahtarı isteyen araç kurma/önerme | Genel blok |
| 2026-10-27 | Prompt kabuk ikamesinden korunur | Ters tırnak ve `$(...)` yol/metin silebilir | Brief dosyası ve `"$(cat brief.md)"`; boş yol kontrolü | Genel blok, `kurgu-ekip` |
| 2026-10-28 | Her video baştan 4K | HD kalite beklentisini karşılamaz | Dikey 2160×3840, yatay 3840×2160; Remotion `--scale=2` | Genel blok, kurgu skill'leri |
| 2026-10-28 | Her video renk düzenlemesinden geçer | Ham çekimler tutarsız ve dikkat dağıtıcı olabilir | LUT, scopes, pozlama/beyaz denge/ten, eşleme, hafif look, önce/sonra | Genel blok, kurgu skill'leri |
| 2026-10-29 | Çekimi kullanıcı aktarır | İş hattının başlangıcı aktarılan klasördür | Klasörü kullanıcıdan alıp kontrol ve analize geç | Genel blok, `kurgu-ustasi` |
| 2026-10-31 | Craft ailesi ana araçtır | Kıyas sonucu; yazı/grafik Remotion, efekt/ses Craft | Kurgu FilmCraft, grafik EffectCraft, ses SoundCraft, kapak PhotoCraft, vektör VectorCraft | Genel blok, `sinema-kalitesi` |
| 2026-10-31 | TAM sekans taraması zorunlu | Kısa QC'de alfa saçağı ve tarama olayı gözden kaçıyor | Baştan sona ~2 sn'de bir kare, her geçiş sonrası, ses LUFS/TP, altyazı, son kare; düzeltme sonrası yeniden | Genel blok, `sinema-kalitesi` |
| 2026-10-31 | Kurgu planı üretimden önce onaylanır | Büyük yaratıcı karar geri alınamaz zaman harcar | Plan gösterilir, kullanıcı onaylar; sonra araç çalışır | Genel blok, `kurgu-ustasi` |
| 2026-11-05 | Uzun kayıttan kısa video: önce anlam haritası | Nicelik değil nitelik; kullanıcı bilinçli seçim yapar | Anlam haritası + video listesi göster, onay al, kurguya geç | Genel blok, `kurgu-ustasi` |

## Çekirdek kurgu/reklam ilkeleri (müşteriden bağımsız)

Aşağıdaki ilkeler herhangi bir müşteri işi olmaksızın geçerlidir:

- **İlk 3 saniye ve tutma.** Logo animasyonu yerine konu/sonuç veya gerilimi ilk karede göster. Kancanın vaadini gövdede kanıtla; yanıltıcı merak boşluğu kurma.
- **Ses ve seslendirme.** Konuşma müzikten en az ~10 dB yüksek olmalı; toplam LUFS tek başına onay değildir. Teslim öncesi konuşma ve müzik ayrı ayrı ölçülür.
- **Renk eşleme.** Ortalama renk değil; aynı karede bölge/piksel farkı ile ölç. RGB kanalları hedefi (< 6 MAE) tutmadıysa ince ayar yapılır.
- **Görüntü bütünlüğü.** Görüntüyü büken genel efektler, stok video palindrom döngüsü ve yüksek hızda ara kare üretimi (minterpolate) kullanılmaz. Yavaşlama: kaynak fps/çıkış fps oranında (60→25 ≈ 0,42×).
- **Yapay zekâ sınırı.** Yerel yapay zekâ ile video üretimi yapılmaz. YZ bulgusu klip ve zaman koduyla doğrulanmadan uygulanmaz. Gerçekçi sentetik içerik platform beyanında açıklanır.
- **Müzik lisansı.** Müşteri işinde kullanılmayanlar: MusicGen/AudioGen, AudioLDM2, YuE, Demucs ağırlıkları, CoTracker3, MatAnyone, BRIA rembg, Stable Audio Open. Kullanılabilenler: Magenta RT small (CC BY 4.0 atıf), ACE-Step 1.5 (MIT, sözsüz).
- **Ham medya bütünlüğü.** Ham çekimler değiştirilmez; en az iki doğrulanmış kopya tutulur. Ham ve türetilmiş çıktı aynı klasöre yazılmaz.

