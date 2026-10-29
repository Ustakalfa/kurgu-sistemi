"""2.5D paralaks: görsel + derinlik haritası -> hareketli sinematik klip.
Kullanım: python paralaks.py <girdi> <cikti.mp4> <hareket> [saniye=4] [guc=1.0]
hareket: dolly | dolly-out | pan-sol | pan-sag | yuksel | in | orbit
"""
import sys, subprocess, numpy as np, cv2
from PIL import Image

W, H, FPS = 1080, 1920, 30
girdi, cikti, hareket = sys.argv[1], sys.argv[2], sys.argv[3]
sure = float(sys.argv[4]) if len(sys.argv) > 4 else 4.0
guc = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0

img = Image.open(girdi).convert("RGB")
from transformers import pipeline
dp = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
d = np.array(dp(img)["predicted_depth"].squeeze().cpu().numpy(), dtype=np.float32)

# kaynak: kapla + %16 pay
M = 1.16
sw, sh = int(W * M), int(H * M)
src = np.array(img)
r = max(sw / src.shape[1], sh / src.shape[0])
src = cv2.resize(src, (int(src.shape[1] * r + 1), int(src.shape[0] * r + 1)), interpolation=cv2.INTER_LANCZOS4)
y0, x0 = (src.shape[0] - sh) // 2, (src.shape[1] - sw) // 2
src = src[y0:y0 + sh, x0:x0 + sw]
d = cv2.resize(d, (src.shape[1] + 0, src.shape[0]), interpolation=cv2.INTER_CUBIC) if d.shape != src.shape[:2] else d
d = cv2.resize(d, (sw, sh))
d = (d - np.percentile(d, 2)) / max(1e-6, np.percentile(d, 98) - np.percentile(d, 2))
d = np.clip(d, 0, 1)
d = cv2.GaussianBlur(d, (0, 0), 6)  # yırtılmayı azalt

n = int(round(sure * FPS))
gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
cx, cy = W / 2, H / 2
ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                       "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-pix_fmt", "yuv420p", cikti], stdin=subprocess.PIPE)

def ease(t):  # yumuşak giriş-çıkış, ama sürekli hareket
    return t * t * (3 - 2 * t) * 0.6 + t * 0.4

ox, oy = (sw - W) / 2, (sh - H) / 2
for i in range(n):
    t = ease(i / max(1, n - 1))
    dx = dy = 0.0; zoom = 1.0; par = 0.0
    if hareket == "dolly":      zoom = 1.0 + 0.10 * t * guc; par = 0.07 * t * guc
    elif hareket == "dolly-out": zoom = 1.10 * guc - 0.10 * t * guc if guc else 1; par = 0.07 * (1 - t) * guc
    elif hareket == "in":        zoom = 1.0 + 0.18 * t * guc; par = 0.10 * t * guc
    elif hareket == "pan-sol":   dx = (t - 0.5) * 110 * guc; zoom = 1.03
    elif hareket == "pan-sag":   dx = -(t - 0.5) * 110 * guc; zoom = 1.03
    elif hareket == "yuksel":    dy = (t - 0.5) * 120 * guc; zoom = 1.03 + 0.04 * t
    elif hareket == "orbit":     dx = np.sin(t * np.pi - np.pi / 2) * 70 * guc; zoom = 1.04 + 0.05 * t; par = 0.03 * t
    # çıkış pikseli -> kaynak koordinatı (ters warp); yakın pikseller daha fazla hareket eder
    dd = cv2.remap(d, gx + ox, gy + oy, cv2.INTER_LINEAR)
    z = zoom * (1 + par * (dd - 0.5))
    sx = (gx - cx) / z + cx + ox - dx * (dd - 0.35)
    sy = (gy - cy) / z + cy + oy - dy * (dd - 0.35)
    fr = cv2.remap(src, sx.astype(np.float32), sy.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    ff.stdin.write(fr.tobytes())
ff.stdin.close(); ff.wait()
print("OK", cikti, n, "kare")
