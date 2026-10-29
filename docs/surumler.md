# Sürüm anlık görüntüsü

Doğrulama tarihi: **2026-10-29**. Değerler yerel komut çıktısıdır; kurulum sürümleri sabitlemez.

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
| `filmcraft-cli --version` | `filmcraft-cli 0.10.0` |
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
