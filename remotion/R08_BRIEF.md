# Reels 08 — NEXUS Makyaj Kutusu (Claude → Codex brief'i)

Yaratıcı kararlar (metin, sıra, ses, vurgu) Claude'undur; **birebir uygula**. Teknik belirsizlikte en mantıklısını seç, `R08_NOTLAR.md`'ye yaz.

## Kalıp: Reels07 ile aynı ev stili
`src/Reels07.tsx`'i örnek al ve aynı bileşen dilini kullan: `Zemin` (bordo radyal parıltı + ızgara), `Gren` + üstte kırmızı ilerleme çubuğu, `Vizor` (köşe çerçeveleri + ● REC sayacı; sağ üst etiket **"NEXUS · MAKYAJ KUTUSU"**), `Altyazi` (kelime kelime, Montserrat 800, 80 px, y=1430, büyük harf, vurgu kelimeleri kırmızı `renk.kirmizi`), `Bolum` rozeti (kırmızı numara + beyaz başlık, üstte), `Damga` (damga efekti), `Lazer`, `sp()` yayları, `marka.ts` renkleri/yazı tipi/iletişim. Yeni dosya: `src/Reels08.tsx`, `Root.tsx`'e `Reels08` kompozisyonu (1080×1920, 30 fps). Varlıklar: `public/reels/r08/`.

## Ürün görüntüsü: gerçek CAD animasyonu (şeffaf zeminli)
- Kaynak: `~/nexus-cad/reels/reels.py` (PyVista, gerçek CAD; çalışıyor). Bu betiği **yazı ve arka plan olmadan**, `transparent_background=True` ile, her sahne için ayrı **RGBA PNG dizisi** olarak üretecek şekilde uyarla (yeni dosya `~/nexus-cad/reels/klipler.py`; CAD kaynaklarına dokunma). Çıktı: `public/reels/r08/<klip>/0000.png…`. Remotion'da kare kare `<Img>` ile oynat.
- Ürün kadraj genişliğinin **%80–85'i**, y≈420–1350 bandında. Altyazı bandı (y 1400–1560) ürünle çakışmasın.
- Işık render3.py düzeni + arkadan kırmızımsı kenar ışığı (rim, `#C20D38`, düşük şiddet) — fildişi kutu bordo zeminde parlasın. Kutunun altına Remotion'da yumuşak koyu gölge elipsi.
- Klipler (süreler kare; 30 fps):
  - `k1_donus` 150: kapalı G1, karanlıktan yaklaşarak yarım tur dönüş, logo görünür.
  - `k2_kilit` 120: ön yüz; sağ sürgü açık→kilitli (kare 30–48), sol sürgü (kare 60–78); kamera önce sağ kilide yakın, sonra geri çekilip ikisi birden.
  - `k3_kapak` 120: kapak 0→102° (ease-out, kare 10–80), ayna görünür.
  - `k4_urunler` 120: açık G1-A + `g1_products()`, üstten-önden yavaş itme (fırça dayanağı hariç).
  - `k5_duzenler` 6×24: üstten sabit kamera, kapak açık, G1-A, B, C, D, E, F iç düzenleri (her biri ayrı alt klasör ya da tek dizide 24'er kare).
  - `k6_patlatma` 90: iç modül + bölücüler yukarı süzülür, kapak yukarı, sonra geri oturur.
  - `k7_g2` 90: G2 açık, üst tepsi kalkıp yana kayar.

## Seslendirme (edge-tts)
- Ses: `tr-TR-EmelNeural`, hız `+8%`. Her satır ayrı `public/reels/r08/voN.wav` (48 kHz). Whisper (whisper-cli, ggml-small, `-l tr`) ile her dosyayı yazıya dök; metinle karşılaştırıp `R08_NOTLAR.md`'ye yaz. Telaffuz yanlışsa yazımı düzelt (ör. "G2" → "Ge iki", "105" → "yüz beş") ve yeniden üret.
- Sahne zamanlamasını VO sürelerine göre kur (Reels07'deki `seslendirme` dizisi gibi `at`/`sure`/`alt` yapısı). Toplam hedef **32–36 sn**.

| # | Sahne / klip | VO metni (aynen) | Ekran altyazısı (öbekler; [kırmızı vurgu]) | Bölüm rozeti |
|---|---|---|---|---|
| 1 | Kanca — k1_donus başı, karanlıkta | Ruj nerede, fırça nerede, ayna nerede? | RUJ [NEREDE?] / FIRÇA [NEREDE?] / AYNA [NEREDE?] (her biri hızlı "pop" + titreme) | — |
| 2 | k1_donus devamı | Cevap basit: hepsi tek kutuda. | HEPSİ TEK [KUTUDA] | — |
| 3 | k2_kilit | İki gizli sürgü kilit. Dışarıda tek bir çıkıntı yok. | İKİ GİZLİ [KİLİT] / ÇIKINTI [YOK] — her kilitlenmede "KLİK" Damga'sı (kırmızı) | 01 KİLİT |
| 4 | k3_kapak | Kapağı aç, ayna hazır. Yüz beş derecede kendiliğinden durur. | AYNA [HAZIR] / 105°'DE [DURUR] | 02 AYNA |
| 5 | k4_urunler | Her bölme gerçek ürün ölçülerine göre çizildi. | HER [BÖLME] / GERÇEK [ÖLÇÜLERLE] | 03 DÜZEN |
| 6 | k5_duzenler (hızlı kesme, her kesmede küçük geçiş sesi) | Ruj, fırça, palet ya da bakım. Altı farklı iç düzen. | [6] FARKLI İÇ DÜZEN; ürünün altında rozet: kırmızı harf + beyaz ad (A Günlük Klasik, B Fırça Atölyesi, C Palet Ustası, D Ruj Koleksiyonu, E Bakım Mini, F Serbest Izgara) | 04 SEÇENEK |
| 7 | k6_patlatma | İçini sen seç, biz senin için üretelim. | İÇİNİ SEN [SEÇ] / BİZ [ÜRETELİM] | 05 SANA ÖZEL |
| 8 | k7_g2 | Daha fazlası mı lazım? İki katlı Ge iki. | DAHA [FAZLASI?] / İKİ KATLI [G2] | 06 G2 |
| 9 | ~~CTA~~ — **KALDIRILDI (kullanıcı kararı): sahne 9 ve vo9 KULLANILMAYACAK; sahne 8 doğrudan kapanışa bağlanır.** | — | — | — |
| 10 | Kapanış | (VO yok) | `public/reels/r07/logo-acilis.mp4`'ü r08'e kopyala ve Reels07 kapanış kartı gibi kullan; alt metin: "NEXUS STUDIO · Ankara" + `iletisim` (telefon, @nexusstudiocs) | — |

## Ses tasarımı
`src/sfx.ts` + `public/sfx/katalog.json`: kancada `acilis--hook`, sahne geçişlerinde `gecis--*` (yumuşak), kilit anlarında kısa tık/vurgu sesi (katalogdaki en uygun `vurgu--*`), kapak açılışında yumuşak bir whoosh, CTA'da `bildirim--ding`. Altta düşük seviyede (0,15–0,2) sürekli bir ortam/gerilim sesi Reels07 gibi. VO her zaman net duyulsun.

## Teslim
1. `npx remotion render src/index.ts Reels08 cikti/reels-08.mp4` (H.264, ses dahil).
2. `cikti/reels-08-kapak.png`: kanca sahnesinden kare.
3. `cikti/r08_kontrol/` içine her sahnenin ortasından bir kare (10 kare) + bir montaj jpg.
4. `R08_NOTLAR.md`: VO süreleri, whisper sonuçları, varsayımlar.
Hiçbir şey paylaşma/yükleme. Diğer Reels dosyalarını değiştirme (yalnız Root.tsx'e kayıt ekle).
