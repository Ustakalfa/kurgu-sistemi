#!/usr/bin/env python3
"""Matched-frame per-channel monotone histogram LUT; usage: renk_lut.py source reference output.cube"""
import sys, subprocess
import numpy as np

def frame(path, t=1):
    p=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',path,'-frames:v','1','-vf','scale=640:360','-pix_fmt','rgb24','-f','rawvideo','-'],capture_output=True,check=True)
    return np.frombuffer(p.stdout,np.uint8).reshape(360,640,3)

def curve(a,b,threshold):
    ha=np.bincount(a.ravel(),minlength=256); hb=np.bincount(b.ravel(),minlength=256)
    ca=np.cumsum(ha)/a.size; cb=np.cumsum(hb)/b.size
    q=np.interp(ca,cb,np.arange(256))
    # Preserve true black while moving the elevated source black point.
    q[:threshold]=0
    return np.maximum.accumulate(np.clip(q,0,255))

def main():
    src,ref,out=sys.argv[1:4]; a=frame(src); b=frame(ref)
    cs=[curve(a[:,:,i],b[:,:,i],(22,32,22)[i]) for i in range(3)]
    with open(out,'w') as f:
        f.write('TITLE "Histogram match"\nLUT_3D_SIZE 33\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n')
        for blue in range(33):
            for green in range(33):
                for red in range(33):
                    vals=[np.interp(v*255/32,np.arange(256),cs[i])/255 for i,v in enumerate((red,green,blue))]
                    f.write('%.8f %.8f %.8f\n'%tuple(vals))
    print('source black:',a[0,0].tolist(),'reference black:',b[0,0].tolist(),'mapped:',[round(c[int(x)]) for c,x in zip(cs,a[0,0])])
if __name__=='__main__': main()
