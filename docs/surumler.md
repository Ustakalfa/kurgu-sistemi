# Sürüm anlık görüntüsü

Doğrulama tarihi: **2026-11-06**. Değerler yerel komut çıktısıdır; kurulum sürümleri sabitlemez.

## İlgili Homebrew paketleri

| Paket | Sürüm |
|---|---|
| `ffmpeg` | `9.0.2_1` |
| `node@22` | `22.23.3_3` |
| `ollama` | `0.40.7` |
| `python@3.15` | `3.15.0` |
| `whisper.cpp` | `1.9.5` |

Kaynak `brew list --versions`. Komut, Homebrew API kilit dosyasına yazma izni uyarısı verdi; kurulu paket satırlarını yine yazdı.

## Komutlar

| Komut | Çıktı |
|---|---|
| `node -v` | `v22.23.3` |
| `python3 -V` | `Python 3.15.0` |
| `filmcraft-cli --version` | `filmcraft-cli 0.17.1` |
| `codex --version` | `codex-cli 0.163.0` |
| `agy --version` | `1.4.9` |
| `edge-tts --version` | `edge-tts 7.3.1` |
| `auto-editor --version` | `29.3.1` |
| `remotion/package.json` | `4.0.532` |

`codex --version` PATH takma adı uyarısı da verdi; sürüm satırı üretildi.

## Ollama modelleri

| Ad | Kimlik | Boyut |
|---|---|---:|
| `qwen3-embedding:0.6b` | `ac6da0dfba84` | 639 MB |
| `bge-m3:latest` | `790764642607` | 1.2 GB |
| `gemma4:e4b` | `eb2177adf764` | 9.5 GB |
| `qwen3.5:9b` | `d63f830f28d5` | 7.6 GB |

Kaynak: `ollama list`.

## Craft uygulamaları (6 Kasım 2026 — yerel CLI doğrulaması)

| Uygulama | Sürüm | CLI çıktısı |
|---|---|---|
| FilmCraft | 0.17.1 | `filmcraft-cli 0.17.1` |
| EffectCraft | 0.21.1 | `effectcraft-cli 0.21.1` |
| SoundCraft | 0.17.1 | `soundcraft-cli 0.17.1 (macos aarch64)` |
| PhotoCraft | 0.20.2 | `photocraft-cli 0.20.2 (7c12f6471, 2026-11-05)` |
| VectorCraft | 0.21.1 | `vectorcraft-cli 0.21.1` |
| PdfCraft | 0.18.2 | `pdfcraft-cli 0.18.2` |

Craft CLI konumları: `$HOME/.local/bin/{filmcraft,effectcraft,soundcraft,photocraft,vectorcraft,pdfcraft}-cli`. FilmCraft komut listesi `remotion/araclar/filmcraft-komutlar.txt` dosyasına yeniden yazıldı (716 komut, 6 Kasım 2026).

## Remotion paketleri

| Paket | Sürüm |
|---|---|
| `remotion` | `4.0.532` |
| `@remotion/cli` | `4.0.532` |
| `@remotion/captions` | `4.0.532` |
| `@remotion/google-fonts` | `4.0.532` |
| `@remotion/media` | `4.0.532` |
| `@remotion/three` | `4.0.532` |
| `@remotion/lottie` | `4.0.532` |
| `three` | `0.187.0` |
| `@react-three/fiber` | `9.8.2` |
| `lottie-web` | `5.13.0` |

## Claude doğrulaması

Headless proje oluşturma/kaydetme, import, 3840×2160 25 fps sekans, iki klip yerleştirme, ripple silme, çalışma alanı, duplicate frames, kaydetme ve kare render geçti. 1 sn 4K25 ProRes export 4,3 sn sürdü (`prores`, `yuv422p10le`). Canlı inspect ve `ui_screenshot` geçti; anahtarsız bağlantı reddedildi.
