---
tur: kavram
etiketler: [video, kurgu, montaj, nexus]
olusturuldu: 2026-10-21
guncellendi: 2026-10-21
kaynak_sayisi: 6
durum: olgun
---

# Kurgu Ustalığı Rehberi

Nexus Studio CS için kurgu, görüntüleri art arda dizmek değil, izleyicinin dikkatini ve hissettiği şeyi yönetmektir. Çekim temeli: [[Sinematik Video Rehberi (Kapsamlı)]] ve [[Çekim Stratejileri (Sinematik)]]. Kanca ve dönüşüm: Oltaya Getirme - Hook & Lead Playbook. Araç akışı: Yapay Zekâ İş Düzeni; müzik seçimi: Müzik & Yaratım. İşe başlamadan format, platform, süre, amaç, kitle ve marka sesini netleştir. Kişisel marka samimi ve doğrudan; Nexus B2B işi daha ölçülü olabilir. Ayrı markanın kimliğini Nexus'a taşıma.

## 1. Temel ilkeler

| İlke | Tanım ve ne zaman kullanılır | FilmCraft'ta nasıl |
|---|---|---|
| Murch'ün altılı kuralı | Kesim kararında duygu → hikâye → ritim → göz izi → 2B ekran düzlemi → 3B mekân önceliği. Teknik süreklilik ile duygu çatışırsa hikâyenin hissettirdiğini seç. | `timeline.razor` ile aday kesimleri kur; `sequence_inspect` ve `render_frame` ile karşılaştır. Otomatik “duygu” komutu yok. |
| J-cut / L-cut | J-cut'ta gelecek sahnenin sesi görüntüsünden önce; L-cut'ta önceki ses yeni görüntü üzerinde sürer. Röportaj, diyalog ve sahne geçişinde akışı yumuşatır. | `timeline.razor`, `timeline.trim` ile görüntü ve sesi ayrı düzenle; sonucu `sequence_inspect` ile doğrula. |
| Match cut | Biçim, hareket veya sesin iki plan arasında eşleşmesi. Sahne değişirken anlamlı bağ kurmak için. | Eşleşen kareleri `timeline.razor` / `timeline.trim` ile hizala; `render_frame` ile kesim öncesi ve sonrasını kontrol et. |
| Jump cut | Aynı planda zaman atlayarak gereksiz duraklamayı çıkarır. Konuşan kafa ve tempolu dikey içerikte; duygusal durakta ölçülü. | `transcript.removeFillers`, `transcript.removePauses`, ardından `timeline.razor` ve `edit.rippleDelete`; Türkçe transkripti elle doğrula. |
| Cutaway | Ana aksiyondan ilgili ayrıntı veya tepki planına geçiş. Röportaj kesimini örtmek, bilgi veya bağlam göstermek için. | B-roll'u `media_import` ile al, zaman çizelgesine yerleştir; `sequence_inspect` ile ses sürekliliğini kontrol et. |
| Eye trace | İzleyicinin bakışını bir kesimden sonrakine taşıma. Hızlı kesim, ekran yazısı ve özne yer değişiminde. | Kritik kareleri `render_frame` ile karşılaştır; gerekirse kadrajı `effects.setParam` anahtar kareleriyle düzelt. |
| Ritim | Kesim süresinin konuşma, aksiyon, müzik ve duyguya göre akması. Vurguda hızlan, anlam veya karakter anında nefes bırak. | Vuruşları dinleyerek işaretle, `timeline.razor` / `timeline.trim` ile kesimleri ayarla; `sequence_inspect` ile akışı izle. |

## 2. DİKEY (9:16) ustalığı

- **Kanca:** İlk 0–3 saniyede aksiyonun veya çatışmanın içine gir; ilk karede merak uyandır. Selamlaşma ve uzun logo açılışı yerine sonucu, soruyu veya güçlü görüntüyü göster. 3–5 saniyede vaadi netleştir; sonra kanıtı ve içeriği ver. Oltaya Getirme - Hook & Lead Playbook içindeki DUR → İZLET → İNANDIR → HAREKETE GEÇİR akışını kullan.
- **Görsel değişim:** Genel uygulama olarak konuşan kafa içeriğinde birkaç saniyede bir açı, ölçek, yazı veya B-roll değişimi dene; araştırma notlarındaki 2–3 saniye eşiği zorunlu kural değildir. Eğitim veya sakin anlatıda daha uzun plan işe yarayabilir. Değişimi yalnızca anlamı güçlendirdiğinde yap.
- **Sessizlik ve açık döngü:** İstemsiz uzun duraklamaları kes; 0,3 saniye eşiği genel uygulama olarak değerlendir, nefes ve vurgu için sessizliği koru. Başta açtığın soruyu sonunda kapat; uzun kısa videoda ara merak noktaları ekle.
- **Altyazı ve güvenli alan:** Konuşmayı okunaklı, doğru Türkçeyle altyazılandır; `transcript.createCaptions`, `captions.add`, `captions.setStyle` sonrası elle kontrol et. Arayüzün kapattığı üst, alt ve yan alanlara yüz, ana yazı ve CTA koyma. Notlardaki yan %10–15, üst %15, alt %25–35 yalnız başlangıç payıdır; hedef platformda gerçek önizleme yap.
- **Yataydan dikeye:** 16:9 master zaman çizelgesini çoğaltıp kilitle; 9:16 için özneyi ve hareketi yeniden kompoze et. İki kişiyi ortadan körlemesine kırpma; odak değişimini anahtar kareyle izle. YouTube Shorts için ayrı dikey çıktı planla.
- **Müzik ve CTA:** Müzik vuruşunu kesime destek olarak kullan; her kesimi zorla vuruşa bağlama. Sonunda tek, bağlama uygun çağrı bırak. Nexus reklamında his ve hikâye önde; [[Tanıtım Videosu — Reklam Efsanesi Kancaları]] içindeki vaat ürünü yalnız göstermek değil, hissettirmektir.
- **Nexus ev stili:** Remotion `src/Reels07.tsx` ile marka grafiği, kelime kelime altyazı ve logo açılışı; `src/marka.ts` ile marka değerleri. FilmCraft'ta ana kurgu ile Remotion katmanını uyumlu tut. Ayrı marka işlerinde: kendi paleti, sıcak soru tonu, rıza ve doğrulanmış kaynak kuralları uygulanır; Nexus logosu kullanılmaz.

## 3. YATAY (16:9) ustalığı

1. **Radio edit:** Röportaj ve anlatıcı sesinden görüntüsüz dinlenebilen hikâyeyi kur. Seçmeler → kaba kurgu → gerekli grafik → ince kurgu → ses → renk sırası. Anlamı oturmayan cümleyi B-roll ile saklama.
2. **B-roll stratejisi:** Kilit cümleyi görselleştir, konuşma kesimini ört veya birazdan gelecek fikri ima et. Mekân, iş ayrıntısı, seyirci tepkisi ve kulis planları yalnız “boşluk doldurucu” olmasın.
3. **Röportaj:** Cümleyi ve nefesi doğal tut; kesimi jest veya vurgulu kelimeye oturt. Ses sürekliliği için J/L cut; görünür jump cut için ilgili B-roll veya arşiv kullan.
4. **Açılış ve karakter:** İlk planlar filmin ışık, tempo ve ses dilini ilan eder. Hikâye ilerlerken kişinin sıradan işini veya dürüst tepkisini gösteren karakter anları nefes verir.
5. **Eşitleme:** Farklı kamera, ışık ve mekânların pozlama, beyaz dengesi ve ten tonunu eşleştir. Önce kurgu kilidi, sonra renk.

## 4. İş türüne göre reçeteler

Süreler briefe ve platforma göre uyarlanacak **başlangıç aralıklarıdır**, performans garantisi değildir.

| Tür | Süre | Ritim | Yapı | Müzik | Geçiş tercihi |
|---|---|---|---|---|---|
| Reels/TikTok | Kısa; brief belirler | İlk anda güçlü, içerikte değişken | Kanca → vaat → kanıt/değer → tek CTA | Sesin altında, vurguda yükselir | Düz/jump cut; anlamlı match cut |
| YouTube uzun video | Konunun gerektirdiği kadar | Bölümler arası nefes | Açılış vaadi → bölümler → sonuç | Konuşmayı örtmez | Düz kesim; bölüm ayrımında ölçülü geçiş |
| Reklam/tanıtım filmi | 15 / 30 / 60 sn varyantları | Vurucu ve kontrollü | Fikir/kanca → his/kanıt → marka → CTA | Marka hissini taşır | Düz kesim; gerekirse match cut |
| Kurumsal tanıtım | Brief süresi | Güven veren, net | Problem → yaklaşım → gerçek iş/insan → sonuç | Ölçülü | Düz kesim, sahne değişiminde ses köprüsü |
| Etkinlik aftermovie | Brief süresi | Enerji dalgaları | Mekân → hazırlık → zirve → tepki/kapanış | Canlı anlarla dengeli | Vuruşta düz kesim, seçici hız rampası |
| Ürün videosu | Platform/brief süresi | Detay ve faydaya göre | İhtiyaç → kullanım → ayırt edici his → CTA | Ürünün karakterine uygun | Hareket eşleşmesi veya düz kesim |
| Röportaj/testimonial | Hikâyenin gerektirdiği kadar | Doğal konuşma | Sorun → deneyim → somut değişim | Çok geride veya yok | J/L cut, cutaway |
| Gayrimenkul/mekân turu | Mekân ve platforma göre | Akıcı, yön duygusunu korur | Dış bağlam → giriş → ayırt edici alanlar → kapanış | Mekân tonuna uygun | Hareket yönünü koruyan düz/match cut |
| Düğün/özel gün | Teslim briefi | Duygusal yükseliş ve nefes | Hazırlık → karşılaşma → tören/zirve → kutlama | Söz ve ortam sesiyle uyumlu | J/L cut, anı destekleyen yumuşak geçiş |

Reklamda tek fikri seç; 15 saniyede ayrıntıları azalt, 30 ve 60 saniyede kanıt ile karaktere daha çok yer aç. Kurumsal işte mesaj ve kitleyi önce belirle. Etkinlikte mekân, tepki ve kulis B-roll'unu birlikte kur. Ürün ve mekân işinde özellik kadar kullanım hissini göster. Düğün ve testimonial'da gerçek ses duyguyu taşıyorsa müziği geri çek.

## 5. Ses tasarımı

Öncelik **diyalog → müzik → SFX**. Önce konuşmayı temizle: dip gürültüsü, patlama, kliplenme, kötü kesim ve tutarsız seviye. `essentialSound.autoMatch` ile başlangıç eşitlemesi yapılabilir; kulakla ve ölçerle kontrol et. `essentialSound.generateDucking` konuşmada müziği indirir; elle gözden geçir. Whoosh'un zirvesi kesime denk gelsin; geçişi gereksiz uzatmasın. Riser kesimden önce yükselip kesime götürsün. Sessizlik bazen en güçlü vurgu olduğundan otomatik temizlik sonucu dramatik nefesi silme. Reels ve YouTube için ses seviyesi hedefi seçerken platform güncel şartlarını ve teslim briefini kontrol et; tek LUFS sayısını evrensel kural sayma. Bu **genel uygulama**dır.

## 6. Renk

Sony FX30 S-Log3 düz kayıt için önce Sony'nin **resmî** S-Log3 → Rec.709 dönüşüm LUT'unu `lut.import` ve `lumetri.setInputLut` ile uygula. Sonra pozlama, beyaz dengesi, kontrast ve ten tonunda birincil düzeltme; en son yaratıcı look. `lumetri.applyPreset` görünüm başlangıcı olabilir, körlemesine tüm kliplere kopyalama. Önce farklı çekimleri eşleştir. **Kurgu kilitlenmeden grade yapma.** LUT birincil düzeltmenin yerine geçmez.

## Çok kameralı eşitleme ("biri yaz biri kış olmasın") — 2026-10-21 test edildi
1. **Zaman/ses senkronu:** `clip.createMulticam {"items":[...],"method":"audio","name":"..."}` — ses dalgası eşleştirmesi. Testte 2,30 sn kayma tam bulundu (`lagSamples` 110400 @48 kHz, `reliable: true`). Sonuçta `reliable:false` ya da düşük `confidence` gelirse: timecode (`method:"timecode"`), alkış/klaket işareti (`method:"marker"`) veya giriş noktası (`in`) ile dene; yine olmazsa kullanıcıya söyle. Ayrı ses kaydı (yaka/recorder) varsa referans o olur.
2. **Kamera kesimi:** `multicam.cutToCamera {camera, time}`; ses `multicam.editCameras {"audio":"camera1|all|switch"}` ile en temiz kaynaktan.
3. **Renk eşitleme:** Önce her kamerada birincil düzeltme (S-Log3 → resmi LUT, beyaz dengesi, pozlama). Sonra en iyi ışıklı açı (A-kam) referans: `lumetri.applyMatch {"clip":id,"referenceTime":ticks,"faceDetection":true}` (insan varsa yüz algılama açık). Testte renk farkı 0,083 → 0,020 (~%75 yakınlaşma). Ardından birkaç karede `render_frame` ile yan yana kontrol, gerekirse Lumetri ile ince ayar. Look/grade en son, eşitlenmiş görüntü üzerine.
4. **Ses seviyesi eşitleme:** `essentialSound.autoMatch {"clips":[...],"target":lufs}`; konuşma altı müzik `essentialSound.generateDucking`.
5. **Çekim önerisi (müşteriye/ekibe):** kameralarda aynı beyaz dengesi (Kelvin), kare hızı, enstantane ve picture profile; başta renk kartı + alkış; mümkünse ortak timecode.

## 7. Geçiş ve efekt disiplini

Düz kesim varsayılandır: düşünce, hareket veya duygu doğrudan ilerliyorsa kullan. Zaman/mekân sıçraması, anı veya bilinçli yumuşama gerekiyorsa dissolve, dip ya da ses köprüsü düşün. `sequence.applyVideoTransition` / `sequence.setTransition` ile geçiş uygula; kritik kareleri `render_frame` ile gör. Hız rampası, glitch, zoom ve whoosh yalnız vurguyu açıklıyorsa kullan. **Efekt hikâyeye hizmet etmiyorsa kullanma.**

## 8. KONTROL VE TESLİM KURALI — kullanıcı kararı, 2026-10-21

**Claude kurguyu bitirince DIŞA AKTARMAZ.** `file.saveAs` ile projeyi `.fcproj` olarak kaydeder ve FilmCraft'ta açık bırakır. `sequence_inspect` ve `render_frame` ile proje içinden kontrol eder. Kullanıcıya kontrol listesi ve açıkça **“kontrol et”** notu verir. `export.quick` veya `export.queue.*` yalnız kullanıcı **“oldu/al”** derse çalışır; kullanıcı isterse dışa aktarımı kendisi alır. Önceki FilmCraft örnek komut dizisindeki otomatik export adımı bu karara göre uygulanmaz.

## 9. Kurgu öncesi / sonrası kontrol listesi

**Önce:** Brief, amaç, kitle, platform, oran, süre ve marka sesini yaz; ham görüntü ve sesleri izle; hak/rıza durumunu doğrula; seçmeleri ve ana mesajı belirle; müzik/SFX kullanım hakkını kontrol et; dikey için güvenli alanı planla.

**Sonra:** İlk kare ve vaat çalışıyor mu? Her kesim duygu/hikâye/ritme hizmet ediyor mu? Altyazı doğru ve güvenli mi? Konuşma anlaşılır, müzik ducking'i doğal mı? B-roll ve grafik iddiaları doğru mu? Renk çekimler arasında tutarlı mı? CTA tek ve yerinde mi? Marka/rıza/kanıt kuralları sağlanıyor mu? `sequence_inspect` ve kritik `render_frame` kontrolleri tamam mı? `.fcproj` kaydedilip FilmCraft açık bırakıldı mı? Kullanıcıya **“kontrol et”** dendi mi?

## Kaynaklar

- Kasa: [[Sinematik Video Rehberi (Kapsamlı)]] · [[Çekim Stratejileri (Sinematik)]] · Oltaya Getirme - Hook & Lead Playbook · [[Tanıtım Videosu — Reklam Efsanesi Kancaları]]; kurguya ilişkin ses için `icerik-os/00-merkez/tone-of-voice.md`.
- FilmCraft komut eşlemesi: depodaki `.claude/skills/filmcraft-kurgu/SKILL.md` (2026-10-21 okuması).
- [Film editing techniques](https://www.storyblocks.com/resources/tutorials/film-editing-techniques) · [Vertical retention playbook](https://strategia-x.com/blog/2026-07-01-vertical-video-retention-editing-playbook) · [Short form retention](https://shortzly.com/blog/short-form-video-retention-strategies) · [Corporate editing](https://blaremedia.net/editing-techniques-for-corporate-videos) · [Music video editing and color](https://tryuncle.com/learn/davinci-resolve/davinci-resolve-music-video-editing-and-color-workflow) · [Whoosh sound](https://morphic.com/tr/resources/sounds/whoosh-sound-effect).
- [Short documentary story and B-roll](https://nofilmschool.com/2015/11/how-cut-short-documentary-films-part-two-building-story-adding-b-roll) · [Canon Cinema EOS](https://cinemaeos.canon.ca/?p=2841) · [Documentary edit worksheet](https://norwichuni.ac.uk/app/uploads/2022/05/nua_documentary_edit_worksheet.pdf) · [Short form safe zones](https://reap.video/blog/short-form-video-safe-zones) · [Vertical editing guide](https://clipspeed.ai/blog/vertical-video-editing-guide.html).
