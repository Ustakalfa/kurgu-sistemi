# Ekip Düzeni

## Genel Claude kuralı ve kurgu-ekip

[Claude kural bloğu](../claude/CLAUDE.kurgu.md), Claude'u plan, karar ve denetimden sorumlu ana beyin olarak tanımlar. Claude FilmCraft MCP ile canlı kurgu ve renk düzenlemesini bizzat yürütür. Codex Remotion kodu, betik, toplu iş, belge ve görsel üretir; yalnız verilmiş penceresiz FilmCraft adım dosyasını yürütebilir. Gemini videoyu izleyip zaman kodlu bulgu sağlar; yerel model dökümü temizler. [kurgu-ekip skill'i](../skills/kurgu-ekip/SKILL.md) iş devri, model seçimi ve sonuç denetimini ayrıntılandırır.

`./kurulum.sh --claude-md`, işaretli bloğu kullanıcının `~/.claude/CLAUDE.md` dosyasına ekler veya günceller; diğer içeriği korur ve değişiklik öncesi yedek alır. `./kurulum.sh --claude-md-kaldir` yalnız bu bloğu kaldırır. `--kuru` ile hedef farkı önce görülebilir; `--hepsi` eklemeyi de seçer. `--hooks`, hookify kuruluysa depo içindeki yerel kuralı bağlar.

## Kaptan/işçi modeli

Kaptan işi parçalara ayırır, kaynakları korur, kalite kapılarını izler ve kullanıcıdan onay alır. İşçi yalnız verilen kapsamda araştırır veya üretir; sonucu kanıtıyla döndürür. Aynı dosyada eşzamanlı yazma yapılmaz. Ham medya, nihai teslim ve ortak bilgi tabanı için tek sahip belirlenir.

## Codex türleri ve zincirleri

| Tür | Model zinciri | Efor | Uygun iş |
|---|---|---|---|
| basit | gpt-6-luna → gpt-5.6-luna → gpt-6-sol | low | küçük, açık görev |
| hafif | gpt-5.6-luna → gpt-6-luna → gpt-6-sol | low | hızlı metin/kod |
| orta | gpt-5.6-terra → gpt-6-sol → gpt-5.6-sol | low | olağan uygulama |
| ana | gpt-6-sol → gpt-5.6-sol | low | ana iş |
| ana2 | gpt-5.6-sol → gpt-6-sol | low | alternatif sıra |
| derin | gpt-6-sol → gpt-5.6-sol | high | zor muhakeme |
| astra | gpt-6-astra → gpt-6-sol | high | en zor muhakeme |

`-s read-only` inceleme; `-s workspace-write` kapsamlı yazma içindir. Kayıt `~/.codex/codex-run-kullanim.csv` dosyasına gider.

## Gemini/agy türleri

| Tür | Zincir |
|---|---|
| hizli | gemini-3.8-flash-low → gemini-3.8-flash-medium |
| orta | gemini-3.8-flash-medium → gemini-3.8-flash-high |
| derin | gemini-3.8-flash-high → claude-opus-4-6-thinking |
| video | gemini-3.8-flash-medium → gemini-3.8-flash-high |
| claude | claude-sonnet-4-6 → claude-opus-4-6-thinking |
| opus | claude-opus-4-6-thinking → claude-sonnet-4-6 |

`-d klasör` çalışma dizinini değiştirir. Kayıt `~/.gemini/gemini-run-kullanim.csv` dosyasındadır.

## Yerel türler

| Tür | Varsayılan model | İş |
|---|---|---|
| temizle | qwen3.5:9b | dolgu/tekrar temizleme |
| etiketle | gemma4:e4b | verilen seçeneklerden sınıflama |
| ozet | gemma4:e4b | kısa Türkçe özet |
| cevir | gemma4:e4b | hedef dile çeviri |
| serbest | gemma4:e4b | ek sistem talimatı olmadan üretim |

`-m model` modeli değiştirir; prompt `-` ise stdin okunur. Yerel çalışma da hassas veriyi gereksiz yere çoğaltmama kuralını kaldırmaz.

## codex-img kuralları

Tek çağrıda tek PNG üretir. Prompt tek satırdır. `-r` yalnız var olan referans dosyasıyla kullanılır. Otomatik varyant, kontrol sonrası yeniden üretim ve kodla çizim istenmez. `codex-img-batch` paralellik değerini dikkatli kullanır; kota hatasında saldırgan tekrar yapılmaz.

## Kota ve hata ilkeleri

1. Önce göreve uygun en ucuz zinciri seçin.
2. Betiğin kendi zincir geçişine izin verin; aynı işi dışarıdan tekrar döngüsüne almayın.
3. `limit`, `bos`, `ret` ve hata sonuçlarını günlükten okuyun.
4. Belirsiz bir yazma işlemini başka sağlayıcıda otomatik yinelemeyin.
5. Video incelemeyi yalnız ilgili klasörle sınırlandırın.
6. Başarılı sonucu yeniden çağırmak yerine kaydedin ve doğrulayın.

## Haiku okuyucu

Haiku okuyucu adı verilen ayrı çalıştırılabilir araç bu depodaki `bin/` betiklerinde doğrulanmadı. Bu rol kullanılacaksa yalnız salt okunur, özetleyici bir işçi olarak tanımlanmalı; komutu güncel gerçek kaynaktan doğrulanmadan belgeye eklenmemelidir.

## Kim neyi asla yapmaz?

| Rol | Yasak sınır |
|---|---|
| Kaptan | kullanıcı onayı olmadan nihai 4K teslim |
| İnceleme işçisi | kaynak dosyayı değiştirme |
| Video modeli | zaman kodu olmadan kesin kalite hükmü |
| Yerel model | kurgu zaman çizelgesine doğrudan yazma |
| FilmCraft | ham medyanın tek kopyası üzerine yazma |
| Remotion | ana kurgu ve renk onayını varsayma |
| Görsel üretici | tek istek için kendiliğinden varyant döngüsü |
| Her rol | gizli/kişisel veriyi kamu deposuna taşıma |

## Devir teslim biçimi

Her işçi “ne okudu, ne üretti, ne doğrulanmadı, hangi dosyaya dokundu, sonraki kalite kapısı nedir?” sorularını yanıtlar. Kaptan bu özeti kaynakla karşılaştırır. Bir çıktı var diye görev bitmiş sayılmaz; açılabilirlik, süre, ses, renk ve kapsam kontrolü yapılır.

## Çakışma önleme

Göreve başlamadan dosya sahipliği ilan edilir. Başka bir işçinin düzenlediği dosya yeniden biçimlendirilmez. Ortak sonuç gerekiyorsa işçiler ayrı kanıt üretir, tek kaptan nihai dosyaya uygular.

