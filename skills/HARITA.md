# Skill haritası

Kurulum `--skills` bu yolları kullanır. Aynı adlı dış skill için aşağıdaki tek kaynak seçilmiştir.

| Skill adı | Kaynak (depo içi yol) | Lisans | Ne işe yarar | Aşama |
| --- | --- | --- | --- | --- |
| avenox-graphics | vendor/avenoxskills/skills/avenox-graphics | MIT | HyperFrames ile marka kurallarına bağlı motion grafik kesitleri üretir ve bunları kesilmiş videonun üstüne ya da arasına birleştirir. | grafik/motion |
| avenox-roughcut | vendor/avenoxskills/skills/avenox-roughcut | MIT | Ham konuşma veya ekran kaydında transkripte dayanarak sessizlikleri ve hatalı/yeniden alınmış bölümleri kaba kurguda çıkarır. | kaba kurgu |
| avenox-thumbnail | vendor/avenoxskills/skills/avenox-thumbnail | MIT | Codex CLI üzerinden paralel görsel üretimiyle maskotlu, kısa kancalı ve YouTube A/B testine hazır yüksek tıklanma oranlı kapaklar oluşturur. | marka katmanı |
| avenox-video | vendor/avenoxskills/skills/avenox-video | MIT | Yerel çalışan Avenox Studio hattında uzun video kurgu, kesme, grafik, altyazı, ses ve render işlerini insan yönetmen onayıyla yönlendirir. | orkestrasyon |
| checking-delivery | vendor/done-is-a-claim/skills/checking-delivery | Apache-2.0 | Bir dosya, mesaj, dışa aktarım veya dağıtımın gerçek teslim hedefinde doğrulanmasını ve hazırlama, gönderim, yayın ile tüketici kontrolünün ayrılmasını sağlar. | teslim/denetim |
| collecting-worker-results | vendor/done-is-a-claim/skills/collecting-worker-results | Apache-2.0 | Duran bir çalışanın döndürdüğü iş, kanıt ve doğrulamayı inceleyerek kabul, yeniden deneme veya entegrasyon kararını verir. | teslim/denetim |
| sinema-kalitesi | skills/sinema-kalitesi | MIT | Video, grafik, efekt ve müzikte araç seçimi, birleştirme ve ölçümlü kalite kontrolü. | tüm üretim |
| filmcraft-kurgu | skills/filmcraft-kurgu | MIT | FilmCraft MCP ile kesme, renk, ses, altyazı ve basit grafik işlemlerini proje dosyasına uygulayıp görsel olarak doğrular. | ince kurgu |
| kurgu-ekip | skills/kurgu-ekip | MIT | Claude, Codex, Gemini ve yerel model arasındaki kurgu devrini ve teslim denetimini düzenler. | orkestrasyon |
| kurgu-ustasi | skills/kurgu-ustasi | MIT | Brief ve ham çekim klasöründen çekim-kontrol raporunu okuyup format, hikâye, ses, renk ve teslim adımlarını içeren kurgu planı çıkarır. | çekim kontrol |
| limit | vendor/avenoxskills/skills/limit | MIT | Claude ve Codex abonelik kullanım pencerelerini tek ekranda göstererek iş devretmeden önce kota kontrolü yapılmasını sağlar. | orkestrasyon |
| cut-mistakes | vendor/herk-edit-kit/.claude/skills/cut-mistakes | MIT | Kelime düzeyli transkriptten kekeleme, tekrar, falso başlangıç ve tekrar çekim adaylarını gerekçeleriyle önerir, onaylanan kesimleri ffmpeg ile uygular. | ince kurgu |
| cut-silences | vendor/herk-edit-kit/.claude/skills/cut-silences | MIT | Ham konuşma videosu ile kelime düzeyli transkriptten uzun duraklamaları kesip EDL, yeniden zamanlanmış transkript ve isteğe bağlı video üretir. | kaba kurgu |
| edit-video | vendor/herk-edit-kit/.claude/skills/edit-video | MIT | Ham konuşma videosunu transkript, sessizlik ve hata kesimi, görsel anlatı, motion grafik ve doğrulanmış render adımlarıyla tamamlanmış kurguya dönüştürür. | ince kurgu |
| gsap | vendor/herk-edit-kit/.claude/skills/gsap | MIT | HyperFrames kompozisyonları için GSAP tween, timeline, easing ve performans kurallarıyla animasyon kodu yazar. | grafik/motion |
| hyperframes | vendor/hyperframes/skills/hyperframes | Apache-2.0 | Brief, URL, tasarım, çekim veya müzik girdisini değerlendirip uygun HyperFrames video iş akışını seçer, projeyi denetler ve render sürecini yönetir. | orkestrasyon |
| hyperframes-cli | vendor/hyperframes/skills/hyperframes-cli | Apache-2.0 | HyperFrames projelerini başlatma, kontrol, önizleme, kare alma, karşılaştırma ve yerel ya da bulut render komutlarıyla geliştirir. | teslim/denetim |
| hyperframes-registry | vendor/hyperframes/skills/hyperframes-registry | Apache-2.0 | İstenen efekt veya görsel tanımdan kayıtlı HyperFrames bloklarını arar, bileşeni kurar ve kompozisyona bağlar. | grafik/motion |
| hyperframes-video-beats | vendor/herk-edit-kit/.claude/skills/hyperframes-video-beats | MIT | Konuşma videosu ve transkriptten zamanlanmış motion-grafik vuruşları, callout’lar ve retention görselleri planlayıp doğrular. | grafik/motion |
| make-a-video | vendor/herk-edit-kit/.claude/skills/make-a-video | MIT | Konsept veya senaryo girdisiyle formatı netleştirir, aşamalı plan ve görsel doğrulama kapılarından geçerek MP4 video oluşturur. | orkestrasyon |
| motion-showreel | vendor/herk-edit-kit/.claude/skills/motion-showreel | MIT | Marka motifini BPM’e kilitli bölümler, HUD ve logo kapanışıyla 10–30 saniyelik motion showreel’e dönüştürür. | marka katmanı |
| short-form-edit | vendor/herk-edit-kit/.claude/skills/short-form-edit | MIT | Konuşma videosunu merak uyandıran açılış, hikâye kesimleri, B-roll, zamanlı grafik, altyazı, müzik ve SFX ile dikey kısa videoya dönüştürür. | ince kurgu |
| short-form-video | vendor/herk-edit-kit/.claude/skills/short-form-video | MIT | Mevcut May Shorts örneklerini yüz katmanı, sahne bindirmesi ve karaoke altyazı iskeletiyle bakım amacıyla günceller. | ince kurgu |
| style-library | vendor/herk-edit-kit/.claude/skills/style-library | MIT | Projenin motion-grafik kart kitaplığından stile ve amaca uygun şablonu seçer, özelleştirir ve kompozisyona yerleştirir. | marka katmanı |
| video-storytelling | vendor/herk-edit-kit/.claude/skills/video-storytelling | MIT | Uzun konuşma videosunun senaryo veya transkriptini, kamera dili ve zamanlaması tutarlı tek bir görsel dünyaya dönüştürür. | ince kurgu |
| website-to-hyperframes | vendor/herk-edit-kit/.claude/skills/website-to-hyperframes | MIT | Verilen web sitesini yakalayıp marka varlıkları ve anlatım senaryosundan HyperFrames tanıtım videosu üretir. | grafik/motion |
| embedded-captions | vendor/hyperframes/skills/embedded-captions | Apache-2.0 | Tek kişilik konuşma videosuna görüntüyü kesmeden transkripsiyon ve konu maskeleme ile seçilen stilde gömülü altyazı ekler. | altyazı |
| faceless-explainer | vendor/hyperframes/skills/faceless-explainer | Apache-2.0 | Senaryo veya briefi, anlatım ve görsel varlıklarla yüz göstermeyen açıklayıcı HyperFrames videosuna dönüştürür. | grafik/motion |
| general-video | vendor/hyperframes/skills/general-video | Apache-2.0 | Metin briefi, medya veya senaryo girdisinden uygun yapı ve kompozisyonları seçerek genel amaçlı video üretir. | grafik/motion |
| hyperframes-animation | vendor/hyperframes/skills/hyperframes-animation | Apache-2.0 | HyperFrames sahneleri için zamanlama, easing, keyframe ve kompozisyon kurallarıyla animasyon tasarlar. | grafik/motion |
| hyperframes-audio | vendor/hyperframes/skills/hyperframes-audio | Apache-2.0 | Video projesindeki anlatım, müzik ve ses efektlerini zamanlar, karıştırır ve render öncesi ses kurallarını denetler. | ince kurgu |
| hyperframes-core | vendor/hyperframes/skills/hyperframes-core | Apache-2.0 | HyperFrames projesinin temel dosya yapısını, kompozisyon sözleşmesini ve doğrulama kurallarını kurar. | orkestrasyon |
| hyperframes-creative | vendor/hyperframes/skills/hyperframes-creative | Apache-2.0 | Brief ve marka sinyallerinden görsel yön, sahne fikri ve uygulamaya hazır yaratıcı kararlar üretir. | grafik/motion |
| hyperframes-keyframes | vendor/hyperframes/skills/hyperframes-keyframes | Apache-2.0 | Zamanlanmış özellik değerlerinden HyperFrames animasyon keyframe’lerini ve geçişlerini oluşturur. | grafik/motion |
| hyperframes-studio | vendor/hyperframes/skills/hyperframes-studio | Apache-2.0 | HyperFrames kompozisyonunu Studio’da önizleyip zaman çizelgesi üzerinden düzenleme ve hata ayıklama yapar. | teslim/denetim |
| media-use | vendor/hyperframes/skills/media-use | Apache-2.0 | Brief için müzik, SFX, görsel, logo ve medya varlıklarını kaynak/provenans bilgisiyle bulur, edinir ve projeye yerleştirir. | marka katmanı |
| motion-graphics | vendor/hyperframes/skills/motion-graphics | Apache-2.0 | Metin, veri veya marka varlıklarını animasyonlu başlık, callout, kart ve geçişlerden oluşan motion grafiğe dönüştürür. | grafik/motion |
| music-to-video | vendor/hyperframes/skills/music-to-video | Apache-2.0 | Bir müzik parçası ve isteğe bağlı medyadan beat haritası, storyboard ve senkronize HyperFrames video üretir. | grafik/motion |
| product-launch-video | vendor/hyperframes/skills/product-launch-video | Apache-2.0 | Ürün URL’si, script veya briefi yakalayıp marka ve ürün ekranlarını içeren lansman ya da tanıtım videosu oluşturur. | marka katmanı |
| slideshow | vendor/hyperframes/skills/slideshow | Apache-2.0 | İçerik veya mevcut sayfayı slayt, fragman, dallanma, hotspot ve konuşmacı notları içeren gezilebilir sunuma dönüştürür. | grafik/motion |
| talking-head-recut | vendor/hyperframes/skills/talking-head-recut | Apache-2.0 | Mevcut konuşma videosunu değiştirmeden transkripte senkron başlık, alt bant, veri kartı ve PiP bindirmeleriyle paketler. | grafik/motion |
| remotion-best-practices | vendor/remotion-skills/skills/remotion-best-practices | Lisans dosyası yok; yalnız alt modül | Remotion video veya kompozisyon isteğini doğru alt skill’e yönlendirip mevcut proje değişikliklerini korur. | orkestrasyon |
| remotion-captions | vendor/remotion-skills/skills/remotion-captions | Lisans dosyası yok; yalnız alt modül | Altyazı zamanlamasını Caption JSON biçiminde işleyip Remotion’da gösterme ve canlandırma kurallarını uygular. | altyazı |
| remotion-create | vendor/remotion-skills/skills/remotion-create | Lisans dosyası yok; yalnız alt modül | Uygun klasörde yeni Remotion projesi ve video kompozisyonu iskeleti oluşturur. | grafik/motion |
| remotion-docs | vendor/remotion-skills/skills/remotion-docs | Lisans dosyası yok; yalnız alt modül | İstenen Remotion özelliği için güncel dokümantasyonu arayıp uygulanabilir kaynak ve örnekleri bulur. | izleme/analiz |
| remotion-interactivity | vendor/remotion-skills/skills/remotion-interactivity | Lisans dosyası yok; yalnız alt modül | Remotion JSX katmanlarını Studio’da bağımsız seçilip taşınabilir, kırpılabilir ve stillenebilir zaman çizelgesi öğeleri olarak yapılandırır. | grafik/motion |
| remotion-maps | vendor/remotion-skills/skills/remotion-maps | Lisans dosyası yok; yalnız alt modül | İstenen harita çekimi için uygun tekniği seçip statik, Mapbox veya animasyonlu Remotion haritası kurar. | grafik/motion |
| remotion-markup | vendor/remotion-skills/skills/remotion-markup | Lisans dosyası yok; yalnız alt modül | Remotion React sahneleri için içerik, animasyon, efekt ve kullanıcı değişikliklerini koruma kurallarını uygular. | grafik/motion |
| remotion-multimedia | vendor/remotion-skills/skills/remotion-multimedia | Lisans dosyası yok; yalnız alt modül | Mediabunny ile tarayıcıdaki ses ve video dosyalarının süre, boyut ve medya bilgisini okur. | izleme/analiz |
| remotion-render | vendor/remotion-skills/skills/remotion-render | Lisans dosyası yok; yalnız alt modül | Remotion kompozisyonunu CLI ile video veya kare olarak render edip çıktı ayarlarını uygular. | teslim/denetim |
| remotion-studio | vendor/remotion-skills/skills/remotion-studio | Lisans dosyası yok; yalnız alt modül | Remotion Studio’yu açıp kompozisyonun canlı önizlemesi üzerinden video düzenlemeyi yönlendirir. | teslim/denetim |
