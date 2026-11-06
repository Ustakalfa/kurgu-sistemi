#!/usr/bin/env python3
import sys,json,subprocess,time
import cv2,numpy as np,colour
from scipy.optimize import minimize

def frame(path):
    p=subprocess.run(['ffmpeg','-v','error','-ss','1','-i',path,'-frames:v','1','-vf','scale=640:360','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True)
    a=np.frombuffer(p.stdout,np.uint8).reshape(360,640,3)[90:270,160:480].astype(np.float32)/255
    return a

def lab(a):
    return colour.XYZ_to_Lab(colour.sRGB_to_XYZ(a)).mean((0,1))
def de(a,b): return float(colour.delta_E(a,b,method='CIE 2000'))
def main():
    src,ref=sys.argv[1:3]; t=time.monotonic(); a,b=frame(src),frame(ref); target=lab(b); before=lab(a)
    f=lambda g:de(lab(np.clip(a*np.asarray(g),0,1)),target)
    o=minimize(f,[1,1,1],bounds=[(.5,1.5)]*3,method='Nelder-Mead',options={'maxiter':100})
    g=o.x; out={'kaynak':src,'referans':ref,'lab_kaynak':before.tolist(),'lab_referans':target.tolist(),'delta_e_once':de(before,target),'kanal_kazanclari_rgb':g.tolist(),'delta_e_sonra':f(g),'sure_s':time.monotonic()-t}
    print(json.dumps(out,ensure_ascii=False,indent=2))
if __name__=='__main__': main()
