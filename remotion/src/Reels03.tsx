import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

// Gönderi 3 Reels: "Müşteri sizi aradı. Rakibinizi buldu." — çekimsiz hareketli tasarım, Piper dış ses.
const R = 'reels/r03/';
const sahne = {arama: 0, rakip: 48, uc: 96, google: 182, insta: 285, web: 420, rontgen: 508, dm: 624, son: 700};
export const REELS03_SURE = 800;

type Satir = {from: number; sure: number; metin: string; vurgu?: string[]};
const satirlar: Satir[] = [
  {from: 4, sure: 31, metin: 'Müşteri sizi aradı.', vurgu: ['aradı.']},
  {from: 50, sure: 31, metin: 'Ama rakibinizi buldu.', vurgu: ['rakibinizi']},
  {from: 98, sure: 77, metin: 'Neden mi? Tam üç açık var.', vurgu: ['üç', 'açık']},
  {from: 184, sure: 95, metin: 'Birincisi: Google profilinizde saat yok, fotoğraf yok.', vurgu: ['yok,', 'yok.']},
  {from: 287, sure: 116, metin: "İkincisi: Instagram'a giren 5 saniyede ne sattığınızı anlamıyor.", vurgu: ['5', 'saniyede']},
  {from: 422, sure: 70, metin: 'Üçüncüsü: siteniz telefonda açılmıyor.', vurgu: ['açılmıyor.']},
  {from: 510, sure: 109, metin: 'Biz bunu 30 dakikada buluyoruz. Ücretsiz.', vurgu: ['30', 'dakikada', 'Ücretsiz.']},
  {from: 626, sure: 43, metin: "DM'den RÖNTGEN yazın.", vurgu: ['RÖNTGEN']},
];

const sp = (f: number, fps: number, d = 12, s = 160) => spring({frame: Math.max(0, f), fps, config: {damping: d, stiffness: s}});
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Kelime kelime altyazı: satır süresi harf sayısına göre bölünür, 3'lü öbekler.
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
  return <div style={{position: 'absolute', left: 60, right: 60, top: 1430, textAlign: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 78, lineHeight: 1.1, textTransform: 'uppercase', transform: `scale(${0.85 + 0.15 * pop})`, textShadow: '0 6px 24px #000, 0 0 2px #000'}}>
    {obek.map((k, i) => {
      const gi = obekBas + i;
      const vurgu = s.vurgu?.includes(k);
      const okundu = gi <= aktif;
      return <span key={gi} style={{color: vurgu && okundu ? renk.kirmizi : renk.beyaz, opacity: okundu ? 1 : 0.35, marginRight: 22, display: 'inline-block', WebkitTextStroke: vurgu && okundu ? '0' : '2px #000'}}>{k}</span>;
    })}
  </div>;
};

// Sinematik zemin: bordo ışık, film greni, vizör köşeleri (marka imzası).
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

// Telefon kasası
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

const Carpi: React.FC<{f: number; style: React.CSSProperties}> = ({f, style}) => {
  const g = sp(f, 30, 8, 260);
  if (f < 0) return null;
  return <div style={{position: 'absolute', width: 86, height: 86, borderRadius: 43, background: renk.kirmizi, color: '#fff', fontSize: 58, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${g}) rotate(${(1 - g) * -90}deg)`, boxShadow: `0 0 40px ${renk.kirmizi}`, ...style}}>✕</div>;
};

// ——— Sahneler ———
const Arama: React.FC = () => {
  const frame = useCurrentFrame();
  const halka = (o: number) => ((frame + o) % 30) / 30;
  return <Telefon titre={frame % 20 < 12 ? 14 : 0}>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #1b1b20, #0b0b0d)', alignItems: 'center'}}>
      <div style={{marginTop: 150, fontSize: 30, opacity: 0.7}}>Gelen arama…</div>
      <div style={{position: 'relative', marginTop: 70, width: 220, height: 220}}>
        {[0, 10, 20].map((o) => <div key={o} style={{position: 'absolute', inset: -halka(o) * 120, borderRadius: '50%', border: `4px solid ${renk.kirmizi}`, opacity: 1 - halka(o)}} />)}
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#3a3a40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110}}>👤</div>
      </div>
      <div style={{marginTop: 60, fontSize: 64, fontWeight: 800}}>Yeni müşteri</div>
      <div style={{marginTop: 14, fontSize: 30, opacity: 0.6}}>mobil · Ankara</div>
      <div style={{position: 'absolute', bottom: 150, left: 110, right: 110, display: 'flex', justifyContent: 'space-between'}}>
        <div style={{width: 130, height: 130, borderRadius: 65, background: '#E5383B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60}}>✆</div>
        <div style={{width: 130, height: 130, borderRadius: 65, background: '#2DBE60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, transform: `scale(${1 + Math.sin(frame / 3) * 0.08})`}}>✆</div>
      </div>
    </AbsoluteFill>
  </Telefon>;
};

const SonucKarti: React.FC<{ad: string; puan: string; yorum: string; durum: string; parlak?: boolean; f: number}> = ({ad, puan, yorum, durum, parlak, f}) => {
  const g = sp(f, 30, 14, 180);
  return <div style={{margin: '0 30px 26px', padding: 30, borderRadius: 24, background: parlak ? '#1f1f24' : '#141417', border: parlak ? `3px solid ${renk.kirmizi}` : '2px solid #2a2a2e', opacity: parlak ? g : 0.45 * g, transform: `translateX(${(1 - g) * 200}px)`, filter: parlak ? 'none' : 'grayscale(1)'}}>
    <div style={{fontSize: 40, fontWeight: 800}}>{ad}</div>
    <div style={{fontSize: 30, marginTop: 10, color: parlak ? '#FFC94D' : '#888'}}>{puan} <span style={{color: '#aaa'}}>{yorum}</span></div>
    <div style={{fontSize: 28, marginTop: 8, color: parlak ? '#2DBE60' : '#888'}}>{durum}</div>
    {parlak && <div style={{display: 'flex', gap: 12, marginTop: 20}}>{[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 110, borderRadius: 14, background: `linear-gradient(135deg, #4a2a30, #2a2a30 ${40 + i * 20}%)`}} />)}</div>}
    {parlak && <div style={{marginTop: 22, background: '#2DBE60', borderRadius: 40, padding: '16px 0', textAlign: 'center', fontSize: 32, fontWeight: 800}}>✆ Ara</div>}
  </div>;
};

const Rakip: React.FC = () => {
  const frame = useCurrentFrame();
  return <Telefon>
    <AbsoluteFill style={{background: '#0d0d10'}}>
      <div style={{margin: '110px 30px 34px', padding: '22px 30px', borderRadius: 50, background: '#1d1d22', fontSize: 30, color: '#bbb'}}>🔍 yakınımdaki …</div>
      <SonucKarti f={frame - 4} parlak ad="Rakip İşletme" puan="★★★★★ 4,8" yorum="(212)" durum="Açık · 22:00'ye kadar" />
      <SonucKarti f={frame - 12} ad="Sizin işletmeniz" puan="☆☆☆☆☆ —" yorum="(0)" durum="Saat bilgisi yok" />
    </AbsoluteFill>
  </Telefon>;
};

const UcAcik: React.FC = () => {
  const frame = useCurrentFrame();
  const g = sp(frame - 54, 30, 7, 300);
  const titre = frame >= 54 && frame < 64 ? (random(`u${frame}`) - 0.5) * 40 : 0;
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `translate(${titre}px, ${titre / 2}px)`}}>
    <div style={{fontFamily: yaziTipi, fontWeight: 800, fontSize: 70, color: '#fff', opacity: interpolate(frame, [0, 8], [0, 1], cl), marginTop: -320}}>NEDEN?</div>
    {frame >= 54 && <div style={{fontFamily: yaziTipi, fontWeight: 800, fontSize: 620, lineHeight: 1, color: renk.kirmizi, transform: `scale(${2.4 - 1.4 * g})`, textShadow: `0 0 80px ${renk.kirmizi}`, marginTop: -40}}>3</div>}
    {frame >= 62 && <div style={{fontFamily: yaziTipi, fontWeight: 800, fontSize: 90, color: '#fff', letterSpacing: 20, marginTop: -30, opacity: sp(frame - 62, 30)}}>AÇIK</div>}
  </AbsoluteFill>;
};

const Google: React.FC = () => {
  const frame = useCurrentFrame();
  const satir = (et: string, deger: string, f: number) => <div style={{position: 'relative', padding: '28px 0', borderBottom: '2px solid #222', fontSize: 32}}>
    <div style={{opacity: 0.55, fontSize: 26}}>{et}</div><div style={{marginTop: 6, color: '#777'}}>{deger}</div>
    <Carpi f={frame - f} style={{right: 0, top: 26}} />
  </div>;
  return <>
    <Telefon style={{transform: `scale(${1 + frame * 0.0006})`}}>
      <AbsoluteFill style={{background: '#0d0d10', padding: '100px 40px 0'}}>
        <div style={{height: 260, borderRadius: 24, background: '#1a1a1e', border: '3px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 30, position: 'relative'}}>📷 Fotoğraf eklenmemiş<Carpi f={frame - 70} style={{right: 20, top: 20}} /></div>
        <div style={{fontSize: 46, fontWeight: 800, marginTop: 30}}>Sizin işletmeniz</div>
        <div style={{fontSize: 28, color: '#777', marginTop: 8}}>☆☆☆☆☆ Henüz yorum yok</div>
        {satir('Çalışma saatleri', 'Eklenmemiş', 40)}
        {satir('Telefon', 'Eklenmemiş', 86)}
        {satir('Web sitesi', '—', 98)}
      </AbsoluteFill>
    </Telefon>
    <Bolum no="01" metin="GOOGLE PROFİLİ" />
  </>;
};

const Insta: React.FC = () => {
  const frame = useCurrentFrame();
  const kalan = Math.max(0, 5 - Math.floor((frame - 10) / 20));
  const git = sp(frame - 112, 30, 16, 140);
  const halka = interpolate(frame, [10, 110], [1, 0], cl);
  return <>
    <Telefon style={{transform: `translateY(${-git * 1400}px) rotate(${-git * 6}deg)`}}>
      <AbsoluteFill style={{background: '#000', padding: '100px 36px 0'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <div style={{width: 170, height: 170, borderRadius: 85, background: '#2a2a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70}}>👤</div>
          {[['3', 'gönderi'], ['41', 'takipçi'], ['12', 'takip']].map(([a, b]) => <div key={b} style={{textAlign: 'center'}}><div style={{fontSize: 40, fontWeight: 800}}>{a}</div><div style={{fontSize: 24, opacity: 0.7}}>{b}</div></div>)}
        </div>
        <div style={{fontSize: 32, fontWeight: 800, marginTop: 26}}>isletmeniz_official</div>
        <div style={{fontSize: 28, color: '#666', marginTop: 8, height: 80, border: '2px dashed #333', borderRadius: 10, display: 'flex', alignItems: 'center', paddingLeft: 16}}>(biyografi boş)</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 30}}>
          {Array.from({length: 9}).map((_, i) => <div key={i} style={{aspectRatio: '1', background: i < 3 ? '#26262b' : '#111', display: 'flex', alignItems: 'flex-end', padding: 8, fontSize: 20, color: '#666'}}>{i < 3 ? '15 hf önce' : ''}</div>)}
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="02" metin="INSTAGRAM" />
    {frame >= 10 && git < 0.5 && <div style={{position: 'absolute', right: 70, top: 300, width: 220, height: 220}}>
      <svg width={220} height={220}><circle cx={110} cy={110} r={96} stroke="#ffffff30" strokeWidth={14} fill="#09090BDD" /><circle cx={110} cy={110} r={96} stroke={renk.kirmizi} strokeWidth={14} fill="none" strokeDasharray={603} strokeDashoffset={603 * (1 - halka)} transform="rotate(-90 110 110)" strokeLinecap="round" /></svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 110, color: '#fff'}}>{kalan}</div>
    </div>}
    {git > 0.3 && <div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 64, color: '#fff', opacity: git}}>…ve kaydırdı.</div>}
  </>;
};

const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const ilerleme = interpolate(frame, [0, 30, 80], [0, 0.82, 0.88], cl);
  const hata = frame > 50;
  return <>
    <Telefon titre={hata && frame < 58 ? 18 : 0}>
      <AbsoluteFill style={{background: '#f2f2f2', color: '#222'}}>
        <div style={{marginTop: 90, margin: '90px 24px 0', padding: '18px 24px', background: '#e2e2e2', borderRadius: 18, fontSize: 28}}>🔒 isletmeniz.com</div>
        <div style={{height: 8, margin: '10px 24px', background: '#ddd'}}><div style={{height: '100%', width: `${ilerleme * 100}%`, background: '#1a73e8'}} /></div>
        {!hata && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}><div style={{width: 120, height: 120, borderRadius: 60, border: '12px solid #ccc', borderTopColor: '#1a73e8', transform: `rotate(${frame * 14}deg)`}} /></AbsoluteFill>}
        {hata && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: 60, textAlign: 'center'}}>
          <div style={{fontSize: 120}}>⚠️</div>
          <div style={{fontSize: 44, fontWeight: 800, marginTop: 20}}>Bu siteye ulaşılamıyor</div>
          <div style={{fontSize: 28, color: '#666', marginTop: 16}}>Yanıt vermesi çok uzun sürdü.</div>
        </AbsoluteFill>}
      </AbsoluteFill>
    </Telefon>
    <Bolum no="03" metin="WEB SİTESİ" />
  </>;
};

const Rontgen: React.FC = () => {
  const frame = useCurrentFrame();
  const dk = Math.round(interpolate(frame, [0, 60], [0, 30], cl));
  const satir = (m: string, f: number) => {
    const g = sp(frame - f, 30, 12, 200);
    return <div style={{display: 'flex', alignItems: 'center', gap: 26, fontSize: 46, fontWeight: 800, opacity: g, transform: `translateX(${(1 - g) * 80}px)`, marginTop: 30}}>
      <div style={{width: 64, height: 64, borderRadius: 12, background: renk.kirmizi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, transform: `scale(${g})`}}>✓</div>{m}
    </div>;
  };
  return <AbsoluteFill style={{fontFamily: yaziTipi, color: '#fff', alignItems: 'center'}}>
    <div style={{marginTop: 280, fontSize: 40, letterSpacing: 8, opacity: 0.8}}>DİJİTAL RÖNTGEN</div>
    <div style={{fontSize: 230, fontWeight: 800, lineHeight: 1, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>{dk}<span style={{fontSize: 90, color: renk.kirmizi}}> dk</span></div>
    <div style={{marginTop: 50, width: 640}}>{satir('Google profili', 20)}{satir('Instagram', 34)}{satir('Web sitesi', 48)}</div>
    <div style={{marginTop: 50, fontSize: 36, opacity: sp(frame - 62, 30), border: '2px solid #ffffff55', padding: '14px 28px'}}>1 sayfa rapor + 3 net öneri</div>
  </AbsoluteFill>;
};

const Dm: React.FC = () => {
  const frame = useCurrentFrame();
  const yazi = 'RÖNTGEN';
  const n = Math.min(yazi.length, Math.max(0, Math.floor((frame - 8) / 3)));
  const gonder = frame >= 38;
  const b = sp(frame - 38, 30, 11, 220);
  return <Telefon>
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '90px 30px 26px', borderBottom: '1px solid #222'}}>
        <div style={{width: 80, height: 80, borderRadius: 40, background: '#000', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}><Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 70}} /></div>
        <div><div style={{fontSize: 34, fontWeight: 800}}>nexusstudiocs</div><div style={{fontSize: 24, opacity: 0.6}}>Nexus Studio</div></div>
      </div>
      {gonder && <div style={{position: 'absolute', right: 30, bottom: 200, background: 'linear-gradient(135deg, #C20D38, #941F38)', borderRadius: 40, padding: '24px 40px', fontSize: 48, fontWeight: 800, transform: `scale(${b})`, transformOrigin: 'bottom right'}}>RÖNTGEN</div>}
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

// Kesmelerde vuruş: hafif büyütme + beyaz flaş
const Kesme: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const g = sp(frame, 30, 14, 220);
  return <AbsoluteFill style={{transform: `scale(${1.12 - 0.12 * g})`}}>
    {children}
    <AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [0, 4], [0.35, 0], cl), pointerEvents: 'none'}} />
  </AbsoluteFill>;
};

const sira: [number, React.FC][] = [[sahne.arama, Arama], [sahne.rakip, Rakip], [sahne.uc, UcAcik], [sahne.google, Google], [sahne.insta, Insta], [sahne.web, Web], [sahne.rontgen, Rontgen], [sahne.dm, Dm], [sahne.son, Son]];

const Ses: React.FC<{ad: string; at: number; v?: number}> = ({ad, at, v = 0.5}) => <Sequence from={at}><Audio src={sfxYolu(ad)} volume={v} /></Sequence>;

export const Reels03: React.FC = () => {
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    <Zemin />
    {sira.map(([bas, Bil], i) => {
      const bitis = i + 1 < sira.length ? sira[i + 1][0] : REELS03_SURE;
      return <Sequence key={i} from={bas} durationInFrames={bitis - bas}><Kesme><Bil /></Kesme></Sequence>;
    })}
    <Sequence durationInFrames={sahne.son}><Vizor /></Sequence>
    <Altyazi />
    {/* dış ses */}
    {satirlar.map((s, i) => <Sequence key={i} from={s.from}><Audio src={staticFile(`${R}vo${i + 1}.wav`)} volume={1} /></Sequence>)}
    {/* ses tasarımı */}
    <Sequence durationInFrames={sahne.rontgen}><Audio src={sfxYolu('dramatik--gerilim-droneu')} volume={0.25} loop /></Sequence>
    <Ses ad="bildirim--bildirim" at={0} v={0.45} />
    <Ses ad="dijital--glitch-uzun" at={sahne.rakip - 8} v={0.25} />
    <Ses ad="gecis--whoosh-sert" at={sahne.uc} v={0.5} />
    <Ses ad="vurgu--trailer-boom" at={sahne.uc + 60} v={0.3} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.google} />
    <Ses ad="bildirim--hata" at={sahne.google + 40} v={0.35} /><Ses ad="bildirim--hata" at={sahne.google + 70} v={0.35} /><Ses ad="bildirim--hata" at={sahne.google + 86} v={0.35} /><Ses ad="bildirim--hata" at={sahne.google + 98} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.insta} />
    <Sequence from={sahne.insta + 10} durationInFrames={100}><Audio src={sfxYolu('ortam--11325622-clock-ticking-sound-effect')} volume={0.4} /></Sequence>
    <Ses ad="gecis--whoosh-uzun" at={sahne.insta + 110} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.web} />
    <Ses ad="dijital--sinyal-kaybi" at={sahne.web + 50} v={0.5} />
    <Ses ad="vurgu--vurus-derin" at={sahne.rontgen} v={0.6} />
    <Ses ad="bildirim--ding" at={sahne.rontgen + 20} v={0.4} /><Ses ad="bildirim--ding" at={sahne.rontgen + 34} v={0.4} /><Ses ad="bildirim--ding" at={sahne.rontgen + 48} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.dm} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <Ses key={i} ad="metin--tik-daktilo" at={sahne.dm + 8 + i * 3} v={0.5} />)}
    <Ses ad="bildirim--mesaj" at={sahne.dm + 38} v={0.6} />
    <Ses ad="vurgu--trailer-boom" at={sahne.son} v={0.5} />
  </AbsoluteFill>;
};
