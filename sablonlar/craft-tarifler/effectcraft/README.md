# EffectCraft tarifi

4K25 Türkçe animasyon, alfa ve H.264 kuyruk denemesi üretir. `effectcraft-tarif.jsonl` ana projeyi; `effectcraft-ek-testler.jsonl` ek kompozisyonları; `effectcraft-alfa-hazirla.jsonl` alfa sürümünü; `effectcraft-renderqueue.jsonl` kuyruğu kurar.

Çalışma klasörüne tarifleri ve `test4k.mp4`, `vectorcraft-rozet.svg/png` girdilerini koyun. `effectcraft-cli --empty run --commands effectcraft-tarif.jsonl --save-as effectcraft-ana.ecproj --json`; ardından `effectcraft-cli --project effectcraft-ana.ecproj run --commands effectcraft-ek-testler.jsonl --save --json`. Alfa ve kuyruk için aynı `--project`/`run --commands` düzenini uygulayın.

Beklenti: 3840×2160, 25 fps, 6 sn; opak H.264 `yuv420p`, alfa ProRes 4444 `yuva444p12le`. Maskeyi kare renderıyla görsel denetleyin.
