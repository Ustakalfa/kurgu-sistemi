import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

// Reels 04: "Rent a car'da en pahalı unutkanlık" — Reels03 kalıbı, Nexus Car (satış dalı) ekranları yalnız demo veriyle.
// Ekrandaki her özellik koddan doğrulandı: TeslimIade.tsx FOTO_ADIMLARI, Olaylar.tsx olayaKiralamaBul, kiralama.ts iade hesabı.
const R = 'reels/r04/';
const sahne = {teslim: 0, ceza: 108, kim: 176, yakit: 222, cizik: 286, siz: 344, nTeslim: 440, nCeza: 566, nHesap: 682, dm: 795, son: 890};
export const REELS04_SURE = 990;

type Satir = {from: number; sure: number; metin: string; vurgu?: string[]};
const satirlar: Satir[] = [
  {from: 4, sure: 95, metin: 'Araç teslim edildi. Her şey yolunda.', vurgu: ['yolunda.']},
  {from: 112, sure: 52, metin: 'Üç hafta sonra bir ceza geldi.', vurgu: ['ceza']},
  {from: 180, sure: 34, metin: 'O gün araç kimdeydi?', vurgu: ['kimdeydi?']},
  {from: 226, sure: 52, metin: 'Yakıt yarım mı gitti, dolu mu?', vurgu: ['yarım', 'dolu']},
  {from: 290, sure: 44, metin: 'Bu çizik eski mi, yeni mi?', vurgu: ['eski', 'yeni']},
  {from: 348, sure: 77, metin: 'Defterde yazmıyorsa, parayı siz ödersiniz.', vurgu: ['siz', 'ödersiniz.']},
  {from: 444, sure: 111, metin: "Nexus Car'da teslimde kilometre, yakıt ve fotoğraflar kayda girer.", vurgu: ["Car'da", 'kayda']},
  {from: 570, sure: 102, metin: 'Ceza gelince, o saatte aracın hangi kiralamada olduğu görünür.', vurgu: ['hangi', 'kiralamada']},
  {from: 686, sure: 97, metin: 'İadede gecikme ve eksik yakıt, hesaba kendiliğinden eklenir.', vurgu: ['kendiliğinden']},
  {from: 799, sure: 82, metin: "DM'den DEMO yazın; uygulamayı size gösterelim.", vurgu: ['DEMO']},
];

const sp = (f: number, fps: number, d = 12, s = 160) => spring({frame: Math.max(0, f), fps, config: {damping: d, stiffness: s}});
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Altyazi: React.FC = () => {
  const frame = useCurrentFrame();
  const s = satirlar.find((x) => frame >= x.from && frame < x.from + x.sure + 6);
  if (!s) return null;
  const kelimeler = s.metin.split(' ');
  const toplam = kelimeler.reduce((a, k) => a + k.length + 2, 0);
  let t = s.from;
  const zaman = kelimeler.map((k) => {const b = t; t += ((k.length + 2) / toplam) * s.sure; return b;});
  let aktif = zaman.findIndex((z, i) => frame >= z && (i === zaman.length - 1 || frame < zaman[i + 1]));
  if (aktif < 0) aktif = kelimeler.length - 1;
  const obekBas = Math.floor(aktif / 3) * 3;
  const obek = kelimeler.slice(obekBas, obekBas + 3);
  const pop = sp(frame - zaman[obekBas], 30, 10, 220);
  return <div lang="tr" style={{position: 'absolute', left: 60, right: 60, top: 1430, textAlign: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 78, lineHeight: 1.1, textTransform: 'uppercase', transform: `scale(${0.85 + 0.15 * pop})`, textShadow: '0 6px 24px #000, 0 0 2px #000'}}>
    {obek.map((k, i) => {
      const gi = obekBas + i;
      const vurgu = s.vurgu?.includes(k);
      const okundu = gi <= aktif;
      return <span key={gi} style={{color: vurgu && okundu ? renk.kirmizi : renk.beyaz, opacity: okundu ? 1 : 0.35, marginRight: 22, display: 'inline-block', WebkitTextStroke: vurgu && okundu ? '0' : '2px #000'}}>{k}</span>;
    })}
  </div>;
};

const Zemin: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(frame / 40) * 12}% 30%, ${renk.bordo}90, transparent 55%), radial-gradient(circle at 50% 110%, ${renk.kirmizi}40, transparent 50%), ${renk.siyah}`}} />
    <AbsoluteFill style={{opacity: 0.09, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 90px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 90px)'}} />
  </AbsoluteFill>;
};

const Vizor: React.FC = () => {
  const frame = useCurrentFrame();
  const k = (st: React.CSSProperties) => <div style={{position: 'absolute', width: 70, height: 70, borderColor: '#FFFFFFAA', borderStyle: 'solid', borderWidth: 0, ...st}} />;
  const kayit = Math.floor(frame / 15) % 2 === 0;
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    {k({left: 50, top: 120, borderLeftWidth: 4, borderTopWidth: 4})}{k({right: 50, top: 120, borderRightWidth: 4, borderTopWidth: 4})}
    {k({left: 50, bottom: 120, borderLeftWidth: 4, borderBottomWidth: 4})}{k({right: 50, bottom: 120, borderRightWidth: 4, borderBottomWidth: 4})}
    <div style={{position: 'absolute', left: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFFAA', letterSpacing: 2}}>
      <span style={{color: renk.kirmizi, opacity: kayit ? 1 : 0.2}}>●</span> REC  00:{String(Math.floor(frame / 30)).padStart(2, '0')}:{String(frame % 30).padStart(2, '0')}
    </div>
    <div style={{position: 'absolute', right: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFF88'}}>24 FPS · ISO 800</div>
  </AbsoluteFill>;
};

const Telefon: React.FC<{children: React.ReactNode; titre?: number; style?: React.CSSProperties}> = ({children, titre = 0, style}) => {
  const frame = useCurrentFrame();
  const dx = titre ? (random(`x${frame}`) - 0.5) * titre : 0;
  const dy = titre ? (random(`y${frame}`) - 0.5) * titre : 0;
  return <div style={{position: 'absolute', left: 190, top: 250, width: 700, height: 1120, borderRadius: 70, background: '#000', border: '10px solid #2B2A2E', boxShadow: `0 0 0 2px #444, 0 40px 120px #000, 0 0 120px ${renk.kirmizi}40`, overflow: 'hidden', transform: `translate(${dx}px, ${dy}px)`, ...style}}>
    <div style={{position: 'absolute', top: 18, left: 260, width: 160, height: 40, borderRadius: 20, background: '#000', zIndex: 5}} />
    <div style={{position: 'absolute', inset: 0, fontFamily: yaziTipi, color: renk.beyaz}}>{children}</div>
  </div>;
};

const Bolum: React.FC<{no: string; metin: string}> = ({no, metin}) => {
  const frame = useCurrentFrame();
  const g = sp(frame, 30, 14, 200);
  return <div style={{position: 'absolute', top: 205, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10, fontFamily: yaziTipi, transform: `translateY(${(1 - g) * -40}px)`, opacity: g}}>
    <div style={{background: renk.kirmizi, color: '#fff', fontWeight: 800, fontSize: 34, padding: '10px 26px', letterSpacing: 3}}>{no}</div>
    <div style={{background: '#FFFFFF', color: renk.siyah, fontWeight: 800, fontSize: 34, padding: '10px 26px', letterSpacing: 3}}>{metin}</div>
  </div>;
};

// Türk plakası
const Plaka: React.FC<{style?: React.CSSProperties; olcek?: number}> = ({style, olcek = 1}) => <div style={{display: 'flex', height: 120 * olcek, borderRadius: 12 * olcek, overflow: 'hidden', border: `${5 * olcek}px solid #111`, background: '#fff', boxShadow: '0 20px 60px #000', ...style}}>
  <div style={{width: 60 * olcek, background: '#1d4fbf', color: '#fff', fontFamily: yaziTipi, fontWeight: 800, fontSize: 30 * olcek, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 12 * olcek}}>TR</div>
  <div style={{padding: `0 ${34 * olcek}px`, display: 'flex', alignItems: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 84 * olcek, color: '#111', letterSpacing: 6 * olcek}}>06 DEM 002</div>
</div>;

const Damga: React.FC<{f: number; metin: string; renkKod?: string; style?: React.CSSProperties}> = ({f, metin, renkKod = '#2DBE60', style}) => {
  if (f < 0) return null;
  const g = sp(f, 30, 8, 260);
  return <div style={{position: 'absolute', fontFamily: yaziTipi, fontWeight: 800, fontSize: 70, color: renkKod, border: `8px solid ${renkKod}`, padding: '10px 34px', letterSpacing: 6, transform: `scale(${2.2 - 1.2 * g}) rotate(-8deg)`, opacity: g, ...style}}>{metin}</div>;
};

// ——— Sorun sahneleri ———
const Teslim: React.FC = () => {
  const frame = useCurrentFrame();
  const g = sp(frame - 2, 30, 14, 120);
  const anahtar = sp(frame - 20, 30, 12, 140);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: yaziTipi, color: '#ffffffaa', fontSize: 36, letterSpacing: 8, marginTop: -420, opacity: g}}>RENAULT CLIO · DEMO</div>
    <Plaka style={{marginTop: 40, transform: `translateY(${(1 - g) * 200}px) scale(${0.9 + 0.1 * g})`, opacity: g}} />
    <div style={{fontSize: 150, marginTop: 60, transform: `translateX(${(1 - anahtar) * -500}px) rotate(${(1 - anahtar) * -60}deg)`}}>🔑</div>
    <Damga f={frame - 40} metin="TESLİM EDİLDİ ✓" style={{top: 1080}} />
  </AbsoluteFill>;
};

const Ceza: React.FC = () => {
  const frame = useCurrentFrame();
  const gun = Math.min(21, Math.max(1, Math.round(interpolate(frame, [0, 26], [1, 21], cl))));
  const bildirim = sp(frame - 30, 30, 11, 200);
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff', transform: frame >= 30 && frame < 40 ? `translate(${(random(`c${frame}`) - 0.5) * 30}px, 0)` : undefined}}>
    <div style={{marginTop: 330, width: 420, borderRadius: 30, overflow: 'hidden', background: '#f4f4f4', boxShadow: '0 30px 90px #000', opacity: interpolate(frame, [28, 36], [1, 0.25], cl)}}>
      <div style={{background: renk.kirmizi, padding: 18, textAlign: 'center', fontSize: 34, fontWeight: 800, letterSpacing: 4}}>GÜN</div>
      <div style={{padding: 30, textAlign: 'center', fontSize: 200, fontWeight: 800, color: '#111', lineHeight: 1}}>+{gun}</div>
    </div>
    {frame >= 30 && <div style={{position: 'absolute', top: 760, left: 90, right: 90, borderRadius: 34, background: '#1d1d22ee', border: `3px solid ${renk.kirmizi}`, padding: 34, transform: `translateY(${(1 - bildirim) * -500}px)`, boxShadow: `0 0 60px ${renk.kirmizi}80`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 28, opacity: 0.7}}><span style={{fontSize: 40}}>⚠️</span> TEBLİGAT · şimdi</div>
      <div style={{fontSize: 52, fontWeight: 800, marginTop: 14}}>Trafik cezası</div>
      <div style={{fontSize: 36, marginTop: 10, color: '#ddd'}}>06 DEM 002 · 03.10 · 14:22</div>
    </div>}
  </AbsoluteFill>;
};

const Kim: React.FC = () => {
  const frame = useCurrentFrame();
  const soru = sp(frame - 14, 30, 7, 280);
  const satir = (m: string, i: number, ciz = false) => <div style={{position: 'relative', height: 86, borderBottom: '2px solid #9fb6d6', fontSize: 46, fontStyle: 'italic', color: '#243a6b', paddingTop: 22, opacity: interpolate(frame, [i * 3, i * 3 + 6], [0, 1], cl)}}>
    {m}{ciz && <div style={{position: 'absolute', left: -10, right: 40, top: 48, height: 6, background: '#243a6b', transform: 'rotate(-3deg)'}} />}
  </div>;
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 760, height: 900, background: '#f3ead2', borderRadius: 8, padding: '60px 50px 0 110px', boxShadow: '0 40px 120px #000', transform: 'rotate(-3deg)', fontFamily: yaziTipi, position: 'relative', borderLeft: '6px solid #d66'}}>
      <div style={{fontSize: 40, fontWeight: 800, color: '#243a6b', marginBottom: 10}}>KİRALAMA DEFTERİ</div>
      {satir('01.10  Clio → A. bey', 0)}
      {satir('02.10  Clio → ?', 1, true)}
      {satir('03.10  ??', 2)}
      {satir('04.10  iade (sanırım)', 3)}
      {satir('', 4)}
    </div>
    {frame >= 14 && <div style={{position: 'absolute', right: 90, top: 380, fontFamily: yaziTipi, fontWeight: 800, fontSize: 420, color: renk.kirmizi, textShadow: `0 0 80px ${renk.kirmizi}`, transform: `scale(${2 - soru}) rotate(10deg)`}}>?</div>}
  </AbsoluteFill>;
};

const Yakit: React.FC = () => {
  const frame = useCurrentFrame();
  const aci = -90 + 90 + Math.sin(frame / 6) * 70 + 20; // ibre kararsız: yarım ↔ dolu
  const yarim = Math.sin(frame / 6) < 0.2;
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff'}}>
    <div style={{marginTop: 420, position: 'relative', width: 700, height: 400}}>
      <svg width={700} height={400} viewBox="0 0 700 400">
        <path d="M 60 360 A 290 290 0 0 1 640 360" stroke="#ffffff30" strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d="M 60 360 A 290 290 0 0 1 200 110" stroke={renk.kirmizi} strokeWidth={30} fill="none" strokeLinecap="round" />
        {Array.from({length: 9}).map((_, i) => {const a = Math.PI - (i / 8) * Math.PI; return <line key={i} x1={350 + Math.cos(a) * 250} y1={360 - Math.sin(a) * 250} x2={350 + Math.cos(a) * 215} y2={360 - Math.sin(a) * 215} stroke="#fff" strokeWidth={i % 4 === 0 ? 8 : 4} />;})}
        <g transform={`rotate(${aci} 350 360)`}><line x1={350} y1={360} x2={350} y2={110} stroke="#fff" strokeWidth={10} strokeLinecap="round" /></g>
        <circle cx={350} cy={360} r={30} fill={renk.kirmizi} />
      </svg>
      <div style={{position: 'absolute', left: 30, bottom: -70, fontSize: 50, fontWeight: 800}}>E</div>
      <div style={{position: 'absolute', right: 30, bottom: -70, fontSize: 50, fontWeight: 800}}>F</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: -70, textAlign: 'center', fontSize: 60}}>⛽</div>
    </div>
    <div style={{marginTop: 160, display: 'flex', gap: 40, fontSize: 72, fontWeight: 800}}>
      <span style={{color: yarim ? renk.kirmizi : '#ffffff40'}}>YARIM?</span><span style={{color: !yarim ? renk.kirmizi : '#ffffff40'}}>DOLU?</span>
    </div>
  </AbsoluteFill>;
};

const Cizik: React.FC = () => {
  const frame = useCurrentFrame();
  const halka = sp(frame - 8, 30, 10, 200);
  const eski = Math.floor(frame / 9) % 2 === 0;
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff'}}>
    <svg width={960} height={420} viewBox="0 0 960 420" style={{marginTop: 480, transform: `scale(${1 + frame * 0.002})`}}>
      <path d="M 60 300 L 90 220 Q 120 190 220 180 L 330 100 Q 360 80 420 80 L 640 80 Q 700 80 740 120 L 820 190 Q 900 200 910 250 L 910 300 Z" fill="#2a2a30" stroke="#888" strokeWidth={4} />
      <path d="M 350 110 L 470 110 L 470 185 L 260 185 Z M 490 110 L 640 110 Q 680 110 710 150 L 735 185 L 490 185 Z" fill="#14141a" />
      <line x1={480} y1={110} x2={480} y2={300} stroke="#555" strokeWidth={3} />
      <circle cx={230} cy={300} r={70} fill="#111" stroke="#666" strokeWidth={8} /><circle cx={740} cy={300} r={70} fill="#111" stroke="#666" strokeWidth={8} />
      <path d="M 560 225 l 30 -6 l 25 8 l 40 -10" stroke="#e8e8e8" strokeWidth={5} fill="none" />
      <circle cx={605} cy={222} r={30 + 50 * halka} stroke={renk.kirmizi} strokeWidth={8} fill="none" opacity={halka} />
    </svg>
    <div style={{marginTop: 120, display: 'flex', gap: 40, fontSize: 80, fontWeight: 800}}>
      <span style={{color: eski ? renk.kirmizi : '#ffffff40'}}>ESKİ?</span><span style={{color: !eski ? renk.kirmizi : '#ffffff40'}}>YENİ?</span>
    </div>
  </AbsoluteFill>;
};

const Siz: React.FC = () => {
  const frame = useCurrentFrame();
  const g = sp(frame - 52, 30, 7, 300);
  const titre = frame >= 52 && frame < 62 ? (random(`s${frame}`) - 0.5) * 40 : 0;
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, transform: `translate(${titre}px, ${titre / 2}px)`}}>
    <div style={{fontSize: 90, color: '#fff', letterSpacing: 14, opacity: interpolate(frame, [30, 40], [0, 1], cl), marginBottom: 120}}>PARAYI</div>
    <div style={{opacity: frame >= 52 ? 1 : 0, fontSize: 400, lineHeight: 1, color: renk.kirmizi, transform: `scale(${2.4 - 1.4 * g})`, textShadow: `0 0 80px ${renk.kirmizi}`}}>SİZ</div>
    <div style={{fontSize: 90, color: '#fff', letterSpacing: 14, marginTop: 40, opacity: frame >= 60 ? sp(frame - 60, 30) : 0}}>ÖDERSİNİZ</div>
    {frame < 30 && <div style={{position: 'absolute', fontSize: 64, color: '#ffffffcc', opacity: interpolate(frame, [0, 6, 24, 30], [0, 1, 1, 0], cl)}}>Defterde yoksa…</div>}
  </AbsoluteFill>;
};

// ——— Nexus Car ekranları (demo veri) ———
const UstBar: React.FC<{baslik: string; alt: string}> = ({baslik, alt}) => <div style={{padding: '90px 36px 24px', borderBottom: '1px solid #222', background: '#0f0f12'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 56}} />
    <div style={{fontSize: 24, letterSpacing: 4, opacity: 0.6}}>NEXUS CAR</div>
  </div>
  <div style={{fontSize: 44, fontWeight: 800, marginTop: 14}}>{baslik}</div>
  <div style={{fontSize: 26, opacity: 0.6, marginTop: 4}}>{alt}</div>
</div>;

const NTeslim: React.FC = () => {
  const frame = useCurrentFrame();
  const km = Math.round(interpolate(frame, [6, 30], [0, 48215], cl));
  const yakit = Math.min(4, Math.max(0, Math.floor((frame - 30) / 5)));
  const fotolar = ['Ön', 'Arka', 'Sol yan', 'Sağ yan', 'Sol ön köşe', 'Sağ ön köşe', 'Sol arka köşe', 'Sağ arka köşe', 'İç mekân'];
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Araç teslim" alt="06 DEM 002 · Renault Clio" />
        <div style={{padding: '22px 36px'}}>
          <div style={{fontSize: 26, opacity: 0.6}}>Kilometre</div>
          <div style={{fontSize: 56, fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{km.toLocaleString('tr-TR')}</div>
          <div style={{fontSize: 26, opacity: 0.6, marginTop: 18}}>Yakıt seviyesi</div>
          <div style={{display: 'flex', gap: 8, marginTop: 10, alignItems: 'center'}}>
            {Array.from({length: 8}).map((_, i) => <div key={i} style={{flex: 1, height: 34, borderRadius: 6, background: i < yakit ? renk.kirmizi : '#26262b'}} />)}
            <div style={{fontSize: 30, fontWeight: 800, marginLeft: 14, width: 120}}>{yakit}/8{yakit === 4 ? ' Yarım' : ''}</div>
          </div>
          <div style={{fontSize: 26, opacity: 0.6, marginTop: 24}}>Fotoğraflar</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10}}>
            {fotolar.map((f, i) => {
              const tamam = frame >= 55 + i * 5;
              return <div key={f} style={{height: 118, borderRadius: 12, background: tamam ? 'linear-gradient(135deg, #3a3a42, #1d1d22)' : '#16161a', border: tamam ? '2px solid #2DBE60' : '2px dashed #333', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 8, fontSize: 19, color: tamam ? '#fff' : '#666'}}>
                {f}{tamam && <div style={{position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, background: '#2DBE60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transform: `scale(${sp(frame - 55 - i * 5, 30, 8, 260)})`}}>✓</div>}
              </div>;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="NEXUS CAR" metin="TESLİM" />
  </>;
};

const NCeza: React.FC = () => {
  const frame = useCurrentFrame();
  const eslesme = sp(frame - 40, 30, 12, 160);
  const yansidi = frame >= 75;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Ceza / HGS / otopark" alt="Yeni ceza / HGS kaydı" />
        <div style={{margin: '30px 30px 0', padding: 30, borderRadius: 22, background: '#16161a', border: `2px solid ${renk.kirmizi}`, opacity: sp(frame - 4, 30)}}>
          <div style={{fontSize: 26, opacity: 0.6}}>Trafik cezası</div>
          <div style={{fontSize: 40, fontWeight: 800, marginTop: 6}}>06 DEM 002</div>
          <div style={{fontSize: 32, marginTop: 6}}>03.10 · 14:22</div>
        </div>
        <div style={{height: 90 * eslesme, width: 6, background: renk.kirmizi, margin: '0 auto'}} />
        <div style={{margin: '0 30px', padding: 30, borderRadius: 22, background: '#16161a', border: '2px solid #2DBE60', opacity: eslesme, transform: `scale(${0.9 + 0.1 * eslesme})`}}>
          <div style={{fontSize: 26, color: '#2DBE60', fontWeight: 800}}>O saatte kiralamada</div>
          <div style={{fontSize: 38, fontWeight: 800, marginTop: 8}}>Kiralama 01.10 – 05.10</div>
          <div style={{fontSize: 28, opacity: 0.7, marginTop: 6}}>Teslim tutanağı · imzalı</div>
        </div>
        <div style={{margin: '36px 30px 0', display: 'flex', gap: 12, fontSize: 26, fontWeight: 800}}>
          {['Bekliyor', 'Kiracıya yansıtıldı'].map((d, i) => {
            const secili = yansidi ? i === 1 : i === 0;
            return <div key={d} style={{padding: '14px 22px', borderRadius: 30, background: secili ? renk.kirmizi : '#1d1d22', color: secili ? '#fff' : '#777'}}>{d}</div>;
          })}
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="NEXUS CAR" metin="CEZA" />
  </>;
};

const NHesap: React.FC = () => {
  const frame = useCurrentFrame();
  const kalem = (ad: string, f: number) => {
    const g = sp(frame - f, 30, 12, 200);
    return <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 0', borderBottom: '2px solid #222', fontSize: 32, opacity: g, transform: `translateX(${(1 - g) * 120}px)`}}>
      <span>{ad}</span><span style={{color: '#2DBE60', fontWeight: 800, fontSize: 28}}>+ eklendi</span>
    </div>;
  };
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Araç iade" alt="06 DEM 002 · Renault Clio" />
        <div style={{padding: '20px 36px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, opacity: 0.75}}><span>Planlanan</span><span>05.10 · 10:00</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, marginTop: 10}}><span>İade</span><span style={{color: renk.kirmizi, fontWeight: 800}}>05.10 · 13:40</span></div>
          <div style={{marginTop: 30, fontSize: 26, opacity: 0.6}}>İade hesabı</div>
          {kalem('Kira bedeli', 14)}
          {kalem('Yakıt eksiği (2/8)', 30)}
          {kalem('Gecikme (220 dk, saatlik)', 46)}
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="NEXUS CAR" metin="İADE" />
  </>;
};

const Dm: React.FC = () => {
  const frame = useCurrentFrame();
  const yazi = 'DEMO';
  const n = Math.min(yazi.length, Math.max(0, Math.floor((frame - 8) / 4)));
  const gonder = frame >= 30;
  const b = sp(frame - 30, 30, 11, 220);
  return <Telefon>
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '90px 30px 26px', borderBottom: '1px solid #222'}}>
        <div style={{width: 80, height: 80, borderRadius: 40, background: '#000', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}><Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 70}} /></div>
        <div><div style={{fontSize: 34, fontWeight: 800}}>nexusstudiocs</div><div style={{fontSize: 24, opacity: 0.6}}>Nexus Studio</div></div>
      </div>
      {gonder && <div style={{position: 'absolute', right: 30, bottom: 200, background: 'linear-gradient(135deg, #C20D38, #941F38)', borderRadius: 40, padding: '24px 40px', fontSize: 48, fontWeight: 800, transform: `scale(${b})`, transformOrigin: 'bottom right'}}>DEMO</div>}
      <div style={{position: 'absolute', left: 24, right: 24, bottom: 60, height: 96, borderRadius: 48, background: '#1d1d22', display: 'flex', alignItems: 'center', padding: '0 34px', fontSize: 38, justifyContent: 'space-between'}}>
        <span>{gonder ? <span style={{opacity: 0.4}}>Mesaj…</span> : <>{yazi.slice(0, n)}<span style={{opacity: frame % 16 < 8 ? 1 : 0}}>|</span></>}</span>
        <span style={{color: '#4b8bff', fontWeight: 800, fontSize: 32}}>Gönder</span>
      </div>
    </AbsoluteFill>
  </Telefon>;
};

const Son: React.FC = () => {
  const frame = useCurrentFrame();
  const g = sp(frame - 25, 30, 14, 160);
  return <AbsoluteFill>
    <OffthreadVideo src={staticFile(R + 'logo-acilis.mp4')} muted playbackRate={0.6} style={{width: '100%', height: '100%', objectFit: 'cover'}} startFrom={150} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, #09090BF5 0%, #09090BAA 35%, transparent 60%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 250, textAlign: 'center', fontFamily: yaziTipi, color: '#fff', opacity: g, transform: `translateY(${(1 - g) * 40}px)`}}>
      <div style={{fontSize: 44, fontWeight: 800, letterSpacing: 2}}>Kamera da tutarız. Kod da yazarız.</div>
      <div style={{height: 4, width: 110, background: renk.kirmizi, margin: '28px auto'}} />
      <div style={{fontSize: 46, fontWeight: 800}}>{iletisim.telefon}</div>
      <div style={{fontSize: 38, fontWeight: 600, marginTop: 10}}>{iletisim.instagram} · Ankara</div>
    </div>
  </AbsoluteFill>;
};

const Kesme: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const g = sp(frame, 30, 14, 220);
  return <AbsoluteFill style={{transform: `scale(${1.12 - 0.12 * g})`}}>
    {children}
    <AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [0, 4], [0.35, 0], cl), pointerEvents: 'none'}} />
  </AbsoluteFill>;
};

const sira: [number, React.FC][] = [[sahne.teslim, Teslim], [sahne.ceza, Ceza], [sahne.kim, Kim], [sahne.yakit, Yakit], [sahne.cizik, Cizik], [sahne.siz, Siz], [sahne.nTeslim, NTeslim], [sahne.nCeza, NCeza], [sahne.nHesap, NHesap], [sahne.dm, Dm], [sahne.son, Son]];

const Ses: React.FC<{ad: string; at: number; v?: number}> = ({ad, at, v = 0.5}) => <Sequence from={at}><Audio src={sfxYolu(ad)} volume={v} /></Sequence>;

export const Reels04: React.FC = () => {
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    <Zemin />
    {sira.map(([bas, Bil], i) => {
      const bitis = i + 1 < sira.length ? sira[i + 1][0] : REELS04_SURE;
      return <Sequence key={i} from={bas} durationInFrames={bitis - bas}><Kesme><Bil /></Kesme></Sequence>;
    })}
    <Sequence durationInFrames={sahne.son}><Vizor /></Sequence>
    <Altyazi />
    {satirlar.map((s, i) => <Sequence key={i} from={s.from}><Audio src={staticFile(`${R}vo${i + 1}.wav`)} volume={1} /></Sequence>)}
    {/* ses tasarımı: sorun kısmı gerilim, Nexus Car kısmı ferah */}
    <Sequence from={sahne.ceza} durationInFrames={sahne.nTeslim - sahne.ceza}><Audio src={sfxYolu('dramatik--gerilim-droneu')} volume={0.25} loop /></Sequence>
    <Ses ad="metin--pop-yumusak" at={20} v={0.4} />
    <Ses ad="bildirim--basari" at={40} v={0.35} />
    <Ses ad="gecis--kagit-swipe" at={sahne.ceza} v={0.5} />
    <Ses ad="bildirim--hata" at={sahne.ceza + 30} v={0.45} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.kim} />
    <Ses ad="dijital--glitch-kisa" at={sahne.kim + 14} v={0.3} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.yakit} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.cizik} />
    <Ses ad="foto--stevemotion-camera-click" at={sahne.cizik + 8} v={0.5} />
    <Ses ad="gecis--whoosh-sert" at={sahne.siz} v={0.5} />
    <Ses ad="vurgu--trailer-boom" at={sahne.siz + 70} v={0.3} />
    <Ses ad="gecis--whoosh-uzun" at={sahne.nTeslim - 6} v={0.5} />
    <Ses ad="metin--tik-daktilo" at={sahne.nTeslim + 8} v={0.3} />
    {Array.from({length: 9}).map((_, i) => <Ses key={i} ad="foto--stevemotion-camera-click" at={sahne.nTeslim + 55 + i * 5} v={0.25} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.nCeza} />
    <Ses ad="bildirim--ding" at={sahne.nCeza + 40} v={0.4} />
    <Ses ad="metin--pop" at={sahne.nCeza + 75} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nHesap} />
    <Ses ad="bildirim--ding" at={sahne.nHesap + 14} v={0.35} /><Ses ad="bildirim--ding" at={sahne.nHesap + 30} v={0.35} /><Ses ad="bildirim--ding" at={sahne.nHesap + 46} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.dm} />
    {[0, 1, 2, 3].map((i) => <Ses key={i} ad="metin--tik-daktilo" at={sahne.dm + 8 + i * 4} v={0.5} />)}
    <Ses ad="bildirim--mesaj" at={sahne.dm + 30} v={0.6} />
    <Ses ad="vurgu--trailer-boom" at={sahne.son} v={0.5} />
  </AbsoluteFill>;
};
