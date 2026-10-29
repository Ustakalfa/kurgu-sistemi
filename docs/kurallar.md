# Kurgu sistemi kuralları

Kaynak: kişisel çalışma notlarının müşteri ve hesap bilgisi çıkarılmış taşınabilir özeti. Tarihler, kararların notlara işlendiği günlerdir.

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
