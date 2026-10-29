import json, re, subprocess, sys, unicodedata
from pathlib import Path
kok, cikti = Path(sys.argv[1]), Path(sys.argv[2]); olcum = {r["dosya"]: r for r in json.load(open(sys.argv[3]))}
TR = str.maketrans("çğıöşüÇĞİÖŞÜâÂ", "cgiosuCGIOSUaA")
def slug(s): s = unicodedata.normalize("NFC", s).translate(TR).lower(); return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
KAT = {"01 Geçişler":"gecis","02 Vurgular":"vurgu","03 Metin & Grafik":"metin","04 Dramatik":"dramatik","05 Dijital":"dijital","06 Bildirim & Zil":"bildirim","07 Ortam & Doku":"ortam"}
MP3 = {  # isimden sınıflandırma (dinlenmedi — dosya adına dayalı)
 "universfield-swoosh-015-383769":("gecis","pixabay"),"Yavaşlatma":("gecis","bilinmiyor"),"Kağıt Yırtma":("gecis","bilinmiyor"),
 "diamond_tunes-cinematic-sound-effect-327618":("vurgu","pixabay"),"insan düşmesi":("vurgu","bilinmiyor"),"Işık Kapanma ":("vurgu","bilinmiyor"),
 "soundreality-pop-423717":("metin","pixabay"),"matthewvakaliuk73627-mouse-click-290204":("metin","pixabay"),"Yazı Yazma":("metin","bilinmiyor"),
 "stevemotion-camera-click-569825":("foto","pixabay"),"kauasilbershlachparodes-camera-flash-494027":("foto","pixabay"),"malarbrush-camera-flash-204151":("foto","pixabay"),"Fotoğraf sesi":("foto","bilinmiyor"),
 "freesound_community-ding-101492":("bildirim","pixabay"),"dragon-studio-correct-472358":("bildirim","pixabay"),"Bildirim":("bildirim","bilinmiyor"),"u_oepgi4ep3v-som_matricula-464025":("bildirim","pixabay"),
 "Açılış 1":("acilis","bilinmiyor"),"Hook":("acilis","bilinmiyor"),
 "Metro Sesi":("ortam","bilinmiyor"),"Trafik Gürültüsü":("ortam","bilinmiyor"),"Uçak Sesi":("ortam","bilinmiyor"),"11325622-clock-ticking-sound-effect-240503":("ortam","pixabay")}
katalog = []
for rel, r in olcum.items():
    p = Path(rel)
    if len(p.parts) == 2: kat, kaynak, ad = KAT[unicodedata.normalize("NFC", p.parts[0])], "sentetik", slug(p.stem.split(" - ",1)[1])
    else: kat, kaynak = MP3[unicodedata.normalize("NFC", p.stem)]; ad = slug(re.sub(r"-\d{5,6}$", "", p.stem))
    hedef = cikti / f"{kat}--{ad}.wav"
    # baştaki sessizliği kırp, 48 kHz stereo, tepe -1 dBFS'e normalize (peak tabanlı; SFX'te karışım seviyesi kullanımda ayarlanır)
    tepe = float(r["tepe"]) if r["tepe"] not in (None, "-inf") else -3.0
    kazanc = -1.0 - tepe
    af = f"silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.005,volume={kazanc:.2f}dB,alimiter=limit=0.89:level=false"
    if r["sn"] > 30: af += ",afade=t=out:st=28:d=2"; ek = ["-t", "30"]
    else: ek = []
    subprocess.run(["ffmpeg","-v","error","-y","-i",str(kok/rel),*ek,"-af",af,"-ar","48000","-ac","2","-c:a","pcm_s16le",str(hedef)],check=True)
    sorun = []
    if r["tepe"] not in (None,"-inf") and float(r["tepe"]) > -0.1: sorun.append("kaynakta taşma/bozulma olabilir")
    if r["hz"] < 44100: sorun.append(f"düşük örnekleme ({r['hz']} Hz)")
    if r["tepe"] not in (None,"-inf") and float(r["tepe"]) < -12: sorun.append(f"çok kısık kaynak (+{kazanc:.0f} dB yükseltildi, gürültü artmış olabilir)")
    katalog.append({"dosya": f"sfx/{hedef.name}", "kategori": kat, "ad": ad, "kaynak": kaynak, "orijinal": rel,
                    "sure_sn": min(r["sn"],30.0), "uyarilar": sorun})
katalog.sort(key=lambda k: (k["kategori"], k["ad"]))
json.dump(katalog, open(cikti/"katalog.json","w"), ensure_ascii=False, indent=1)
from collections import Counter
print(Counter(k["kategori"] for k in katalog)); print(Counter(k["kaynak"] for k in katalog))
for k in katalog:
    if k["uyarilar"]: print("UYARI", k["dosya"], "—", "; ".join(k["uyarilar"]))
