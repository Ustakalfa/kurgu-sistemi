---
tur: kavram
etiketler: [video, kurgu, geri-bildirim, nexus]
olusturuldu: 2026-10-21
guncellendi: 2026-10-29
kaynak_sayisi: 0
durum: taslak
---

# Kurgu Dersleri — kullanıcının geri bildirim defteri

Her kurgudan sonra kullanıcının düzeltme ve beğeni notları buraya **tarihli** işlenir. Claude her kurgu planından önce bu sayfayı okur; tekrar eden notlar zamanla [[Kurgu Ustalığı Rehberi]]'ne kalıcı kural olarak taşınır.

Biçim: `- [YYYY-AA-GG] iş adı (müşteri/Nexus, 9:16|16:9) — not → çıkarılan kural`

## Genel zevk (Mehmet Esat)

### Genel kurallar
- [2026-10-28] "Bundan sonra her videoyu mutlaka renk düzenlemesinden geçir." → Her kurgu, kilitlendikten sonra ve dışa aktarmadan önce renk düzenlemesinden geçer: S-Log3 ise önce Sony resmî LUT; scopes.read (waveform, parade, vektörskop) ile pozlama, beyaz denge ve ten rengi ölçülerek düzeltilir; dikkat dağıtan parlak alanlar (ekran, pencere) bastırılır; farklı çekimler lumetri.applyMatch ile eşlenir; marka look'u en son ve hafif. Önce/sonra kareleri yan yana kullanıcıya gösterilir. 8 bit kaynakta sert grade yok (bantlanma).
- [2026-10-28] "Videoları sakın HD render alma, hepsi 4K olacak." → Sekans baştan 4K kurulur (dikey 2160×3840, yatay 3840×2160); dışa aktarma 4K (Match Source – Adaptive High Bitrate, ~50 Mbps). Kapaklar da 2160×3840.
- [2026-10-25] Bir özel gün videosu (9:16) — "Sunum gibi olmasın" (4 kez tekrarladı) → ortada sert kenarlı fotoğraf + başlık kartı + siyah zeminde bekleyen yazı = slayt. Kural: görseller tam ekran ya da kenarları ekran dışına taşan, karanlığa eriyen; sürekli kamera hareketi + parallax; film yanığı/ışık sızması/whip geçişleri; yazı kelime kelime ve az.
- [2026-10-25] Aynı iş — "Senaryoyu adam akıllı yap", "29 Ekim'in hikâyesi belli olsun" → kural: özel gün işinde slogan değil, saat damgalı gerçek hikâye (28 Ekim gecesi → 20.30 → 101 pare → bugün); kanca 0. saniyede cümleyle.
- [2026-10-25] Aynı iş — seslendirme + arkada "kısık ama belli" müzik istedi → kural: müzik konuşma altında ~-20 dB, aralarda ~-14 dB, kapanışta öne çıkar.

- [2026-10-25] Aynı iş v8 — "Seste konuşmalar yok" (gönderdiğim ses dosyasında seslendirme -35 LUFS'ta, müzik altında kaybolmuştu; toplam LUFS'a bakıp onayladım) → KURAL: sesi göndermeden önce konuşma ile müzik ayrı ayrı ve saniye saniye ölçülür; konuşma müzikten en az ~10 dB yüksek olmalı. Toplam -14 LUFS tek başına onay değildir.
- [2026-10-25] Aynı iş — "Nexus Reels'lerinde nasıl yapıyorduk öyle yap" → KURAL: önce depodaki Nexus Video/Remotion hattı; ses Remotion'da katman katman (her VO cümlesi kendi Sequence'ında volume=1, müzik ayrı Audio düşük volume), önceden karıştırılmış tek WAV'a güvenme.
- [2026-10-25] Aynı iş — top/bas "davul" vuruşları, turuncu ışık patlaması, flaş+sarsıntı, dev bayrak süpürmesi, whip beğenilmedi; mekan görselleri ve tam ekran gökyüzü/gece bayrak videoları beğenilmedi; kelime kelime yazı ve daktilo damga kaldı. Müziği kullanıcı seçti (İzmir Marşı Epic, Jeretar) ve "asıl başlangıç 1:10" dedi → kullanıcının verdiği müziğin önerdiği noktadan başla, kesmeleri ölçü başına oturt.

- [2026-10-26] Aynı iş v9 — "Kapanış can alıcı değil" + "bayrak belli olmuyor" → kural: kapanış müziğin en güçlü vuruşuna otursun ve 5-7 sn sürsün (yazısız dev bayrak anı → büyük sayı/mesaj → imza/logo); kalabalık uzun söz kapanışa konmaz. Bayrak katmanında maske kumaşı kesiyor muydu diye karede kontrol et; fotoğraflı planlarda ~0.2, koyu planlarda ~0.3, yüzlü planlarda ~0.12.
- [2026-10-26] Aynı iş v10 — "Bayrakta takılma ve bozulmalar var" → kural: stok videoyu yavaşlatırken ara kare üretme (minterpolate) ve ileri-geri (palindrom) döngü kullanma; yüksek fps kaynağı düşük fps'e 1:1 yeniden zamanla (60→30 = 0,5×), uzun süre gerekiyorsa klibi sahne kesmelerinde yeniden başlat; Remotion'da `OffthreadVideo` kullan; teslimden önce donmuş kare ölç (signalstats YDIF).
- [2026-10-27] Aynı iş v11 — sentetik ses uygun bulunmadı; kullanıcı ElevenLabs'te seslendirdi, sonuç "çok güzel oldu" → kural: müşteri işinde seslendirme ElevenLabs/insan sesiyle (kullanıcı üretir), Claude cümlelere böler, hızlandırmadan yerleştirir; teslim öncesi karışık ses whisper ile yazıya dökülüp her cümlenin müzik altından okunduğu doğrulanır.

## Müşteriye özel
Müşteriye özel notlar özel kasada tutulur.

## Teknik
- [2026-10-29] FilmCraft `export --preset` altyazı izini videoya yakmayabiliyor (burnCaptions varsayılan kapalı) → altyazılı Reels'i `file.exportMedia` ile `burnCaptions: true` vererek al; teslimden önce çıktıdan altyazılı bir kare çıkarıp bak.
- [2026-10-27] FilmCraft dışa aktarmada loudness efektinin true_peak_dbtp sınırı uygulanmıyor → teslimden önce her çıktıyı loudnorm ile ölç; tepe > -1 dBTP ise ffmpeg ile yalnız sesi sınırla (192 kHz'e yükseltme, alimiter limit=0.79 attack=2 release=80, sonra 48 kHz; -c:v copy).

## Kaçınılacaklar
- [2026-10-25] Atatürk/bayrakla aynı karede alkol; bayrağa yazı/logo bindirmek; bayrak rengini "marka tonuna" çekmek; AI ile Atatürk yüzü; özel güne başka tarihin sembolünü zorlamak (29 Ekim'e "Başöğretmen"/1928 → Gemini haklı çıktı).

Bağlantılar: [[Kurgu Ustalığı Rehberi]] · [[Sinematik Video Rehberi (Kapsamlı)]] · Nexus Studio CS · Müzik & Yaratım
