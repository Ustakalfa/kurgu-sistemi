# Gerçek çekimde kişi maskesi testi: sam2_kisi.py girdi.mp4 ciktiklasor [x_oran y_oran]. Yerel çalışır, çıktı alfa PNG + kontrol tabakası kareleri.
import sys, subprocess, pathlib, time, json
import numpy as np, torch, cv2
from sam2.build_sam import build_sam2_video_predictor
girdi, cikti = sys.argv[1], pathlib.Path(sys.argv[2]); xo = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5; yo = float(sys.argv[4]) if len(sys.argv) > 4 else 0.45
kare = cikti / 'kare'; maske = cikti / 'maske'; kare.mkdir(parents=True, exist_ok=True); maske.mkdir(exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', girdi, '-vf', 'scale=960:-2', '-q:v', '2', '-start_number', '0', str(kare / '%05d.jpg')], check=True)
kok = pathlib.Path.home() / '.local/share/kurgu-araclar'
dev = 'mps' if torch.backends.mps.is_available() else 'cpu'
p = build_sam2_video_predictor('configs/sam2.1/sam2.1_hiera_s.yaml', str(kok / 'sam2-modeller/sam2.1_hiera_small.pt'), device=dev)
ilk = cv2.imread(str(kare / '00000.jpg')); h, w = ilk.shape[:2]
t = time.monotonic()
with torch.inference_mode():
    st = p.init_state(str(kare), offload_video_to_cpu=True, offload_state_to_cpu=True)
    p.add_new_points_or_box(st, frame_idx=0, obj_id=1, points=np.array([[w * xo, h * yo], [w * xo, h * (yo + 0.25)]], dtype=np.float32), labels=np.array([1, 1], dtype=np.int32))
    alanlar = []; n = 0
    for fi, _, lg in p.propagate_in_video(st):
        m = (lg[0][0] > 0).cpu().numpy().astype(np.uint8) * 255
        cv2.imwrite(str(maske / f'{fi:05d}.png'), m); alanlar.append(float((m > 0).mean())); n += 1
print(json.dumps({'cihaz': dev, 'sure_sn': round(time.monotonic() - t, 1), 'kare': n, 'sn_kare': round((time.monotonic() - t) / n, 2), 'alan_min': round(min(alanlar), 3), 'alan_max': round(max(alanlar), 3)}))
ks = []
for i in np.linspace(0, n - 1, 6).astype(int):
    f = cv2.imread(str(kare / f'{i:05d}.jpg')); m = cv2.imread(str(maske / f'{i:05d}.png'), 0)
    o = f.copy(); o[m == 0] = (o[m == 0] * 0.25 + np.array([40, 120, 40]) * 0.75).astype(np.uint8); ks.append(o)
cv2.imwrite(str(cikti / 'kontrol.jpg'), np.vstack([np.hstack(ks[:3]), np.hstack(ks[3:])]))
