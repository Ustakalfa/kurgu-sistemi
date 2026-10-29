import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

const R = 'reels/r08/';
export const REELS08_SURE = 1084;
const bas = [0, 105, 196, 344, 512, 625, 779, 880, 1014, 1084];
const klipler = ['k1_donus', 'k1_donus', 'k2_kilit', 'k3_kapak', 'k4_urunler', 'k5_duzenler', 'k6_patlatma', 'k7_g2'] as const;
const adet = [150, 150, 120, 120, 120, 144, 90, 90];
const rozetler: Record<number, [string, string]> = {
  2: ['01', 'KİLİT'], 3: ['02', 'AYNA'], 4: ['03', 'DÜZEN'],
  5: ['04', 'SEÇENEK'], 6: ['05', 'SANA ÖZEL'], 7: ['06', 'G2'],
};
const duzenler = ['Günlük Klasik', 'Fırça Atölyesi', 'Palet Ustası', 'Ruj Koleksiyonu', 'Bakım Mini', 'Serbest Izgara'];
type Obek = [number, string, string[]?];
type Vo = {dosya: string; at: number; sure: number; alt: Obek[]};
const seslendirme: Vo[] = [
  {dosya: 'vo1', at: 3, sure: 100, alt: [[0, 'RUJ NEREDE?', ['NEREDE?']], [32, 'FIRÇA NEREDE?', ['NEREDE?']], [65, 'AYNA NEREDE?', ['NEREDE?']]]},
  {dosya: 'vo2', at: 107, sure: 88, alt: [[0, 'HEPSİ TEK KUTUDA', ['KUTUDA']]]},
  {dosya: 'vo3', at: 198, sure: 145, alt: [[0, 'İKİ GİZLİ KİLİT', ['KİLİT']], [78, 'ÇIKINTI YOK', ['YOK']]]},
  {dosya: 'vo4', at: 346, sure: 165, alt: [[0, 'AYNA HAZIR', ['HAZIR']], [85, "105°'DE DURUR", ['DURUR']]]},
  {dosya: 'vo5', at: 514, sure: 109, alt: [[0, 'HER BÖLME', ['BÖLME']], [50, 'GERÇEK ÖLÇÜLERLE', ['ÖLÇÜLERLE']]]},
  {dosya: 'vo6', at: 627, sure: 151, alt: [[0, '6 FARKLI İÇ DÜZEN', ['6']]]},
  {dosya: 'vo7', at: 781, sure: 98, alt: [[0, 'İÇİNİ SEN SEÇ', ['SEÇ']], [49, 'BİZ ÜRETELİM', ['ÜRETELİM']]]},
  {dosya: 'vo8', at: 882, sure: 131, alt: [[0, 'DAHA FAZLASI?', ['FAZLASI?']], [62, 'İKİ KATLI G2', ['G2']]]},
];
const sp = (f: number, d = 12, s = 160) => spring({frame: Math.max(0, f), fps: 30, config: {damping: d, stiffness: s}});

const Zemin: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(f / 40) * 12}% 30%, ${renk.bordo}90, transparent 55%), radial-gradient(circle at 50% 110%, ${renk.kirmizi}40, transparent 50%), ${renk.siyah}`}} />
    <AbsoluteFill style={{opacity: 0.09, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 90px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 90px)'}} />
  </AbsoluteFill>;
};
const Gren: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', zIndex: 30}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}><filter id="r08-gren"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 12} /></filter><rect width="100%" height="100%" filter="url(#r08-gren)" /></svg>
    <div style={{position: 'absolute', top: 0, left: 0, height: 8, width: `${100*f/REELS08_SURE}%`, background: renk.kirmizi, boxShadow: `0 0 16px ${renk.kirmizi}`}} />
  </AbsoluteFill>;
};
const Vizor: React.FC = () => {
  const f = useCurrentFrame();
  const k = (st: React.CSSProperties) => <div style={{position: 'absolute', width: 70, height: 70, borderColor: '#FFFFFFAA', borderStyle: 'solid', borderWidth: 0, ...st}} />;
  return <AbsoluteFill style={{pointerEvents: 'none', zIndex: 15}}>
    {k({left: 50, top: 120, borderLeftWidth: 4, borderTopWidth: 4})}{k({right: 50, top: 120, borderRightWidth: 4, borderTopWidth: 4})}
    {k({left: 50, bottom: 120, borderLeftWidth: 4, borderBottomWidth: 4})}{k({right: 50, bottom: 120, borderRightWidth: 4, borderBottomWidth: 4})}
    <div style={{position: 'absolute', left: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFFAA', letterSpacing: 2}}><span style={{color: renk.kirmizi, opacity: Math.floor(f/15)%2===0 ? 1 : .2}}>●</span> REC  00:{String(Math.floor(f/30)).padStart(2, '0')}:{String(f%30).padStart(2, '0')}</div>
    <div style={{position: 'absolute', right: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFF88'}}>NEXUS · MAKYAJ KUTUSU</div>
  </AbsoluteFill>;
};
const Bolum: React.FC<{no: string; metin: string; f: number}> = ({no, metin, f}) => {
  const g = sp(f-4, 14, 200);
  return <div style={{position: 'absolute', top: 175, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10, fontFamily: yaziTipi, transform: `translateY(${(1-g)*-40}px)`, opacity: g}}><div style={{background: renk.kirmizi, color: '#fff', fontWeight: 800, fontSize: 34, padding: '10px 26px', letterSpacing: 3}}>{no}</div><div style={{background: '#fff', color: renk.siyah, fontWeight: 800, fontSize: 34, padding: '10px 26px', letterSpacing: 3}}>{metin}</div></div>;
};
const Damga: React.FC<{f: number; metin: string; style?: React.CSSProperties}> = ({f, metin, style}) => {
  if (f < 0 || f > 35) return null;
  const g = sp(f, 8, 260);
  return <div style={{position: 'absolute', zIndex: 12, fontFamily: yaziTipi, fontWeight: 800, fontSize: 70, color: renk.kirmizi, border: `8px solid ${renk.kirmizi}`, padding: '10px 34px', letterSpacing: 6, transform: `scale(${2.2-1.2*g}) rotate(-8deg)`, opacity: g*(1-Math.max(0, f-25)/10), background: '#09090Bdd', ...style}}>{metin}</div>;
};
const Altyazi: React.FC = () => {
  const frame = useCurrentFrame();
  const v = seslendirme.find(x => frame >= x.at && frame < x.at+x.sure+2);
  if (!v) return null;
  const i = v.alt.map(([o]) => v.at+o <= frame).lastIndexOf(true);
  if (i < 0) return null;
  const [o, metin, vurgu=[]] = v.alt[i];
  const age = frame-v.at-o;
  return <div lang="tr" style={{position: 'absolute', left: 40, right: 40, top: 1430, textAlign: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 80, lineHeight: 1.1, textShadow: '0 6px 24px #000, 0 0 2px #000', zIndex: 20, transform: v.dosya==='vo1' && age<11 ? `translate(${(random(`r08x${frame}`)-.5)*9}px, ${(random(`r08y${frame}`)-.5)*9}px)` : undefined}}>
    {metin.split(' ').map((k,j) => {const g=sp(age-j*3, 10, 220); return <span key={j} style={{color: vurgu.includes(k) ? renk.kirmizi : renk.beyaz, margin: '0 11px', display: 'inline-block', opacity: age>=j*3 ? 1 : 0, transform: `scale(${.7+.3*g})`}}>{k}</span>;})}
  </div>;
};
const Urun: React.FC<{klip: string; kare: number}> = ({klip, kare}) => <Img src={staticFile(`${R}${klip}/${String(kare).padStart(4, '0')}.png`)} style={{position: 'absolute', width: 1080, height: 1920, objectFit: 'contain', filter: 'drop-shadow(0 25px 32px #0007)'}} />;
const Son: React.FC<{f: number}> = ({f}) => {
  const g = sp(f-10, 14, 160);
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(R+'logo-acilis.mp4')} muted playbackRate={0.6} style={{width: '100%', height: '100%', objectFit: 'cover'}} startFrom={150} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, #09090BF5 0%, #09090BAA 35%, transparent 60%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 250, textAlign: 'center', fontFamily: yaziTipi, color: '#fff', opacity: g, transform: `translateY(${(1-g)*40}px)`}}>
      <div style={{fontSize: 44, fontWeight: 800, letterSpacing: 5}}>NEXUS STUDIO · Ankara</div>
      <div style={{height: 4, width: 110, background: renk.kirmizi, margin: '28px auto'}} />
      <div style={{fontSize: 46, fontWeight: 800}}>{iletisim.telefon}</div>
      <div style={{fontSize: 38, fontWeight: 600, marginTop: 10}}>{iletisim.instagram}</div>
    </div>
  </AbsoluteFill>;
};
const Ses: React.FC<{ad: string; at: number; v: number}> = ({ad, at, v}) => <Sequence from={at}><Audio src={sfxYolu(ad)} volume={v} /></Sequence>;

export const Reels08: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = Math.min(8, bas.findIndex((_, i) => i < 9 && frame >= bas[i] && frame < bas[i+1]));
  const local = frame-bas[scene];
  const len = bas[scene+1]-bas[scene];
  let kare = 0;
  if (scene <= 7) {
    kare = scene < 2 ? Math.min(149, Math.floor(frame*150/bas[2])) : Math.min(adet[scene]-1, Math.floor(local*adet[scene]/len));
  }
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    <Zemin />
    {scene < 8 && <>
        <div style={{position: 'absolute', left: 180, top: 1240, width: 720, height: 125, borderRadius: '50%', background: '#0009', filter: 'blur(42px)', zIndex: 1}} />
        <Urun klip={klipler[scene]} kare={kare} />
      {rozetler[scene] && <Bolum no={rozetler[scene][0]} metin={rozetler[scene][1]} f={local} />}
      {scene === 2 && <><Damga f={local-48} metin="KLİK" style={{top: 900, left: 120}} /><Damga f={local-96} metin="KLİK" style={{top: 1000, right: 120}} /></>}
      {scene === 5 && <div style={{position: 'absolute', top: 1340, left: 0, right: 0, textAlign: 'center', fontFamily: yaziTipi, fontSize: 40, fontWeight: 800, color: '#fff', textShadow: '0 4px 16px #000', zIndex: 12}}><span style={{color: renk.kirmizi, marginRight: 14, fontSize: 52}}>{'ABCDEF'[Math.min(5, Math.floor(kare/24))]}</span>{duzenler[Math.min(5, Math.floor(kare/24))]}</div>}
      <Vizor />
      <Altyazi />
    </>}
    {scene === 8 && <Son f={local} />}
    <Gren />
    {seslendirme.map(v => <Sequence key={v.dosya} from={v.at} durationInFrames={v.sure}><Audio src={staticFile(`${R}${v.dosya}.wav`)} volume={1} /></Sequence>)}
    <Sequence durationInFrames={REELS08_SURE}><Audio src={sfxYolu('dramatik--gerilim-droneu')} volume={0.17} loop /></Sequence>
    <Ses ad="acilis--hook" at={0} v={0.22} />
    {[3, 35, 68].map(f => <Ses key={`pop${f}`} ad="metin--pop" at={f} v={0.3} />)}
    {[bas[2], bas[4], bas[5], bas[6], bas[7], bas[8]].map(f => <Ses key={`gec${f}`} ad="gecis--kamera-gecis-yumusak" at={f} v={0.23} />)}
    <Ses ad="gecis--whoosh-yumusak" at={bas[3]+10} v={0.35} />
    {[bas[2]+48, bas[2]+96].map(f => <Ses key={`kilit${f}`} ad="vurgu--metal-carpma" at={f} v={0.28} />)}
    {[1,2,3,4,5].map(i => <Ses key={`duzen${i}`} ad="gecis--whoosh-kisa" at={bas[5]+Math.round(i*(bas[6]-bas[5])/6)} v={0.14} />)}
  </AbsoluteFill>;
};
