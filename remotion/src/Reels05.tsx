import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

// Reels 05: "Bu kafe şu an para kaybediyor" — Reels04 kalıbı, KafeOS ekranları yalnız demo veriyle.
// Ekrandaki her özellik ve etiket koddan doğrulandı (Kafe-QR-POS-Sistemi):
// lib/languages.ts (Garson Çağır, Hesap İste, Siparişi Onayla, queuedOfflineMessage), app/api/service-requests (CALL_WAITER/REQUEST_BILL),
// lib/database.ts istasyonlar BAR/KITCHEN/PASTRY + demo ürünler, CashierView.tsx (Ürün seçerek, Kişi başı, Nakit/Kart/Yemek Kartı),
// lib/offline-queue.ts (çevrimdışı kuyruk + idempotency → çift sipariş yok).
const R = 'reels/r05/';
// v2: sahne başları VO uzunluklarından (whisper kelime zamanları) hesaplandı; her sahne VO'dan ~4 kare önce başlar.
const sahne = {kanca: 0, masa: 70, fis: 142, hesap: 240, duzen: 314, nQr: 430, nGarson: 596, nAlerjen: 726, nFis: 864, nHesap: 978, nNet: 1114, ozet: 1226, dm: 1306, son: 1400};
export const REELS05_SURE = 1495;

// Altyazı öbekleri elle: noktalama yok, en çok 3-4 kelime, başlangıçlar whisper kelime zamanından (VO başına göre kare).
type Obek = [number, string, string[]?];
type Vo = {dosya: string; at: number; sure: number; alt: Obek[]};
const seslendirme: Vo[] = [
  {dosya: 'vo1', at: 6, sure: 57, alt: []}, // kapak başlığı ekranda
  {dosya: 'vo2', at: 74, sure: 61, alt: [[0, 'ÜÇ MASA', ['ÜÇ']], [10, 'AYNI ANDA', ['AYNI', 'ANDA']], [24, 'GARSON ÇAĞIRIYOR']]},
  {dosya: 'vo3', at: 146, sure: 88, alt: [[1, "MASA 7'YE YAZILAN"], [32, 'SİPARİŞ'], [56, "MASA 4'E GİTTİ", ["4'E", 'GİTTİ']]]},
  {dosya: 'vo4', at: 244, sure: 64, alt: [[0, 'HESAP GELDİ'], [22, 'BİZ AYRI ÖDEYECEĞİZ', ['AYRI']]]},
  {dosya: 'vo5', at: 318, sure: 101, alt: []}, // metin ekranda
  {dosya: 'vo6', at: 436, sure: 154, alt: [[0, "KAFEOS'TE MÜŞTERİ", ["KAFEOS'TE"]], [29, 'KAREKODU OKUTUR'], [61, 'ÜYELİKSİZ SİPARİŞ VERİR', ['ÜYELİKSİZ']], [104, 'GARSONU EKRANDAN ÇAĞIRIR', ['EKRANDAN']]]},
  {dosya: 'voG', at: 600, sure: 119, alt: [[2, 'ÇAĞRI GARSONUN EKRANINA'], [42, 'MASA ADIYLA DÜŞER', ['MASA', 'ADIYLA']], [78, 'KİMİN İLGİLENDİĞİ GÖRÜNÜR', ['GÖRÜNÜR']]]},
  {dosya: 'voA', at: 730, sure: 127, alt: [[1, 'GLUTEN İSTEMEYEN MÜŞTERİ'], [40, 'BUNU İŞARETLER'], [75, 'GLUTENLİ ÜRÜNLER'], [93, 'MENÜDEN ÇIKAR', ['MENÜDEN', 'ÇIKAR']]]},
  {dosya: 'vo7', at: 868, sure: 103, alt: [[2, 'SİPARİŞ'], [14, 'BAR MUTFAK'], [35, 'VE PASTANEYE'], [57, 'AYRI FİŞLERLE DÜŞER', ['AYRI', 'FİŞLERLE']]]},
  {dosya: 'vo8', at: 982, sure: 126, alt: [[0, 'HESAP ÜRÜNE'], [16, 'YA DA KİŞİYE GÖRE'], [40, 'BÖLÜNÜR', ['BÖLÜNÜR']], [60, 'NAKİT KART'], [78, 'YEMEK KARTI BİRLİKTE', ['BİRLİKTE']]]},
  {dosya: 'vo9', at: 1118, sure: 102, alt: [[0, 'İNTERNET KESİLSE BİLE'], [35, 'SİPARİŞ KAYBOLMAZ', ['KAYBOLMAZ']], [69, 'ÇİFT DE GİTMEZ', ['ÇİFT']]]},
  {dosya: 'voO', at: 1230, sure: 71, alt: []}, // kelimeler ekranda
  {dosya: 'vo10', at: 1312, sure: 80, alt: [[2, "DM'DEN KAFE YAZIN", ['KAFE']], [31, 'SİSTEMİ SİZE GÖSTERELİM']]},
];

const sp = (f: number, fps: number, d = 12, s = 160) => spring({frame: Math.max(0, f), fps, config: {damping: d, stiffness: s}});
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const yesil = '#2DBE60';

const Altyazi: React.FC = () => {
  const frame = useCurrentFrame();
  const v = seslendirme.find((x) => frame >= x.at && frame < x.at + x.sure + 6);
  if (!v || v.alt.length === 0) return null;
  const i = v.alt.map(([o]) => v.at + o <= frame).lastIndexOf(true);
  if (i < 0) return null;
  const [o, metin, vurgu = []] = v.alt[i];
  const pop = sp(frame - v.at - o, 30, 10, 220);
  return <div lang="tr" style={{position: 'absolute', left: 50, right: 50, top: 1430, textAlign: 'center', fontFamily: yaziTipi, fontWeight: 800, fontSize: 80, lineHeight: 1.1, transform: `scale(${0.85 + 0.15 * pop})`, textShadow: '0 6px 24px #000, 0 0 2px #000', zIndex: 20}}>
    {metin.split(' ').map((k, j) => {
      const kirmizi = vurgu.includes(k);
      return <span key={j} style={{color: kirmizi ? renk.kirmizi : renk.beyaz, margin: '0 12px', display: 'inline-block', WebkitTextStroke: kirmizi ? '0' : '2px #000'}}>{k}</span>;
    })}
  </div>;
};

// Film greni + ilerleme çubuğu
const Gren: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', zIndex: 30}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
      <filter id="gren"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} /></filter>
      <rect width="100%" height="100%" filter="url(#gren)" />
    </svg>
    <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${(frame / REELS05_SURE) * 100}%`, background: renk.kirmizi, boxShadow: `0 0 16px ${renk.kirmizi}`}} />
  </AbsoluteFill>;
};

const Zemin: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(frame / 40) * 12}% 30%, ${renk.bordo}90, transparent 55%), radial-gradient(circle at 50% 110%, ${renk.kirmizi}40, transparent 50%), ${renk.siyah}`}} />
    <AbsoluteFill style={{opacity: 0.09, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 90px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 90px)'}} />
  </AbsoluteFill>;
};

// Lazer tarama çizgisi — marka dili
const Lazer: React.FC<{y: number; o?: number}> = ({y, o = 1}) => <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 3, background: `linear-gradient(90deg, transparent, ${renk.kirmizi}, transparent)`, boxShadow: `0 0 24px ${renk.kirmizi}`, opacity: o}} />;

const Vizor: React.FC = () => {
  const frame = useCurrentFrame();
  const k = (st: React.CSSProperties) => <div style={{position: 'absolute', width: 70, height: 70, borderColor: '#FFFFFFAA', borderStyle: 'solid', borderWidth: 0, ...st}} />;
  const kayit = Math.floor(frame / 15) % 2 === 0;
  return <AbsoluteFill style={{pointerEvents: 'none', zIndex: 15}}>
    {k({left: 50, top: 120, borderLeftWidth: 4, borderTopWidth: 4})}{k({right: 50, top: 120, borderRightWidth: 4, borderTopWidth: 4})}
    {k({left: 50, bottom: 120, borderLeftWidth: 4, borderBottomWidth: 4})}{k({right: 50, bottom: 120, borderRightWidth: 4, borderBottomWidth: 4})}
    <div style={{position: 'absolute', left: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFFAA', letterSpacing: 2}}>
      <span style={{color: renk.kirmizi, opacity: kayit ? 1 : 0.2}}>●</span> REC  00:{String(Math.floor(frame / 30)).padStart(2, '0')}:{String(frame % 30).padStart(2, '0')}
    </div>
    <div style={{position: 'absolute', right: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFF88'}}>CMT · 14:{String(Math.floor(frame / 30)).padStart(2, '0')}</div>
  </AbsoluteFill>;
};

const Telefon: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
  const frame = useCurrentFrame();
  const g = sp(frame, 30, 14, 140);
  return <div style={{position: 'absolute', left: 190, top: 250, width: 700, height: 1120, borderRadius: 70, background: '#000', border: '10px solid #2B2A2E', boxShadow: `0 0 0 2px #444, 0 40px 120px #000, 0 0 120px ${renk.kirmizi}40`, overflow: 'hidden', transform: `translateY(${(1 - g) * 160}px) rotate(${(1 - g) * -4}deg)`, ...style}}>
    <div style={{position: 'absolute', top: 18, left: 260, width: 160, height: 40, borderRadius: 20, background: '#000', zIndex: 5}} />
    <div style={{position: 'absolute', inset: 0, fontFamily: yaziTipi, color: renk.beyaz}}>{children}</div>
  </div>;
};

const Bolum: React.FC<{no: string; metin: string}> = ({no, metin}) => {
  const frame = useCurrentFrame();
  const g = sp(frame - 4, 30, 14, 200);
  return <div style={{position: 'absolute', top: 175, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10, fontFamily: yaziTipi, transform: `translateY(${(1 - g) * -40}px)`, opacity: g}}>
    <div style={{background: renk.kirmizi, color: '#fff', fontWeight: 800, fontSize: 34, padding: '10px 26px', letterSpacing: 3}}>{no}</div>
    <div style={{background: '#FFFFFF', color: renk.siyah, fontWeight: 800, fontSize: 34, padding: '10px 26px', letterSpacing: 3}}>{metin}</div>
  </div>;
};

const Damga: React.FC<{f: number; metin: string; renkKod?: string; style?: React.CSSProperties}> = ({f, metin, renkKod = yesil, style}) => {
  if (f < 0) return null;
  const g = sp(f, 30, 8, 260);
  return <div style={{position: 'absolute', fontFamily: yaziTipi, fontWeight: 800, fontSize: 70, color: renkKod, border: `8px solid ${renkKod}`, padding: '10px 34px', letterSpacing: 6, transform: `scale(${2.2 - 1.2 * g}) rotate(-8deg)`, opacity: g, background: '#09090Bcc', ...style}}>{metin}</div>;
};

const sars = (frame: number, bas: number, bit: number, guc: number, tohum: string) => frame >= bas && frame < bit ? `translate(${(random(`${tohum}x${frame}`) - 0.5) * guc}px, ${(random(`${tohum}y${frame}`) - 0.5) * guc}px)` : undefined;

// ——— Sorun sahneleri ———
// KANCA: ilk karede dolu salon, masalar sırayla kırmızıya döner, kasa grafiği çakılır.
const Kanca: React.FC = () => {
  const frame = useCurrentFrame();
  const masalar = Array.from({length: 12});
  const ciz = interpolate(frame, [4, 44], [0, 1], cl);
  const flas = interpolate(frame, [34, 38, 48], [0, 0.55, 0], cl);
  return <AbsoluteFill style={{fontFamily: yaziTipi, color: '#fff', transform: sars(frame, 34, 46, 34, 'k')}}>
    <div style={{position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center'}}>
      <div style={{fontSize: 34, letterSpacing: 10, opacity: 0.7}}>CUMARTESİ</div>
      <div style={{fontSize: 190, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 50px ${renk.kirmizi}90`}}>14:00</div>
    </div>
    {/* salon planı */}
    <div style={{position: 'absolute', top: 520, left: 140, right: 140, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 34}}>
      {masalar.map((_, i) => {
        const dolu = frame >= i * 2.5 - 10;
        const nabiz = dolu ? 0.5 + 0.5 * Math.sin((frame - i * 3) / 3) : 0;
        return <div key={i} style={{height: 150, borderRadius: 75, border: `5px solid ${dolu ? renk.kirmizi : '#ffffff30'}`, background: dolu ? `${renk.kirmizi}${Math.round(40 + nabiz * 60).toString(16)}` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, boxShadow: dolu ? `0 0 ${20 + nabiz * 40}px ${renk.kirmizi}` : 'none', transform: `scale(${dolu ? 1 + 0.06 * nabiz : 0.9})`}}>
          {dolu ? '!' : i + 1}
        </div>;
      })}
    </div>
    {/* çakılan kasa grafiği */}
    <svg width={1080} height={420} viewBox="0 0 1080 420" style={{position: 'absolute', top: 1090, left: 0, opacity: 0.55}}>
      <path d="M 90 60 L 260 110 L 380 90 L 520 190 L 640 170 L 780 300 L 990 380" stroke={renk.kirmizi} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ciz} style={{filter: `drop-shadow(0 0 18px ${renk.kirmizi})`}} />
      {ciz > 0.97 && <path d="M 990 380 l -70 -6 M 990 380 l -26 -64" stroke={renk.kirmizi} strokeWidth={14} strokeLinecap="round" />}
    </svg>
    {/* kapak başlığı: ilk kareden görünür */}
    <div style={{position: 'absolute', top: 1110, left: 0, right: 0, textAlign: 'center', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1, textShadow: '0 8px 30px #000'}}>
      <div style={{fontSize: 92, letterSpacing: 4}}>BU KAFE ŞU AN</div>
      <div style={{fontSize: 118, color: renk.kirmizi, marginTop: 10, transform: `scale(${1 + 0.08 * interpolate(frame, [34, 38, 50], [0, 1, 0], cl)})`, textShadow: `0 0 40px ${renk.kirmizi}, 0 8px 30px #000`}}>PARA</div>
      <div style={{fontSize: 118, color: renk.kirmizi, textShadow: `0 0 40px ${renk.kirmizi}, 0 8px 30px #000`}}>KAYBEDİYOR</div>
    </div>
    <AbsoluteFill style={{background: renk.kirmizi, opacity: flas, mixBlendMode: 'screen'}} />
  </AbsoluteFill>;
};

const Masa: React.FC = () => {
  const frame = useCurrentFrame();
  const bekle = [134, 92, 167];
  const sure = (sn: number) => `${Math.floor(sn / 60)}:${String(sn % 60).padStart(2, '0')}`;
  const masa = (no: number, i: number) => {
    const g = sp(frame - i * 8, 30, 9, 240);
    const zil = Math.sin((frame - i * 5) / 2.2) * 18;
    return <div key={no} style={{width: 260, height: 400, borderRadius: 30, background: '#16161a', border: `4px solid ${renk.kirmizi}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${g})`, boxShadow: `0 0 50px ${renk.kirmizi}60`}}>
      <div style={{fontSize: 110, transform: `rotate(${zil}deg)`}}>🛎️</div>
      <div style={{fontSize: 40, fontWeight: 800}}>MASA {no}</div>
      {/* bekleme sayacı — temsilî, hızlandırılmış */}
      <div style={{fontSize: 24, letterSpacing: 2, opacity: 0.6}}>BEKLİYOR</div>
      <div style={{fontSize: 40, fontWeight: 800, color: renk.kirmizi, fontVariantNumeric: 'tabular-nums'}}>{sure(bekle[i] + Math.floor(frame * 4 / 30))}</div>
    </div>;
  };
  const garsonX = interpolate(Math.sin(frame / 7), [-1, 1], [120, 820]);
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff'}}>
    <div style={{marginTop: 360, display: 'flex', gap: 40}}>{[4, 7, 9].map(masa)}</div>
    <div style={{position: 'absolute', top: 860, left: garsonX, fontSize: 170, transform: `scaleX(${Math.cos(frame / 7) > 0 ? 1 : -1})`}}>🏃</div>
    <div style={{position: 'absolute', top: 1110, left: 0, right: 0, textAlign: 'center', fontSize: 64, fontWeight: 800, letterSpacing: 8, color: renk.kirmizi, opacity: interpolate(frame, [20, 28], [0, 1], cl)}}>AYNI ANDA</div>
  </AbsoluteFill>;
};

const Fis: React.FC = () => {
  const frame = useCurrentFrame();
  const satir = (m: string, i: number) => <div style={{height: 82, borderBottom: '2px dashed #bbb', fontSize: 46, fontStyle: 'italic', color: '#222', paddingTop: 20, opacity: interpolate(frame, [i * 6, i * 6 + 6], [0, 1], cl)}}>{m}</div>;
  // VO: "Masa 7'ye yazılan sipariş" (0-55) → "masa 4'e gitti" (~60): fiş masa 4'e uçar
  const ucus = sp(frame - 48, 30, 14, 110);
  const ok = interpolate(frame, [44, 62], [0, 1], cl);
  const masaKart = (no: number, x: number, yanlis: boolean) => <div style={{position: 'absolute', top: 1000, left: x, width: 340, height: 210, borderRadius: 30, background: '#16161a', border: `5px solid ${yanlis && frame > 62 ? renk.kirmizi : '#ffffff40'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: yanlis && frame > 62 ? `0 0 60px ${renk.kirmizi}` : 'none'}}>
    <div style={{fontSize: 56, fontWeight: 800}}>MASA {no}</div>
    <div style={{fontSize: 28, opacity: 0.7, marginTop: 6}}>{yanlis ? (frame > 62 ? 'bunu istemedi' : '') : '⏳ hâlâ bekliyor'}</div>
  </div>;
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi}}>
    {masaKart(7, 110, false)}
    {masaKart(4, 630, true)}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <path d="M 540 780 C 640 860, 760 900, 800 990" stroke={renk.kirmizi} strokeWidth={8} strokeDasharray="20 16" fill="none" opacity={ok} />
    </svg>
    <div style={{position: 'absolute', top: 290, width: 600, background: '#f6f2e8', padding: '36px 50px 40px', boxShadow: '0 40px 120px #000', transformOrigin: 'center', transform: `translate(${ucus * 300}px, ${ucus * 450}px) scale(${1 - ucus * 0.72}) rotate(${-4 + ucus * 14}deg)`}}>
      <div style={{fontSize: 36, fontWeight: 800, color: '#222', letterSpacing: 4}}>SİPARİŞ · MASA 7</div>
      {satir('2 latte', 0)}
      {satir('1 kahvaltı', 1)}
      {satir('1 kruvasan', 2)}
    </div>
    <Damga f={frame - 66} metin="YANLIŞ MASA" renkKod={renk.kirmizi} style={{top: 520}} />
  </AbsoluteFill>;
};

const Hesap: React.FC = () => {
  const frame = useCurrentFrame();
  const kisiler = ['🧑', '👩', '🧔', '👱'];
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff'}}>
    <div style={{marginTop: 300, width: 520, background: '#fff', color: '#111', padding: '36px 40px', boxShadow: '0 40px 120px #000', clipPath: 'polygon(0 0,100% 0,100% 96%,92% 100%,84% 96%,76% 100%,68% 96%,60% 100%,52% 96%,44% 100%,36% 96%,28% 100%,20% 96%,12% 100%,4% 96%,0 100%)', transform: `translateY(${(1 - sp(frame, 30, 14, 160)) * 300}px)`}}>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 4, textAlign: 'center'}}>HESAP · MASA 7</div>
      {['Latte ×2', 'Kafe Kahvaltı', 'Tereyağlı Kruvasan', 'Filtre Kahve'].map((u) => <div key={u} style={{fontSize: 32, padding: '14px 0', borderBottom: '1px dashed #999'}}>{u}</div>)}
      <div style={{fontSize: 34, fontWeight: 800, paddingTop: 18, paddingBottom: 30}}>TOPLAM</div>
    </div>
    <div style={{position: 'absolute', top: 980, display: 'flex', gap: 30}}>
      {kisiler.map((k, i) => {
        const g = sp(frame - 18 - i * 5, 30, 8, 260);
        return <div key={i} style={{position: 'relative', fontSize: 120, transform: `scale(${g})`}}>{k}
          <div style={{position: 'absolute', top: -30, right: -14, fontSize: 64, fontWeight: 800, color: renk.kirmizi}}>?</div>
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

const Duzen: React.FC = () => {
  const frame = useCurrentFrame();
  const vurus = 79; // VO "düzen" kelimesi: 4 + 75
  const g = sp(frame - vurus, 30, 7, 300);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, transform: sars(frame, vurus, vurus + 10, 40, 'd')}}>
    <div style={{fontSize: 78, color: '#fff', letterSpacing: 8, textAlign: 'center', opacity: interpolate(frame, [0, 8], [0, 1], cl), marginBottom: 60}}>
      SORUN <span style={{textDecoration: frame > 34 ? 'line-through' : 'none', textDecorationColor: renk.kirmizi, textDecorationThickness: 10}}>KALABALIK</span> DEĞİL.
    </div>
    <div style={{opacity: frame >= vurus ? 1 : 0, fontSize: 290, lineHeight: 1, color: renk.kirmizi, transform: `scale(${2.4 - 1.4 * g})`, textShadow: `0 0 80px ${renk.kirmizi}`}}>DÜZEN</div>
    {frame >= vurus && <Lazer y={1200} o={sp(frame - vurus, 30)} />}
  </AbsoluteFill>;
};

// ——— KafeOS ekranları (demo veri, etiketler koddan) ———
const UstBar: React.FC<{baslik: string; alt: string}> = ({baslik, alt}) => <div style={{padding: '90px 36px 24px', borderBottom: '1px solid #222', background: '#0f0f12'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 56}} />
    <div style={{fontSize: 24, letterSpacing: 4, opacity: 0.6}}>KAFEOS</div>
    <div style={{marginLeft: 'auto', fontSize: 18, letterSpacing: 2, padding: '4px 10px', border: '1px solid #444', borderRadius: 8, opacity: 0.6}}>DEMO VERİ</div>
  </div>
  <div style={{fontSize: 44, fontWeight: 800, marginTop: 14}}>{baslik}</div>
  <div style={{fontSize: 26, opacity: 0.6, marginTop: 4}}>{alt}</div>
</div>;

const NQr: React.FC = () => {
  const frame = useCurrentFrame();
  // 0-50: QR tarama (VO 'okutur' ~50), 50+: menü
  const tarama = frame < 50;
  const cizgi = interpolate(frame % 20, [0, 20], [120, 600]);
  const urunler = [['☕', 'Latte', 'Çift shot espresso ve kadifemsi süt'], ['🥐', 'Tereyağlı Kruvasan', 'Günlük, kat kat ve çıtır'], ['🍳', 'Kafe Kahvaltı', 'Yumurta, peynirler, zeytin ve sıcak ekmek']];
  const sepet = Math.min(3, Math.max(0, Math.floor((frame - 60) / 10)));
  const onay = frame >= 100;
  const garson = frame >= 128;
  return <>
    <Telefon>
      {tarama ? <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 480, height: 480, background: '#fff', padding: 30}}>
          <div style={{width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)'}}>
            {Array.from({length: 441}).map((_, i) => {const x = i % 21, y = Math.floor(i / 21); const kose = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const kd = kose ? ((x % 14 === 0 || x % 14 === 6 || y % 14 === 0 || y % 14 === 6) || ((x % 14) >= 2 && (x % 14) <= 4 && (y % 14) >= 2 && (y % 14) <= 4)) : random(`q${i}`) > 0.5; return <div key={i} style={{background: kd ? '#000' : '#fff'}} />;})}
          </div>
          <div style={{position: 'absolute', left: -20, right: -20, top: cizgi - 120, height: 6, background: renk.kirmizi, boxShadow: `0 0 30px ${renk.kirmizi}`}} />
        </div>
        <div style={{marginTop: 50, fontSize: 34, fontWeight: 800, letterSpacing: 4}}>MASA 7</div>
      </AbsoluteFill> : <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Masanız: 7" alt="Üyelik yok · telefon numarası yok" />
        <div style={{padding: '14px 30px'}}>
          {urunler.map(([e, ad, ac], i) => {
            const eklendi = sepet > i;
            return <div key={ad} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 0', borderBottom: '1px solid #222', opacity: sp(frame - 50 - i * 4, 30)}}>
              <div style={{fontSize: 64}}>{e}</div>
              <div style={{flex: 1}}><div style={{fontSize: 32, fontWeight: 800}}>{ad}</div><div style={{fontSize: 21, opacity: 0.55}}>{ac}</div></div>
              <div style={{width: 64, height: 64, borderRadius: 32, background: eklendi ? yesil : renk.kirmizi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, transform: `scale(${eklendi ? 1 + 0.25 * (1 - sp(frame - 60 - i * 10, 30, 8, 260)) : 1})`}}>{eklendi ? '✓' : '+'}</div>
            </div>;
          })}
          <div style={{marginTop: 26, height: 96, borderRadius: 24, background: onay ? yesil : renk.kirmizi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, transform: `scale(${onay ? 1 - 0.06 * (1 - sp(frame - 100, 30, 8, 300)) : 1})`}}>{onay ? 'Hazırlık sırasına alındı ✓' : `Siparişi Onayla (${sepet})`}</div>
          <div style={{display: 'flex', gap: 16, marginTop: 20}}>
            {['🛎️ Garson Çağır', '🧾 Hesap İste'].map((b, i) => <div key={b} style={{flex: 1, height: 84, borderRadius: 20, border: `3px solid ${i === 0 && garson ? yesil : '#333'}`, background: i === 0 && garson ? `${yesil}30` : '#16161a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800}}>{b}</div>)}
          </div>
          {garson && <div style={{marginTop: 18, padding: '18px 24px', borderRadius: 18, background: '#16161a', borderLeft: `6px solid ${yesil}`, fontSize: 26, opacity: sp(frame - 130, 30)}}>Garsonumuz masanıza geliyor.</div>}
        </div>
      </AbsoluteFill>}
    </Telefon>
    <Bolum no="01" metin="QR SİPARİŞ" />
  </>;
};

const NFis: React.FC = () => {
  const frame = useCurrentFrame();
  const fisler: [string, string, string, number][] = [['BAR', '2 × Latte', '☕', -300], ['MUTFAK', '1 × Kafe Kahvaltı', '🍳', 0], ['PASTANE', '1 × Tereyağlı Kruvasan', '🥐', 300]];
  return <AbsoluteFill style={{fontFamily: yaziTipi}}>
    <div style={{position: 'absolute', top: 320, left: 0, right: 0, textAlign: 'center', color: '#fff'}}>
      <div style={{display: 'inline-block', padding: '20px 40px', borderRadius: 20, background: '#16161a', border: `3px solid ${renk.kirmizi}`, fontSize: 40, fontWeight: 800, transform: `scale(${sp(frame, 30, 10, 200)})`}}>MASA 7 · 3 ürün</div>
    </div>
    {fisler.map(([ist, urun, e, dx], i) => {
      const g = sp(frame - [18, 27, 43][i], 30, 11, 170);
      return <div key={ist} style={{position: 'absolute', top: 560, left: 540 - 150 + dx * g, width: 300, background: '#f6f2e8', color: '#111', padding: '26px 22px 34px', boxShadow: '0 30px 80px #000', transform: `translateY(${(1 - g) * -180}px) rotate(${(i - 1) * 5 * g}deg)`, opacity: g, fontFamily: 'monospace'}}>
        <div style={{background: renk.kirmizi, color: '#fff', fontFamily: yaziTipi, fontWeight: 800, fontSize: 32, letterSpacing: 4, textAlign: 'center', padding: '8px 0'}}>{ist}</div>
        <div style={{fontSize: 22, marginTop: 14}}>MASA 7 · 14:03</div>
        <div style={{fontSize: 76, textAlign: 'center', margin: '14px 0'}}>{e}</div>
        <div style={{fontSize: 26, fontWeight: 800, fontFamily: yaziTipi}}>{urun}</div>
        <div style={{borderTop: '2px dashed #999', marginTop: 18}} />
      </div>;
    })}
    <Damga f={frame - 86} metin="DOĞRU İSTASYON" style={{top: 1130, left: 170}} />
    <Bolum no="04" metin="AYRI FİŞLER" />
  </AbsoluteFill>;
};

const NHesap: React.FC = () => {
  const frame = useCurrentFrame();
  const mod = frame < 30 ? 0 : 1;
  const kalemler = ['Latte ×2', 'Kafe Kahvaltı', 'Tereyağlı Kruvasan', 'Filtre Kahve'];
  const odemeler = [['Nakit', 64], ['Kart', 72], ['Yemek Kartı', 86]] as const;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Kasa · Masa 7" alt="Hesabı böl" />
        <div style={{padding: '20px 30px'}}>
          <div style={{display: 'flex', gap: 12}}>
            {['Ürün seçerek', 'Kişi başı'].map((m, i) => <div key={m} style={{flex: 1, padding: '16px 0', textAlign: 'center', borderRadius: 16, fontSize: 28, fontWeight: 800, background: mod === i ? renk.kirmizi : '#1d1d22', color: mod === i ? '#fff' : '#888'}}>{m}</div>)}
          </div>
          {mod === 0 ? kalemler.map((k, i) => {
            const sec = frame >= 8 + i * 7 && i < 2;
            return <div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 0', borderBottom: '1px solid #222', fontSize: 30}}>
              <div style={{width: 40, height: 40, borderRadius: 10, border: `3px solid ${sec ? yesil : '#555'}`, background: sec ? yesil : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26}}>{sec ? '✓' : ''}</div>{k}
            </div>;
          }) : <div style={{display: 'flex', justifyContent: 'center', gap: 22, margin: '40px 0 20px'}}>
            {['🧑', '👩', '🧔', '👱'].map((k, i) => <div key={i} style={{width: 120, height: 120, borderRadius: 60, background: '#1d1d22', border: `3px solid ${yesil}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, transform: `scale(${sp(frame - 30 - i * 4, 30, 9, 240)})`}}>{k}</div>)}
          </div>}
          {mod === 1 && <div style={{textAlign: 'center', fontSize: 30, opacity: 0.7}}>4 pay · kişi başı</div>}
          <div style={{marginTop: 30, fontSize: 24, opacity: 0.6}}>Ödeme</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10}}>
            {odemeler.map(([o, f]) => {
              const g = sp(frame - f, 30, 12, 200);
              return <div key={o} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 26px', borderRadius: 18, background: '#16161a', border: `2px solid ${g > 0.5 ? yesil : '#222'}`, fontSize: 30, fontWeight: 800, opacity: 0.3 + 0.7 * g, transform: `translateX(${(1 - g) * 80}px)`}}>
                <span>{o}</span><span style={{color: yesil, fontSize: 26}}>{g > 0.5 ? '✓ alındı' : ''}</span>
              </div>;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="05" metin="HESAP BÖL" />
  </>;
};

const NNet: React.FC = () => {
  const frame = useCurrentFrame();
  const geldi = frame >= 56;
  const g = sp(frame - 74, 30, 10, 220);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Siparişiniz" alt="Masa 7" />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60}}>
          <div style={{position: 'relative', fontSize: 170, opacity: geldi ? 1 : 0.5}}>📶
            {!geldi && <div style={{position: 'absolute', left: -10, right: -10, top: '50%', height: 14, background: renk.kirmizi, transform: 'rotate(-35deg)', boxShadow: `0 0 20px ${renk.kirmizi}`}} />}
          </div>
          <div style={{margin: '40px 34px 0', padding: 30, borderRadius: 22, background: '#16161a', border: `2px solid ${geldi ? yesil : renk.kirmizi}`, fontSize: 27, lineHeight: 1.4}}>
            {geldi ? <><b style={{color: yesil, fontSize: 32}}>İletildi ✓</b><br />Hazırlık sırasına alındı</> : 'Bağlantınız şu anda yok. Siparişiniz telefonunuzda kaydedildi ve bağlantı gelir gelmez otomatik iletilecek.'}
          </div>
          <div style={{marginTop: 50, display: 'flex', gap: 20, fontSize: 30, fontWeight: 800}}>
            <div style={{padding: '18px 28px', borderRadius: 40, background: '#1d1d22'}}>Sipariş: <span style={{color: geldi ? yesil : '#fff'}}>1</span></div>
            {frame >= 74 && <div style={{padding: '18px 28px', borderRadius: 40, background: `${yesil}30`, color: yesil, transform: `scale(${g})`}}>Çift kayıt: 0</div>}
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="06" metin="İNTERNET YOKSA" />
  </>;
};

// Personel çağrı kartı — OperationsConsole.tsx service-request-card: durum + süre, masa adı, not, "<ad> ilgileniyor", İlgileniyorum → Tamamlandı
const CagriKart: React.FC<{durum: string; sure: string; masa: string; not: string; sahip?: string; dugme: string; vurgu?: boolean; basti?: number}> = ({durum, sure, masa, not, sahip, dugme, vurgu, basti = 0}) => <div style={{borderRadius: 26, background: '#16161a', border: `3px solid ${vurgu ? (sahip ? yesil : renk.kirmizi) : '#2a2a30'}`, padding: '24px 28px', boxShadow: vurgu ? `0 0 50px ${sahip ? yesil : renk.kirmizi}50` : 'none'}}>
  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 800, color: sahip ? yesil : vurgu ? renk.kirmizi : '#aaa', letterSpacing: 1}}><span>{durum}</span><span style={{opacity: 0.8}}>{sure}</span></div>
  <div style={{fontSize: 58, fontWeight: 800, marginTop: 8}}>{masa}</div>
  <div style={{fontSize: 28, opacity: 0.75, marginTop: 4}}>{not}</div>
  {sahip && <div style={{fontSize: 26, color: yesil, marginTop: 10, fontWeight: 800}}>{sahip} ilgileniyor</div>}
  <div style={{marginTop: 18, height: 76, borderRadius: 18, background: sahip ? '#2a2a30' : renk.kirmizi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, transform: `scale(${1 - 0.08 * basti})`}}>{dugme}</div>
</div>;

const NGarson: React.FC = () => {
  const frame = useCurrentFrame();
  // VO: "Çağrı garsonun ekranına (2-41) masa adıyla düşer (42-77), kimin ilgilendiği görünür (78+)"
  const dus = sp(frame - 40, 30, 10, 180);
  const tik = 84;
  const alindi = frame >= tik;
  const basti = interpolate(frame, [tik - 4, tik, tik + 4], [0, 1, 0], cl);
  const parmak = interpolate(frame, [62, tik], [1, 0], cl);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Garson Sipariş" alt="Personel ekranı · çağrılar" />
        <div style={{padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 22}}>
          <div style={{transform: `translateY(${(1 - dus) * -520}px)`, opacity: frame >= 40 ? 1 : 0}}>
            <CagriKart durum={alindi ? 'İşlem görüyor' : 'Garson çağrısı'} sure="şimdi" masa="Masa 7" not="Masaya uğra" sahip={alindi ? 'Ayşe' : undefined} dugme={alindi ? 'Tamamlandı' : 'İlgileniyorum'} vurgu basti={basti} />
          </div>
          <div style={{transform: `translateY(${(1 - dus) * -60}px)`}}>
            <CagriKart durum="Hesap çağrısı" sure="2 dk" masa="Masa 3" not="Hesabı masaya götür" dugme="İlgileniyorum" />
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 60 && frame < tik + 14 && <div style={{position: 'absolute', left: 560 + parmak * 120, top: 790 + parmak * 220, fontSize: 120, zIndex: 12, filter: 'drop-shadow(0 10px 20px #000)'}}>👆</div>}
    <Bolum no="02" metin="GARSON EKRANI" />
  </>;
};

// Alerjen filtresi — CustomerMenu.tsx: "Alerjen filtresi", seçilen alerjeni içeren ürün listeden çıkar; demo ürün alerjenleri lib/database.ts
const NAlerjen: React.FC = () => {
  const frame = useCurrentFrame();
  const tik = 50; // VO "işaretler" ~51
  const secili = frame >= tik;
  const cik = interpolate(frame, [78, 104], [0, 1], cl); // VO "glutenli ürünler menüden çıkar"
  const urunler: [string, string, string, boolean][] = [['☕', 'Latte', 'Süt', false], ['🍳', 'Kafe Kahvaltı', 'Yumurta · Gluten · Süt', true], ['♨️', 'Filtre Kahve', '—', false], ['🥐', 'Tereyağlı Kruvasan', 'Gluten · Süt', true]];
  const parmak = interpolate(frame, [26, tik], [1, 0], cl);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Masanız: 7" alt="Menü" />
        <div style={{padding: '20px 30px'}}>
          <div style={{borderRadius: 20, background: '#16161a', padding: '20px 24px', border: `2px solid ${secili ? renk.kirmizi : '#2a2a30'}`}}>
            <div style={{fontSize: 30, fontWeight: 800}}>Alerjen filtresi{secili ? ' · 1' : ''}</div>
            <div style={{display: 'flex', gap: 12, marginTop: 16}}>
              {['Gluten', 'Süt', 'Yumurta'].map((a, i) => {
                const aktif = i === 0 && secili;
                return <div key={a} style={{padding: '12px 22px', borderRadius: 40, fontSize: 26, fontWeight: 800, background: aktif ? renk.kirmizi : '#25252b', color: aktif ? '#fff' : '#bbb', transform: `scale(${aktif ? 1 + 0.2 * (1 - sp(frame - tik, 30, 8, 260)) : 1})`}}>{aktif ? `${a} gizli` : a}</div>;
              })}
            </div>
          </div>
          {urunler.map(([e, ad, alerjen, glutenli]) => {
            const k = glutenli ? cik : 0;
            const kirmizi = glutenli && frame >= 66;
            return <div key={ad} style={{display: 'flex', alignItems: 'center', gap: 20, height: 130 * (1 - k), overflow: 'hidden', borderBottom: `1px solid ${k > 0.9 ? 'transparent' : '#222'}`, opacity: 1 - k, transform: `translateX(${k * -500}px)`}}>
              <div style={{fontSize: 60}}>{e}</div>
              <div style={{flex: 1}}><div style={{fontSize: 32, fontWeight: 800, color: kirmizi ? renk.kirmizi : '#fff'}}>{ad}</div><div style={{fontSize: 22, opacity: 0.6}}>Alerjen: {alerjen}</div></div>
            </div>;
          })}
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 20 && frame < tik + 14 && <div style={{position: 'absolute', left: 250 + parmak * 140, top: 640 + parmak * 260, fontSize: 120, zIndex: 12, filter: 'drop-shadow(0 10px 20px #000)'}}>👆</div>}
    <Bolum no="03" metin="ALERJEN FİLTRESİ" />
  </>;
};

// Özet: "Kâğıt yok, koşturma yok, karışıklık yok."
const Ozet: React.FC = () => {
  const frame = useCurrentFrame();
  const satirlar: [string, number, number][] = [['KÂĞIT', 2, 14], ['KOŞTURMA', 24, 34], ['KARIŞIKLIK', 40, 59]];
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, gap: 40}}>
    {satirlar.map(([k, gel, yok]) => {
      const g = sp(frame - gel, 30, 10, 220);
      const y = frame >= yok;
      return <div key={k} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: g, transform: `translateX(${(1 - g) * -200}px)`}}>
        <div style={{fontSize: 110, color: y ? '#ffffff70' : '#fff', textDecoration: y ? 'line-through' : 'none', textDecorationColor: renk.kirmizi, textDecorationThickness: 12}}>{k}</div>
        {y && <div style={{fontSize: 80, color: '#fff', background: renk.kirmizi, padding: '4px 22px', transform: `scale(${2 - sp(frame - yok, 30, 8, 300)}) rotate(-6deg)`}}>YOK</div>}
      </div>;
    })}
    <div style={{marginTop: 30, fontSize: 44, letterSpacing: 8, color: yesil, opacity: interpolate(frame, [62, 70], [0, 1], cl)}}>KAFEOS İLE</div>
  </AbsoluteFill>;
};

const Dm: React.FC = () => {
  const frame = useCurrentFrame();
  const yazi = 'KAFE';
  const n = Math.min(yazi.length, Math.max(0, Math.floor((frame - 4) / 3)));
  const gonder = frame >= 20;
  const b = sp(frame - 20, 30, 11, 220);
  return <Telefon>
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '90px 30px 26px', borderBottom: '1px solid #222'}}>
        <div style={{width: 80, height: 80, borderRadius: 40, background: '#000', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}><Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 70}} /></div>
        <div><div style={{fontSize: 34, fontWeight: 800}}>nexusstudiocs</div><div style={{fontSize: 24, opacity: 0.6}}>Nexus Studio</div></div>
      </div>
      <div style={{position: 'absolute', top: 340, left: 40, right: 40, textAlign: 'center', fontSize: 34, opacity: 0.55, lineHeight: 1.4}}>KafeOS demosu için<br /><b style={{color: '#fff', opacity: 1, fontSize: 64}}>KAFE</b><br />yazın.</div>
      {gonder && <div style={{position: 'absolute', right: 30, bottom: 200, background: 'linear-gradient(135deg, #C20D38, #941F38)', borderRadius: 40, padding: '24px 40px', fontSize: 48, fontWeight: 800, transform: `scale(${b})`, transformOrigin: 'bottom right'}}>KAFE</div>}
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
      <div style={{fontSize: 40, fontWeight: 800, letterSpacing: 6, opacity: 0.8}}>KAFEOS · NEXUS STUDIO</div>
      <div style={{fontSize: 44, fontWeight: 800, letterSpacing: 2, marginTop: 14}}>Kamera da tutarız. Kod da yazarız.</div>
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

const sira: [number, React.FC][] = [[sahne.kanca, Kanca], [sahne.masa, Masa], [sahne.fis, Fis], [sahne.hesap, Hesap], [sahne.duzen, Duzen], [sahne.nQr, NQr], [sahne.nGarson, NGarson], [sahne.nAlerjen, NAlerjen], [sahne.nFis, NFis], [sahne.nHesap, NHesap], [sahne.nNet, NNet], [sahne.ozet, Ozet], [sahne.dm, Dm], [sahne.son, Son]];

const Ses: React.FC<{ad: string; at: number; v?: number}> = ({ad, at, v = 0.5}) => <Sequence from={at}><Audio src={sfxYolu(ad)} volume={v} /></Sequence>;

export const Reels05: React.FC = () => {
  const vurus = sahne.duzen + 79;
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    <Zemin />
    {sira.map(([bas, Bil], i) => {
      const bitis = i + 1 < sira.length ? sira[i + 1][0] : REELS05_SURE;
      // ilk sahnede giriş flaşı yok: ilk kare (kapak) temiz kalsın
      return <Sequence key={i} from={bas} durationInFrames={bitis - bas}>{i === 0 ? <Bil /> : <Kesme><Bil /></Kesme>}</Sequence>;
    })}
    <Sequence durationInFrames={sahne.son}><Vizor /></Sequence>
    <Altyazi />
    <Gren />
    {seslendirme.map((v) => <Sequence key={v.dosya} from={v.at}><Audio src={staticFile(`${R}${v.dosya}.wav`)} volume={1} /></Sequence>)}
    {/* ses tasarımı: sorun kısmı saat + nabız gerilimi, KafeOS kısmı ritimli ve ferah */}
    <Sequence durationInFrames={sahne.duzen}><Audio src={sfxYolu('ortam--11325622-clock-ticking-sound-effect')} volume={0.35} loop /></Sequence>
    <Sequence from={sahne.masa} durationInFrames={sahne.nQr - sahne.masa}><Audio src={sfxYolu('dramatik--gerilim-droneu')} volume={0.22} loop /></Sequence>
    <Sequence from={sahne.masa} durationInFrames={sahne.duzen - sahne.masa}><Audio src={sfxYolu('dramatik--nabiz-hizli')} volume={0.25} loop /></Sequence>
    {Array.from({length: Math.floor((sahne.son - sahne.nQr) / 15)}).map((_, i) => <Ses key={`b${i}`} ad="vurgu--vurus-orta" at={sahne.nQr + i * 15} v={i % 2 === 0 ? 0.14 : 0.07} />)}
    <Sequence durationInFrames={sahne.masa}><Audio src={sfxYolu('acilis--hook')} volume={0.4} /></Sequence>
    <Ses ad="vurgu--sub-dusus" at={34} v={0.55} />
    <Ses ad="dijital--glitch-kisa" at={36} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.masa} />
    {[0, 8, 16].map((d) => <Ses key={d} ad="bildirim--ding" at={sahne.masa + d} v={0.35} />)}
    <Ses ad="gecis--kagit-swipe" at={sahne.fis} v={0.5} />
    <Ses ad="metin--yazi-yazma" at={sahne.fis + 2} v={0.3} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.fis + 48} v={0.4} />
    <Ses ad="bildirim--hata" at={sahne.fis + 66} v={0.45} />
    <Ses ad="gecis--kagit-yirtma" at={sahne.hesap} v={0.4} />
    {[0, 1, 2, 3].map((i) => <Ses key={i} ad="metin--pop" at={sahne.hesap + 18 + i * 5} v={0.3} />)}
    <Ses ad="gecis--whoosh-sert" at={sahne.duzen} v={0.5} />
    <Ses ad="gecis--tape-stop" at={vurus - 14} v={0.35} />
    <Ses ad="vurgu--trailer-boom" at={vurus} v={0.45} />
    <Ses ad="dramatik--yukselen-kisa" at={sahne.nQr - 34} v={0.35} />
    <Ses ad="gecis--whoosh-uzun" at={sahne.nQr - 6} v={0.5} />
    <Ses ad="dijital--robot-bip" at={sahne.nQr + 40} v={0.35} />
    {[0, 1, 2].map((i) => <Ses key={i} ad="metin--pop-yumusak" at={sahne.nQr + 60 + i * 10} v={0.4} />)}
    <Ses ad="bildirim--basari" at={sahne.nQr + 100} v={0.4} />
    <Ses ad="bildirim--ding" at={sahne.nQr + 128} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nGarson} />
    <Ses ad="bildirim--mesaj" at={sahne.nGarson + 44} v={0.5} />
    <Ses ad="metin--klik" at={sahne.nGarson + 84} v={0.5} />
    <Ses ad="bildirim--basari" at={sahne.nGarson + 88} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nAlerjen} />
    <Ses ad="metin--klik" at={sahne.nAlerjen + 50} v={0.5} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nAlerjen + 78} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nFis} />
    {[18, 27, 43].map((f) => <Ses key={f} ad="gecis--kagit-swipe" at={sahne.nFis + f} v={0.35} />)}
    <Ses ad="bildirim--dragon-studio-correct" at={sahne.nFis + 86} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nHesap} />
    <Ses ad="metin--klik" at={sahne.nHesap + 8} v={0.4} /><Ses ad="metin--klik" at={sahne.nHesap + 15} v={0.4} /><Ses ad="metin--klik" at={sahne.nHesap + 30} v={0.4} />
    {[64, 72, 86].map((f) => <Ses key={f} ad="bildirim--ding" at={sahne.nHesap + f} v={0.35} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.nNet} />
    <Ses ad="dijital--sinyal-kaybi" at={sahne.nNet + 4} v={0.3} />
    <Ses ad="bildirim--basari" at={sahne.nNet + 56} v={0.45} />
    <Ses ad="metin--pop" at={sahne.nNet + 74} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.ozet} />
    {[14, 34, 59].map((f) => <Ses key={f} ad="vurgu--vurus-orta" at={sahne.ozet + f} v={0.45} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.dm} />
    {[0, 1, 2, 3].map((i) => <Ses key={i} ad="metin--tik-daktilo" at={sahne.dm + 4 + i * 3} v={0.5} />)}
    <Ses ad="bildirim--mesaj" at={sahne.dm + 20} v={0.6} />
    <Ses ad="vurgu--trailer-boom" at={sahne.son} v={0.5} />
  </AbsoluteFill>;
};
