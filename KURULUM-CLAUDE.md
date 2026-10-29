# Claude Code için kurulum

If a user gives you this repository and asks you to install it, follow the steps below on their Mac. Explain each global change and obtain explicit approval before making it. Keep account sign-ins with the user.

## Ajan adımları

1. Depoyu nereye klonlayacağınızı kullanıcıya sorun; yanıt yoksa `~/kurgu-sistemi` önerin. `git clone --recursive <DEPO-URL-SI> ~/kurgu-sistemi` kullanın.
2. Depoda `./kurulum.sh --kuru` çalıştırın. Planlanan işlemleri ve eksikleri kullanıcıya özetleyin.
3. `~/.claude/skills`, `~/.local/bin`, `~/.config/kurgu-sistemi` ve Claude MCP kayıtları gibi genel değişiklikler için kullanıcının açık onayını alın. Onaydan sonra `./kurulum.sh --hepsi --evet` çalıştırın.
4. `./dogrula.sh` çalıştırın; hata varsa düzeltip yeniden doğrulayın.
5. Betiğin **ELLE YAPILACAKLAR** listesini tek tek anlatın: FilmCraft.app ve filmcraft-cli, agy girişi, Codex girişi, Claude girişi, Sony LUT, Montserrat ve SFX WAV dosyaları. FilmCraft indirmesini ve hesap girişlerini kullanıcı yapar. Şifre istemeyin. Ayrıntı: [kurulum rehberi](docs/kurulum.md).
6. Kullanıcının Codex planında kullanılabilen modelleri öğrenin. `~/.config/kurgu-sistemi/modeller.env` içindeki zincirleri kullanıcıyla birlikte düzenleyin; örnek [model ayarları](config/modeller.ornek.env).
7. Nexus marka varlıkları MIT kapsamı dışındadır. Kullanıcı kendi markası için `remotion/src/marka.ts` ve `remotion/public/logo/` içeriğini değiştirmelidir.
8. İlk testi [örnek iş](docs/ornek-is.md) akışıyla, kullanıcının kendi kısa videosunda kuru prova olarak yapın. Teslim onayı olmadan dışa aktarmayın.

## Yapılmayacaklar

- Kullanıcı onayı olmadan genel kullanıcı klasörlerine yazmayın.
- `curl|bash` ile kurulum yapmayın.
- Hesaplara giriş yapmayın; şifre istemeyin.
- `vendor/` içeriğini değiştirmeyin.
- Kullanıcı “al” demeden export almayın.

Sorun çıkarsa [sorun giderme](docs/sorun-giderme.md) belgesine bakın.
