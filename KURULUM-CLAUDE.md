# Claude Code için kurulum

Bu depoyu kurmanız istendiyse şu adımları Mac üzerinde uygulayın. Genel kullanıcı klasörlerinde yapılacak değişiklikleri ve eklenecek Claude kural bloğunu kullanıcıya gösterip açık onay alın. Hesap girişlerini kullanıcı yapar.

1. Depoyu nereye klonlayacağınızı sorun; yanıt yoksa `~/kurgu-sistemi` önerin. `git clone --recursive https://github.com/Ustakalfa/kurgu-sistemi.git ~/kurgu-sistemi` kullanın.
2. Depoda `./kurulum.sh --kuru` çalıştırın. Özellikle `claude/CLAUDE.kurgu.md` bloğunun `~/.claude/CLAUDE.md` içine eklenecek farkını, `--hooks` kuralının proje `.claude/` konumunu ve diğer genel değişiklikleri gösterin.
3. Kullanıcının açık onayından sonra `./kurulum.sh --hepsi --evet` çalıştırın. `--hepsi`, `--claude-md`, `--hooks` ve `--guncelle-kancasi` seçeneklerini içerir; genel onay `~/.claude/settings.json` SessionStart kancasını da kapsar. `--claude-md` var olan işaretli bloğu günceller; yoksa ekler ve önce genel dosyayı tarihli yedekler. İstenirse `--claude-md-kaldir` yalnız işaretli bloğu siler. Hookify eklentisi yoksa betik bunu bildirir.
4. `./dogrula.sh` çalıştırın; hata varsa düzeltip yeniden doğrulayın. Kişiye özel gizlilik desenleri isteğe bağlıdır: `config/gizli-desenler.ornek.txt` örneğine bakarak `$HOME/.config/kurgu-sistemi/gizli-desenler.txt` oluşturulabilir.
5. Betiğin **ELLE YAPILACAKLAR** listesini anlatın: FilmCraft.app ve filmcraft-cli, agy ve Codex/Claude girişleri, Sony LUT, Montserrat ve SFX WAV. Craft uygulamaları (FilmCraft, EffectCraft, SoundCraft, PhotoCraft, VectorCraft, PdfCraft) ayrı kurulur; canlı köprüler `craft-ac <uygulama>` / `filmcraft-ac` ile anahtarla açılır. FilmCraft indirmesini ve girişleri kullanıcı yapar. Şifre istemeyin. Ayrıntı: [kurulum rehberi](docs/kurulum.md).
6. Kullanılabilir Codex modellerini öğrenip `$HOME/.config/kurgu-sistemi/modeller.env` zincirlerini kullanıcıyla düzenleyin; örnek `config/modeller.ornek.env`.
7. Depodaki örnek marka varlıkları yerine kullanıcının kendi markası için `remotion/src/marka.ts` ve `remotion/public/logo/` içeriğini uyarlayın.
8. Kullanıcının kısa videosuyla `docs/ornek-is.md` akışını kuru prova edin. Kullanıcı “al” demeden export almayın.
9. **Kabul testi:** Depo **dışındaki** bir klasörde yeni Claude oturumu açıp “şu klasördeki videoyu kurgula” isteğini verin. Claude'un `kurgu-ustasi` skill'ini açtığını, `gemini-run video` ve `codex-run` devrini planladığını, baştan 4K sekans, her videoda renk ve `.fcproj` kaydedip onaysız export almama kurallarını söylediğini kontrol edin.

Kullanıcı onayı olmadan genel klasörlere yazmayın. `curl|bash` kullanmayın. `vendor/` içeriğini değiştirmeyin. Sorun için `docs/sorun-giderme.md` dosyasına bakın.
