# Ekipman ve 4K İş Akışı

Bu belge yalnız teknik kapasite ve iş akışı önerilerini içerir. Envanter ve sahiplik ayrıntılarına girmez. Bazı değerler sağlanan teknik notlardan alınmıştır; gerçek cihaz menüsünde ve üretici kılavuzunda çekim öncesi doğrulanmalıdır.

## Kamera A — Super 35 sinema gövdesi

| Alan | Teknik bilgi |
|---|---|
| Sensör | 26 MP APS-C / Super 35, arkadan aydınlatmalı CMOS |
| İşlemci | BIONZ XR |
| Dahili kayıt | UHD 4K, 10-bit 4:2:2 |
| Codec düzeni | Long GOP veya All-Intra |
| Kare hızları | UHD 4K'da 60 fps'e kadar; 4K 120 fps kırpmalı |
| Yüksek hız | Full HD 240 fps'e kadar |
| Harici çıkış | Uyumlu kaydediciyle HDMI üzerinden 16-bit RAW not edilmiş |
| Dinamik aralık | teknik notta 14+ stop |
| Gamma/look | S-Log3 ve hızlı teslim için S-Cinetone |
| Stabilizasyon | 5 eksenli gövde içi |
| Odak | gerçek zamanlı takip ve nesne algılama |

### Önerilen kayıt ayarı

Ana kurgu için 4K, 10-bit, 4:2:2 seçin. Zaman çizelgesi 25 fps ise olağan hareket 25p/1/50; yavaşlatma için 50p/1/100 iyi başlangıçtır. 30/60 ailesinde 180 derece ilkesini koruyun. Işık titreşimi olan mekânda yerel şebekeye göre test çekimi yapın.

S-Log3 yalnız renk düzenleme yapılacaksa seçilmelidir. Pozlamayı waveform/zebra ile kurun; Log görüntünün soluk görünmesi normaldir. Kırpılmış parlak alan geri getirilemez. Çekim kartında kamera metadata yan dosyalarını koruyun.

## Kamera B — yüksek çözünürlüklü hibrit gövde

| Alan | Teknik bilgi |
|---|---|
| Sensör | 40,2 MP X-Trans CMOS 5 HR |
| İşlemci | X-Processor 5 |
| Video | 6.2K/30p dahili, 4:2:2 10-bit |
| 4K | DCI 4K/60p; 4K/30p HQ modu |
| Log | F-Log2; teknik notta 13+ stop |
| Stabilizasyon | 7 stop gövde içi |
| Odak | yüz/göz ve konu algılama |
| Kullanım | hafif B kamera, fotoğraf, dikey/sosyal çekim |

İki kamera birlikteyse gamma, beyaz dengesi, kare hızı ve enstantaneyi çekimden önce eşleştirin. S-Log3 ve F-Log2 aynı LUT ile dönüştürülmez; her kaynak önce kendi teknik dönüşümünden geçer, sonra ortak görünümde eşleştirilir.

## Ses

Kablosuz saha mikrofonu kullanılabilir. Ana ve emniyet kanalını ayrı seviyelerde kaydetmek, konuşma tepesini yaklaşık -12 dBFS çevresinde tutmak ve çekim öncesi kulaklıkla rüzgâr/sürtünme denetimi yapmak önerilir. Kamera sesi senkron referansı olarak açık kalmalıdır. Kurgu çalışma örnekleme hızı 48 kHz'tir.

## Depolama ve kart disiplini

1. Çekimden önce kartı kamerada biçimlendirin; doğru kart hız sınıfını kamera kılavuzundan doğrulayın.
2. Her kamera ve ses aygıtı için ayrı klasör kullanın.
3. Kartı kopyalarken tüm klasör yapısını ve metadata dosyalarını koruyun.
4. En az iki bağımsız kopya doğrulanmadan kartı silmeyin.
5. Klip sayısı ve toplam baytı kaynakla karşılaştırın.
6. Ham, proxy, önizleme ve teslimi aynı klasöre koymayın.
7. Proje kapanınca proje dosyası, LUT, font/lisans notu ve teslim sağlama bilgisini arşivleyin.

## Kurgu bilgisayarı

Teknik nottaki Apple Silicon dizüstü yapılandırması 10 çekirdek CPU, yapılandırmaya göre 8/10 çekirdek GPU ve 16–32 GB birleşik bellek aralığı taşır. Bellek ve SSD sonradan yükseltilemez. Fansız gövdede uzun 4K/6K render sırasında sürdürülebilir hız kısa testten düşük olabilir. Dahili diski ham medya arşivi gibi doldurmayın; işletim sistemi, önbellek ve render için boş alan bırakın.

## Tablet

M2 sınıfı tablet, 8 çekirdek CPU, 10 çekirdek GPU ve 8 GB bellekle saha izleme, not, storyboard ve hafif 4K kesme için uygundur. Uzun çok katmanlı 4K/6K kurgu ve nihai render masaüstü iş istasyonunda tutulmalıdır. Tablet inceleme ekranıdır; tek renk referansı değildir.

## Proxy iş akışı

1. Ham dosyaları değişmeden `01-ham/` altında tutun.
2. 6.2K, 4K All-Intra veya çok kameralı işte düşük çözünürlüklü proxy üretin.
3. Proxy adında kaynak klip gövdesini koruyun.
4. Proxy fps ve ses başlangıcını kaynakla aynı tutun.
5. Kaba/ince kurguyu proxy ile yapın.
6. Renk öncesi tam çözünürlük kaynağa yeniden bağlayın.
7. Çevrimdışı veya yanlış bağlı medya olup olmadığını kare kare örnekleyin.
8. Renk, gürültü azaltma, keskinlik ve nihai grafik denetimini kaynakta yapın.
9. Önce düşük boyutlu inceleme çıktısı alın.
10. Onay sonrası 4K çıktıyı kaynak medyadan üretin.

## 4K teslim kontrolü

| Kontrol | Kabul |
|---|---|
| Boyut | hedefe göre 3840×2160 veya 2160×3840 |
| FPS | sekans ve teslim şartıyla aynı |
| Renk | teknik dönüşüm tek; scope taşması yok |
| Ses | 48 kHz; konuşma açık; taşma yok |
| Codec/bitrate | teslim platformu şartıyla doğrulanmış |
| İlk/son kare | siyah/boş/yarım grafik yok |
| Dosya | baştan sona oynuyor ve ffprobe okuyabiliyor |

Telefon ve başka aygıt ayrıntıları sağlanan kaynaklarda yeterince doğrulanmadığı için bu rehbere eklenmedi.

