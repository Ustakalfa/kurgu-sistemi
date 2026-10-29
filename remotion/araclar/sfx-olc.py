import json, re, subprocess, sys
from pathlib import Path
kok = Path(sys.argv[1]); sonuc = []
for f in sorted(kok.rglob("*")):
    if f.suffix.lower() not in (".wav", ".mp3") or f.name.startswith("Ses Efektleri — Önizleme"): continue
    pr = json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration,bit_rate:stream=sample_rate,channels,codec_name:format_tags","-of","json",str(f)],capture_output=True,text=True).stdout)
    st = pr["streams"][0]; fm = pr["format"]
    err = subprocess.run(["ffmpeg","-hide_banner","-nostats","-i",str(f),"-af","silencedetect=n=-45dB:d=0.02,ebur128=peak=true,astats=metadata=0:measure_overall=Peak_level","-f","null","-"],capture_output=True,text=True).stderr
    lead = 0.0
    m = re.search(r"silence_start: (-?[\d.e-]+)\s*\n.*?silence_end: ([\d.]+)", err)
    if m and float(m.group(1)) <= 0.001: lead = float(m.group(2))
    I = re.findall(r"I:\s+(-?[\d.]+|-inf) LUFS", err); tp = re.findall(r"Peak:\s+(-?[\d.]+|-inf) dBFS", err)
    sonuc.append({"dosya": str(f.relative_to(kok)), "sn": round(float(fm["duration"]),2), "hz": int(st["sample_rate"]), "kanal": st["channels"],
                  "codec": st["codec_name"], "lufs": I[-1] if I else None, "tepe": tp[-1] if tp else None, "bas_sessiz": round(lead,3),
                  "etiket": {k:v for k,v in (fm.get("tags") or {}).items() if k.lower() in ("title","artist","comment","encoder","album","copyright")}})
json.dump(sonuc, open(sys.argv[2],"w"), ensure_ascii=False, indent=1)
for r in sonuc:
    print(f'{r["dosya"][:52]:52s} {r["sn"]:6.2f}s {r["hz"]//1000:>2}k {r["kanal"]}ch {str(r["lufs"]):>6} LUFS tepe {str(r["tepe"]):>6} bas {r["bas_sessiz"]:.2f}s {r["etiket"] if r["etiket"] else ""}')
