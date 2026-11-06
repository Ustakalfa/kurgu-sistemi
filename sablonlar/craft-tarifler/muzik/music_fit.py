#!/usr/bin/env python3
import sys,time,json,os
from pathlib import Path
os.environ.setdefault("NUMBA_CACHE_DIR",str(Path.home()/".cache/kurgu-numba"))
import numpy as np,librosa,soundfile as sf

def main():
    src,target,out=sys.argv[1],float(sys.argv[2]),sys.argv[3]; t=time.monotonic(); y,sr=sf.read(src); y=y[None,:] if y.ndim==1 else y.T
    mono=y.mean(axis=0); tempo,frames=librosa.beat.beat_track(y=mono,sr=sr,trim=False); beats=librosa.frames_to_time(frames,sr=sr)
    cuts=np.r_[0,beats,len(mono)/sr]; cuts=np.unique(np.round(cuts*sr).astype(int)); cuts=np.r_[cuts[0],cuts[1:][np.diff(cuts)>.2*sr]]; bars=[y[:,cuts[i]:cuts[i+1]] for i in range(len(cuts)-1) if cuts[i+1]>cuts[i]]
    if not bars: raise RuntimeError('vuruş bulunamadı')
    n=int(target*sr); fade=int(.06*sr); result=np.zeros((y.shape[0],n)); pos=0; i=0; joins=[]
    while pos<n:
        seg=bars[i%len(bars)]; end=min(n,pos+seg.shape[1]); result[:,pos:end]=seg[:,:end-pos]
        if pos: joins.append(pos/sr)
        pos=end;i+=1
    for sec in joins:
        p=round(sec*sr); h=min(fade//2,p//2,(n-p)//2)
        if h:
            left=result[:,p-2*h:p].copy();right=result[:,p:p+2*h].copy()
            ramp=np.linspace(0,1,2*h)
            result[:,p-h:p+h]=left*(1-ramp)+right*ramp
    tail=min(sr,n);result[:,-tail:]*=np.linspace(1,0,tail)
    sf.write(out,result.T,sr)
    print(json.dumps({'sure_s':time.monotonic()-t,'hedef_s':target,'gercek_s':len(result.T)/sr,'tempo':float(np.ravel(tempo)[0]),'vurus_sayisi':len(beats),'ekler_s':joins,'cikti':out},ensure_ascii=False))
if __name__=='__main__':main()
