# Kurulum

Bu rehber yeni bir macOS kurulumunu çalışır bir kurgu istasyonuna dönüştürür. Komutlar depodaki `kurulum.sh` ve `Brewfile` ile doğrulanmıştır; dış kaynağı depoda bulunmayan adımlar “doğrulanmadı” diye belirtilir.

## Ön koşullar

- Güncel macOS, yönetici erişimi ve yeterli boş disk.
- Apple Silicon için Homebrew'ün olağan yolu `/opt/homebrew`dür.
- Ağ bağlantısı; Node paketleri, modeller ve alt modüller indirilir.
- FilmCraft canlı köprüsü için 9876 numaralı yerel port boş olmalıdır.
- Ham medya ve model dosyaları için depo dışında alan ayırın.

## Sıfır Mac'ten kurulum

### 1. Komut satırı ve Homebrew

Önce Xcode Command Line Tools ve Homebrew'ü resmi Homebrew yönergesiyle kurun. Bu depoda Homebrew kurulum URL'si tutulmadığı için buraya uydurma bir komut konmamıştır. Ardından:


```sh
brew --version
```


### 2. Depoyu alt modüllerle alın


```sh
git clone --recursive https://github.com/Ustakalfa/kurgu-sistemi.git ~/kurgu-sistemi
cd ~/kurgu-sistemi
```


`https://github.com/Ustakalfa/kurgu-sistemi.git` yer tutucudur; gerçek genel depo adresi bu çalışma ağacında doğrulanmadı. Sonradan eksik alt modül için:


```sh
git submodule update --init --recursive
```


### 3. Paketler


```sh
brew bundle --file Brewfile
```


Betik ayrıca `uv tool install edge-tts`, `uv tool install auto-editor`, `npm install -g @openai/codex`, iki Ollama modeli ve Whisper modelini kurar:


```sh
./kurulum.sh --bagimliliklar
```


Whisper modeli `~/.local/share/whisper-cpp/models/ggml-small.bin` yoluna indirilir. İndirme tamamlanmadan kesildiyse sıfır baytlı dosyayı kaldırıp adımı yeniden çalıştırın.

### 4. Claude Code

Claude Code'un kurulum yöntemi bu depoda sabitlenmemiştir; resmi güncel kaynaktan kurun. Kurulumdan sonra `claude --version` ve sağlayıcının standart giriş akışını kullanın. Giriş komutunun adı depoda doğrulanmadı.

### 5. Codex CLI


```sh
npm install -g @openai/codex
codex --version
codex login
```


`codex login` depodaki betikte çağrılmıyor; güncel CLI'da giriş davranışını `codex --help` ile doğrulayın.

### 6. Antigravity agy

`gemini-run`, yürütülebilir dosyayı `~/.local/bin/agy` yolunda bekler. Kurulum ve giriş komutu depoda bulunmadığından doğrulanmadı; resmi Antigravity kaynağını kullanın. Son kontrol:


```sh
~/.local/bin/agy --help
```


### 7. Ollama


```sh
brew services start ollama
ollama pull qwen3.5:9b
ollama pull gemma4:e4b
ollama list
```


`yerel-run`, temizle için ilk modeli; diğer türler için ikinci modeli kullanır.

### 8. FilmCraft 0.17.1

FilmCraft.app 0.17.1 sürümünü resmi dağıtımından `/Applications/FilmCraft.app` konumuna yerleştirin. İndirme URL'si depoda doğrulanmadı. `filmcraft-cli` dosyası `~/.local/bin/filmcraft-cli` olmalı ve çalıştırılabilir olmalıdır.

Canlı mod: `./kurulum.sh --bin --mcp` eksik kontrol anahtarını `umask 077` ve `openssl rand -hex 32` ile `~/.config/filmcraft/control-token` yolunda üretir (izin 600), iki başlatıcıyı `~/.local/bin/` altına bağlar. Anahtarı depoya veya kasaya kopyalamayın.


```sh
filmcraft-ac [proje.fcproj]
```


MCP kayıtları:


```sh
claude mcp add filmcraft -- "$HOME/.local/bin/filmcraft-kopru" mcp --bridge 127.0.0.1:9876
claude mcp add filmcraft-headless -- "$HOME/.local/bin/filmcraft-cli" mcp
```


### 8b. Diğer Craft uygulamaları

EffectCraft, SoundCraft, PhotoCraft, VectorCraft ve PdfCraft ayrı uygulamalardır; resmi dağıtımlarından kurulur (indirme adresleri depoda doğrulanmadı). CLI'ler `~/.local/bin/<uygulama>-cli` konumunda olmalıdır; doğrulanan sürümler [Sürümler](surumler.md) sayfasındadır. `./kurulum.sh --bin --mcp` eksik PhotoCraft kontrol anahtarını da `~/.config/photocraft/control-token` yolunda üretir. Canlı köprü:

```sh
craft-ac effectcraft
```

`dogrula.sh` Craft CLI'leri çalışmazsa yalnız uyarı verir; FilmCraft sürümü beklenenden farklıysa da uyarı verir, hata saymaz.

### 8c. İsteğe bağlı gizlilik desenleri

Senkron ve doğrulama, depodaki genel desenlere (kullanıcı yolu, anahtar kalıpları) ek olarak `$HOME/.config/kurgu-sistemi/gizli-desenler.txt` dosyasındaki kişiye özel desenleri (müşteri, kişi, proje adları) de tarar. Dosya yoksa uyarı verilir. Biçim için `config/gizli-desenler.ornek.txt` dosyasına bakın; gerçek adları depoya yazmayın.

### 9. LUT ve yazı tipi

Sony S-Log3 teknik LUT dosyasını lisansına uygun şekilde kullanıcı LUT klasörüne koyun; kesin macOS hedef yolu bu depoda doğrulanmadı. FilmCraft içinden görünür olduğunu kontrol edin. Montserrat, Remotion'da `@remotion/google-fonts` ile yüklenir; sistem fontu zorunlu değildir.

### 10. Remotion


```sh
cd ~/kurgu-sistemi/remotion
npm ci
npm run tip
npm run studio
```


Doğrulanmış Node sürümleri için `remotion/NODE_SURUMU.md` dosyasına bakın.

## kurulum.sh seçenekleri

| Seçenek | Etki |
|---|---|
| `--kuru` | Komutları gösterir, çalıştırmaz; tek başına tüm bölümleri seçer |
| `--bagimliliklar` | Brewfile, uv araçları, Codex, Ollama modelleri ve Whisper modeli |
| `--skills` | HARITA'daki uygun becerileri `~/.claude/skills/` altına sembolik bağlar |
| `--bin` | `bin/*` araçlarını `~/.local/bin/` altına sembolik bağlar |
| `--mcp` | canlı ve başsız FilmCraft MCP kayıtlarını ekler |
| `--remotion` | `remotion/` içinde `npm ci` çalıştırır |
| `--claude-md` | `claude/CLAUDE.kurgu.md` işaretli bloğunu `~/.claude/CLAUDE.md` içine ekler veya günceller; diğer içeriği korur ve değişiklikte yedek alır |
| `--claude-md-kaldir` | yalnız işaretli kurgu bloğunu kaldırır; `--claude-md` ile birlikte kullanılamaz |
| `--guncelle-kancasi` | Claude Code SessionStart kancasını `~/.claude/settings.json` içine ekler; değişiklikten önce tarihli yedek alır |
| `--guncelle-kancasi-kaldir` | Yalnız güncelleme komutunu içeren kancayı kaldırır |
| `--hooks` | hookify kuruluysa `hooks/hookify.video-hatti.local.md` dosyasını proje `.claude/` dizinine bağlar; kurulu değilse bilgi verir |
| `--evet` | Genel değişiklikler için onay sorusunu atlar |
| `--hepsi` | bağımlılıklar, skills, bin, mcp, remotion, Claude bloğu, hooks ve güncelleme kancasını seçer; kaldırmayı seçmez |

Seçeneksiz çağrı kullanım metniyle çıkar. `--kuru` ile Claude bloğunun önerilen farkı gösterilir. `--claude-md-kaldir` yalnız işaretli bloğu çıkarır; var olan diğer Claude kuralları korunur.

Var olan hedef farklıysa betik onu `.yedek-YYYYMMDD-HHMMSS` sonekli ada taşır ve yeni sembolik bağ kurar.

## Doğrulama


```sh
./dogrula.sh
```


Betik shell ve Python sözdizimini, JSON dosyalarını, Remotion tip kontrolünü, araç self-testlerini, yasaklı metinleri ve sembolik bağları denetler. Sıfır çıkış kodu başarıdır.

## Güncelleme


```sh
cd ~/kurgu-sistemi
git pull
git submodule update --init --recursive
./kurulum.sh --hepsi
./dogrula.sh
```


Yerel değişiklik varsa `git pull` öncesi ne yapılacağına kullanıcı karar vermelidir.

## Kaldırma ve geri alma

Kurulum bağlantı kurduğu için hedef sembolik bağları elle kaldırmak geri alınabilir bir işlemdir; önce `ls -l` ile gerçekten bu depoya işaret ettiğini doğrulayın. Gerçek dosya ve klasör yedekleri `~/.claude/skills-yedek/<tarih>/` ve `~/.local/bin-yedek/<tarih>/` altında tutulur; özgün adına taşımadan önce hedefin boş olduğundan emin olun. Eski sembolik bağlar bu dizinlerdeki `baglar.txt` dosyasına `<ad> -> <eski hedef>` olarak kaydedilir; ilgili hedef dizinde şu tek satırlık zsh döngüsüyle geri bağlanabilir: `while IFS= read -r satir; do ad=${satir%% -> *}; hedef=${satir#* -> }; ln -s -- "$hedef" "$ad"; done < baglar.txt`. Depo silinse bile Homebrew paketleri, Ollama modelleri ve npm/uv araçları otomatik kaldırılmaz.

## Sık hatalar

| Belirti | Neden | Çözüm |
|---|---|---|
| alt modül uyarısı | recursive clone yapılmadı | `git submodule update --init --recursive` |
| `agy` yok | dış araç kurulmadı | resmi kurulumla `~/.local/bin/agy` oluştur |
| Ollama yanıt vermiyor | servis kapalı | `brew services start ollama` |
| Whisper modeli yok | indirme yarım | model yolunu ve dosya boyutunu kontrol et |
| MCP bağlanmıyor | uygulama/port kapalı | `filmcraft-ac` ile başlat |
| `npm ci` kilit hatası | Node/lock uyumsuz | doğrulanmış Node sürümünü kullan |
| font ağdan yüklenmiyor | ağ veya önbellek | ilk kurulumu ağ varken çalıştır |
| komut eski sürüm | bağlantı başka hedefe gidiyor | `which` ve `ls -l` ile bağı denetle |


Model ayarları `~/.config/kurgu-sistemi/modeller.env` dosyasındadır; örnek `config/modeller.ornek.env`.

## Birden fazla Mac

Her Mac'te depoyu alt modülleriyle klonlayıp kurun:

```sh
git clone --recursive <depo-adresi> ~/kurgu-sistemi
cd ~/kurgu-sistemi
./kurulum.sh --hepsi
```

`--hepsi`, `~/.local/bin/kurgu-guncelle` bağını ve Claude Code SessionStart kancasını da kurar. Oturum açılırken araç en fazla 15 saniye içinde güncellemeyi dener; başarılı denemeler arasında 60 dakika bekler. İnternet veya uzak depo erişilemezse sessizce çıkar. Commit edilmemiş değişiklik varsa ya da yerel dal uzaktan ilerideyse çekmez; sessiz olmayan çağrıda uyarır. Elle hemen denemek için `kurgu-guncelle --zorla` çalıştırın. Yeni `bin/` veya `skills/HARITA.md` girdisi geldiyse önerilen bağlantıları `./kurulum.sh --skills --bin` ile gözden geçirin.

Değişiklikleri depoda yapıp commit ve push edin; diğer Mac'ler güncellemeyi oradan alır. Özel Kurgu Dersleri yalnız sahibinin ana Mac'inde kalır. Diğer Mac'ler depodaki genel dersleri kullanır; farklı ders dosyası için `KURGU_DERSLERI` ayarlanabilir.
