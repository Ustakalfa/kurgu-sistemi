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

### 8. FilmCraft 0.10.0

FilmCraft.app 0.10.0 sürümünü resmi dağıtımından `/Applications/FilmCraft.app` konumuna yerleştirin. İndirme URL'si depoda doğrulanmadı. `filmcraft-cli` dosyası `~/.local/bin/filmcraft-cli` olmalı ve çalıştırılabilir olmalıdır.

Canlı mod:


```sh
open -a FilmCraft --args --control 9876
```


MCP kayıtları:


```sh
claude mcp add filmcraft -- "$HOME/.local/bin/filmcraft-cli" mcp --bridge 127.0.0.1:9876
claude mcp add filmcraft-headless -- "$HOME/.local/bin/filmcraft-cli" mcp
```


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
| `--evet` | Genel değişiklikler için onay sorusunu atlar |
| `--hepsi` | yukarıdaki beş kurulum bölümünün tümünü seçer |

Seçeneksiz çağrı kullanım metniyle çıkar. Var olan hedef farklıysa betik onu `.yedek-YYYYMMDD-HHMMSS` sonekli ada taşır ve yeni sembolik bağ kurar.

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

Kurulum bağlantı kurduğu için hedef sembolik bağları elle kaldırmak geri alınabilir bir işlemdir; önce `ls -l` ile gerçekten bu depoya işaret ettiğini doğrulayın. Betiğin oluşturduğu `.yedek-* ` öğesini özgün adına taşımadan önce hedefin boş olduğundan emin olun. Depo silinse bile Homebrew paketleri, Ollama modelleri ve npm/uv araçları otomatik kaldırılmaz.

## Sık hatalar

| Belirti | Neden | Çözüm |
|---|---|---|
| alt modül uyarısı | recursive clone yapılmadı | `git submodule update --init --recursive` |
| `agy` yok | dış araç kurulmadı | resmi kurulumla `~/.local/bin/agy` oluştur |
| Ollama yanıt vermiyor | servis kapalı | `brew services start ollama` |
| Whisper modeli yok | indirme yarım | model yolunu ve dosya boyutunu kontrol et |
| MCP bağlanmıyor | uygulama/port kapalı | FilmCraft'ı `--control 9876` ile başlat |
| `npm ci` kilit hatası | Node/lock uyumsuz | doğrulanmış Node sürümünü kullan |
| font ağdan yüklenmiyor | ağ veya önbellek | ilk kurulumu ağ varken çalıştır |
| komut eski sürüm | bağlantı başka hedefe gidiyor | `which` ve `ls -l` ile bağı denetle |


Model ayarları `~/.config/kurgu-sistemi/modeller.env` dosyasındadır; örnek `config/modeller.ornek.env`.
