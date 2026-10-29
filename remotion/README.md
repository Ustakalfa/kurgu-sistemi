# Nexus Studio video şablonları

Üç kompozisyon: `NexusTanitim` (dikey), `NexusTanitimKare` (kare) ve `NexusAltyazili` (dikey). Hepsi 30 fps. Fiyat kullanılmaz; iletişim bilgileri kapanış kartında sabittir.

`NexusTanitim` ve `NexusTanitimKare` için `sahneler` dizisi verin. Her sahnede `baslik`, isteğe bağlı `alt` ve `gorsel` alanları vardır. `gorsel`, `muzik` ve `dissSes` yolları `public/` klasörüne göredir. Giriş 1,5 sn, her sahne 3 sn, kapanış 3 sn sürer.

Örnek `props.json`:

```json
{"sahneler":[{"baslik":"Nexus Studio","alt":"Hikâyenizi birlikte anlatalım."},{"baslik":"Yeni sahne"}]}
```

```sh
npx remotion render src/index.ts NexusTanitim cikti/x.mp4 --props=props.json
```

`NexusAltyazili` için `video` (`public/` yolu), `sureSn` (kaynak videonun saniye cinsinden süresi) ve `altyazilar` dizisi gerekir. Her altyazı `{ "metin": "...", "baslangicMs": 0, "bitisMs": 2000 }` biçimindedir. Kompozisyon süresi `sureSn + 2` saniyedir. Sessiz tanıtım için ses yollarını boş bırakın.

## Ses efektleri

`public/sfx/katalog.json` içindeki kategoriler: açılış (`acilis`), geçiş (`gecis`), vurgu (`vurgu`), metin (`metin`), dramatik (`dramatik`), dijital (`dijital`), bildirim (`bildirim`), ortam (`ortam`), foto (`foto`). `NexusTanitim` varsayılan efektleri açar; `sfx={false}` ile kapatılır, `sfxSeviye={0.35}` ile ses ayarlanır. `NexusAltyazili` için `sfxOlaylari={[{ad: 'metin--pop-yumusak', ms: 1200, seviye: 0.4}]}` kullanılabilir. `araclar/nexus-reels.py kes --sfx` kesim efektlerini açar; `--sfx-gecis` ve `--sfx-seviye` seçenekleriyle özelleştirilir.
