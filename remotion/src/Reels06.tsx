import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

// Reels 06: "Şu araçtan para kazandığını sanıyorsun" — Nexus Car GALERİCİ sürümü, Reels05 kalıbı, yalnız demo veri.
// Ekrandaki her özellik ve etiket koddan doğrulandı (Nexus Car satis-hazir):
// galeri/AlisAkisi.tsx (adımlar, Özmal/Konsinye/Ortaklı, "Yalnız kayıt içindir; resmi sorgu yapmaz."), is-kurallari/evrak.ts (evrak maddeleri),
// is-kurallari/parcalar.ts (parça adları, durum adları ve renkleri, "Boyalı: …" özeti), is-kurallari/galeri.ts (maliyet = alış + masraf, tahmini kâr = hedef − maliyet),
// araclar/ortak.tsx (masraf kalemleri), galeri/Stok.tsx (Taze/Bekliyor/Uzun süredir, "İndirim / ilan düşünün"), galeriRapor.ts (bağlı sermaye, ortalama stok yaşı),
// galeri/Kaparo.tsx + hatirlatma.ts ("Kapora süresi", "Kapora için N gün kaldı."), talepEslesme.ts + Talepler.tsx, galeriIlan.ts + Ilan.tsx (Kopyala/Paylaş/Vitrin kartı PDF),
// db/demoVeri.ts (34 DEM 101-103 araçlar, alış/hedef fiyatlar). Resmi tramer/sahibinden/e-Fatura entegrasyonu YOK → videoda iddia edilmez.
const R = 'reels/r06/';
const sahne = {kanca: 0, masraf: 80, stok: 226, kapora: 324, duzen: 420, nAlis: 520, nParca: 688, nKar: 840, nStok: 978, nKapora: 1096, nTalep: 1180, nIlan: 1296, ozet: 1422, dm: 1524, son: 1624};
export const REELS06_SURE = 1720;

type Obek = [number, string, string[]?];
type Vo = {dosya: string; at: number; sure: number; alt: Obek[]};
const seslendirme: Vo[] = [
  {dosya: 'vo1', at: 6, sure: 70, alt: []}, // kapak başlığı ekranda
  {dosya: 'vo2', at: 84, sure: 138, alt: [[0, 'NOTER'], [16, 'BOYA'], [29, 'LASTİK'], [49, 'İLAN'], [63, 'NAKLİYE'], [92, 'HEPSİ KAZANCINDAN GİTTİ', ['KAZANCINDAN', 'GİTTİ']]]},
  {dosya: 'vo3', at: 230, sure: 90, alt: [[1, '45 GÜNDÜR', ['45']], [21, 'SATILMAYAN ARAÇ'], [54, 'SERMAYENİ BAĞLIYOR', ['BAĞLIYOR']]]},
  {dosya: 'vo4', at: 328, sure: 88, alt: [[1, 'KAPORANIN SÜRESİ DOLDU', ['DOLDU']], [38, 'DEFTERE BAKAN YOK', ['YOK']]]},
  {dosya: 'vo5', at: 426, sure: 59, alt: []}, // metin ekranda
  {dosya: 'vo6', at: 526, sure: 157, alt: [[0, "NEXUS CAR'DA", ['NEXUS', "CAR'DA"]], [22, 'ALIŞ TEK AKIŞTA'], [70, 'SAHİPLİK EKSPERTİZ'], [112, 'HASAR KAYDI VE EVRAK', ['EVRAK']]]},
  {dosya: 'vo7', at: 692, sure: 143, alt: [[0, 'PARÇA HARİTASINDA'], [29, 'ORİJİNAL BOYALI'], [58, 'VE DEĞİŞEN', ['DEĞİŞEN']], [88, 'TEK DOKUNUŞLA'], [110, 'İŞARETLENİR', ['İŞARETLENİR']]]},
  {dosya: 'vo8', at: 844, sure: 129, alt: [[1, 'HER MASRAF'], [15, 'MALİYETİN ÜSTÜNE EKLENİR'], [76, 'GERÇEK KÂRI', ['GERÇEK']], [86, 'ANINDA GÖRÜRSÜN']]},
  {dosya: 'vo9', at: 982, sure: 110, alt: [[0, 'BEKLEYEN ARAÇ'], [20, 'İŞARETLENİR', ['İŞARETLENİR']], [63, 'BAĞLI SERMAYE', ['SERMAYE']], [79, 'HEP ÖNÜNDE']]},
  {dosya: 'vo10', at: 1100, sure: 74, alt: [[1, 'KAPORA SÜRESİ YAKLAŞINCA'], [34, 'UYGULAMA HATIRLATIR', ['HATIRLATIR']]]},
  {dosya: 'vo11', at: 1184, sure: 108, alt: [[0, 'MÜŞTERİNİN ARADIĞI ARAÇ'], [37, 'STOKTA VARSA'], [58, 'TALEBİN YANINDA GÖRÜNÜR', ['GÖRÜNÜR']]]},
  {dosya: 'vo12', at: 1300, sure: 118, alt: [[0, 'İLAN METNİ'], [15, 'TEK TUŞLA HAZIR', ['HAZIR']], [81, 'KOPYALA PAYLAŞ', ['KOPYALA', 'PAYLAŞ']]]},
  {dosya: 'voO', at: 1426, sure: 92, alt: []}, // kelimeler ekranda
  {dosya: 'vo13', at: 1530, sure: 87, alt: [[2, "DM'DEN GALERİ YAZIN", ['GALERİ']], [35, 'SİSTEMİ SİZE GÖSTERELİM']]},
];

const sp = (f: number, fps: number, d = 12, s = 160) => spring({frame: Math.max(0, f), fps, config: {damping: d, stiffness: s}});
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const yesil = '#2DBE60';
const sari = '#F4C430';
const turuncu = '#F57C00';
const tl = (n: number) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₺`;

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

const Gren: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', zIndex: 30}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
      <filter id="gren"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} /></filter>
      <rect width="100%" height="100%" filter="url(#gren)" />
    </svg>
    <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${(frame / REELS06_SURE) * 100}%`, background: renk.kirmizi, boxShadow: `0 0 16px ${renk.kirmizi}`}} />
  </AbsoluteFill>;
};

const Zemin: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(frame / 40) * 12}% 30%, ${renk.bordo}90, transparent 55%), radial-gradient(circle at 50% 110%, ${renk.kirmizi}40, transparent 50%), ${renk.siyah}`}} />
    <AbsoluteFill style={{opacity: 0.09, backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 90px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 90px)'}} />
  </AbsoluteFill>;
};

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
    <div style={{position: 'absolute', right: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFF88'}}>GALERİ · STOK</div>
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
  return <div style={{position: 'absolute', fontFamily: yaziTipi, fontWeight: 800, fontSize: 70, color: renkKod, border: `8px solid ${renkKod}`, padding: '10px 34px', letterSpacing: 6, transform: `scale(${2.2 - 1.2 * g}) rotate(-8deg)`, opacity: g, background: '#09090Bcc', whiteSpace: 'nowrap', ...style}}>{metin}</div>;
};

const sars = (frame: number, bas: number, bit: number, guc: number, tohum: string) => frame >= bas && frame < bit ? `translate(${(random(`${tohum}x${frame}`) - 0.5) * guc}px, ${(random(`${tohum}y${frame}`) - 0.5) * guc}px)` : undefined;

const Parmak: React.FC<{x: number; y: number}> = ({x, y}) => <div style={{position: 'absolute', left: x, top: y, fontSize: 120, zIndex: 12, filter: 'drop-shadow(0 10px 20px #000)'}}>👆</div>;

// Yan profil araç silüeti (kodla çizilen temsilî şekil)
const AracSiluet: React.FC<{w: number; renkKod?: string; ciz?: number; style?: React.CSSProperties}> = ({w, renkKod = renk.kirmizi, ciz = 1, style}) => <svg width={w} height={w * 0.36} viewBox="0 0 800 290" style={style}>
  <path d="M 50 215 L 52 168 Q 62 140 140 128 L 250 116 Q 305 58 405 52 L 520 52 Q 592 58 655 116 L 724 130 Q 762 142 764 178 L 764 215 Z" stroke={renkKod} strokeWidth={10} fill={`${renkKod}18`} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ciz} style={{filter: `drop-shadow(0 0 16px ${renkKod})`}} />
  <path d="M 278 118 Q 326 76 405 72 L 512 72 Q 566 78 612 118 Z" stroke={renkKod} strokeWidth={6} fill="#ffffff10" opacity={ciz} />
  <line x1={445} y1={74} x2={445} y2={118} stroke={renkKod} strokeWidth={6} opacity={ciz} />
  {[190, 615].map((x) => <g key={x} opacity={ciz}><circle cx={x} cy={222} r={50} fill="#09090B" stroke={renkKod} strokeWidth={10} /><circle cx={x} cy={222} r={18} fill={renkKod} /></g>)}
</svg>;

// ——— Sorun sahneleri ———
// KANCA: ilk karede araç + fiyat kartı + kapak başlığı; kâr rakamı yeşilden kırmızı soru işaretine çakılır.
const Kanca: React.FC = () => {
  const frame = useCurrentFrame();
  const vurus = 40; // VO "kazandığını" ~ 6+24
  const kirik = frame >= vurus;
  const flas = interpolate(frame, [vurus, vurus + 4, vurus + 14], [0, 0.55, 0], cl);
  const satir = (et: string, deger: string) => <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 40, padding: '12px 0', borderBottom: '1px solid #ffffff20'}}><span style={{opacity: 0.65}}>{et}</span><b>{deger}</b></div>;
  return <AbsoluteFill style={{fontFamily: yaziTipi, color: '#fff', transform: sars(frame, vurus, vurus + 12, 34, 'k')}}>
    <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><AracSiluet w={760} ciz={interpolate(frame, [0, 30], [0.55, 1], cl)} /></div>
    <div style={{position: 'absolute', top: 540, left: 150, right: 150, padding: '26px 40px', borderRadius: 30, background: '#16161aee', border: `3px solid ${kirik ? renk.kirmizi : '#ffffff30'}`, boxShadow: kirik ? `0 0 60px ${renk.kirmizi}70` : '0 30px 80px #000'}}>
      <div style={{fontSize: 30, letterSpacing: 4, opacity: 0.7}}>VW PASSAT 1.6 TDI · 2019</div>
      {satir('Alış', tl(780000))}
      {satir('Satış', tl(899000))}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16}}>
        <span style={{fontSize: 40, opacity: 0.65}}>Kâr</span>
        <b style={{fontSize: 74, color: kirik ? renk.kirmizi : yesil, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 30px ${kirik ? renk.kirmizi : yesil}`}}>{kirik ? '+119.000 ₺ ?' : '+119.000 ₺'}</b>
      </div>
    </div>
    <div style={{position: 'absolute', top: 1010, left: 0, right: 0, textAlign: 'center', fontWeight: 800, lineHeight: 1, textShadow: '0 8px 30px #000'}}>
      <div style={{fontSize: 84, letterSpacing: 4}}>ŞU ARAÇTAN PARA</div>
      <div style={{fontSize: 124, color: renk.kirmizi, marginTop: 12, transform: `scale(${1 + 0.08 * interpolate(frame, [vurus, vurus + 4, vurus + 16], [0, 1, 0], cl)})`, textShadow: `0 0 40px ${renk.kirmizi}, 0 8px 30px #000`}}>KAZANDIĞINI</div>
      <div style={{fontSize: 124, color: renk.kirmizi, textShadow: `0 0 40px ${renk.kirmizi}, 0 8px 30px #000`}}>SANIYORSUN</div>
    </div>
    <AbsoluteFill style={{background: renk.kirmizi, opacity: flas, mixBlendMode: 'screen'}} />
  </AbsoluteFill>;
};

// Masraflar (araclar/ortak.tsx etiketleri) fişe düşer, kâr sayacı erir.
const masraflar: [string, number, number][] = [['Noter', 4500, 4], ['Kaporta / boya', 18000, 20], ['Lastik', 12000, 33], ['İlan', 3000, 53], ['Nakliye', 6500, 67]];
const Masraf: React.FC = () => {
  const frame = useCurrentFrame();
  const dusen = masraflar.reduce((t, [, tutar, f]) => t + tutar * interpolate(frame, [f, f + 10], [0, 1], cl), 0);
  const kar = 119000 - dusen;
  const son = frame >= 96;
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, transform: sars(frame, 96, 106, 26, 'm')}}>
    <div style={{position: 'absolute', top: 280, width: 640, background: '#f6f2e8', padding: '30px 44px 40px', boxShadow: '0 40px 120px #000', transform: `rotate(-2deg) translateY(${(1 - sp(frame, 30, 14, 160)) * 300}px)`}}>
      <div style={{fontSize: 32, fontWeight: 800, color: '#222', letterSpacing: 4}}>MASRAFLAR · PASSAT</div>
      {masraflar.map(([ad, tutar, f]) => {
        const g = sp(frame - f, 30, 9, 240);
        return <div key={ad} style={{display: 'flex', justifyContent: 'space-between', height: 84, alignItems: 'center', borderBottom: '2px dashed #bbb', fontSize: 40, color: '#222', fontStyle: 'italic', opacity: g, transform: `translateX(${(1 - g) * -120}px)`}}>
          <span>{ad}</span><b style={{color: renk.kirmizi, fontStyle: 'normal'}}>−{tl(tutar)}</b>
        </div>;
      })}
    </div>
    <div style={{position: 'absolute', top: 1000, left: 150, right: 150, textAlign: 'center', padding: '24px 0 30px', borderRadius: 30, background: '#16161aee', border: `3px solid ${son ? renk.kirmizi : '#ffffff30'}`, color: '#fff'}}>
      <div style={{fontSize: 32, letterSpacing: 6, opacity: 0.7}}>SANDIĞIN KÂR <span style={{textDecoration: 'line-through', textDecorationColor: renk.kirmizi, textDecorationThickness: 6}}>119.000 ₺</span></div>
      <div style={{fontSize: 130, fontWeight: 800, lineHeight: 1.1, color: son ? renk.kirmizi : '#fff', fontVariantNumeric: 'tabular-nums', textShadow: son ? `0 0 40px ${renk.kirmizi}` : 'none'}}>{tl(kar)}</div>
    </div>
  </AbsoluteFill>;
};

// Stok bekleme günü sayacı; sermaye kilitli.
const StokSorun: React.FC = () => {
  const frame = useCurrentFrame();
  const gun = Math.round(interpolate(frame, [4, 44], [1, 45], cl));
  const toz = interpolate(frame, [4, 60], [0, 0.6], cl);
  const kilit = sp(frame - 58, 30, 8, 260);
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff'}}>
    <div style={{position: 'absolute', top: 280, width: 420, borderRadius: 30, overflow: 'hidden', background: '#f6f2e8', boxShadow: '0 40px 120px #000', textAlign: 'center', transform: `rotate(${Math.sin(frame / 2) * (frame < 44 ? 2 : 0)}deg)`}}>
      <div style={{background: renk.kirmizi, fontSize: 36, fontWeight: 800, letterSpacing: 6, padding: '14px 0'}}>STOKTA</div>
      <div style={{fontSize: 230, fontWeight: 800, lineHeight: 1.05, color: gun >= 45 ? renk.kirmizi : '#222', fontVariantNumeric: 'tabular-nums'}}>{gun}</div>
      <div style={{fontSize: 40, fontWeight: 800, color: '#222', letterSpacing: 8, paddingBottom: 20}}>GÜN</div>
    </div>
    <div style={{position: 'absolute', top: 760, filter: `grayscale(${toz}) brightness(${1 - toz * 0.5})`}}><AracSiluet w={700} renkKod={frame >= 44 ? renk.kirmizi : '#bbbbbb'} /></div>
    {frame >= 44 && <div style={{position: 'absolute', top: 735, right: 170, padding: '10px 22px', borderRadius: 40, background: renk.kirmizi, fontSize: 32, fontWeight: 800, transform: `scale(${sp(frame - 44, 30, 8, 260)})`}}>Uzun süredir</div>}
    <div style={{position: 'absolute', top: 1060, display: 'flex', alignItems: 'center', gap: 24, opacity: kilit, transform: `scale(${1.4 - 0.4 * kilit})`}}>
      <div style={{fontSize: 100}}>🔒</div>
      <div><div style={{fontSize: 34, letterSpacing: 4, opacity: 0.7}}>BAĞLI SERMAYE</div><div style={{fontSize: 84, fontWeight: 800, color: renk.kirmizi}}>{tl(520000)}</div></div>
    </div>
  </AbsoluteFill>;
};

// Defterde kaybolan kapora
const KaporaSorun: React.FC = () => {
  const frame = useCurrentFrame();
  const satir = (m: string, i: number, ustu = false) => <div style={{height: 96, borderBottom: '2px solid #9ec3e6', fontSize: 40, fontStyle: 'italic', color: '#1d2a6b', paddingTop: 40, whiteSpace: 'nowrap', overflow: 'hidden', opacity: interpolate(frame, [i * 5, i * 5 + 6], [0, 1], cl), textDecoration: ustu ? 'line-through' : 'none'}}>{m}</div>;
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, transform: sars(frame, 27, 37, 26, 'kp')}}>
    <div style={{position: 'absolute', top: 290, width: 680, height: 820, background: '#fdfbf3', padding: '40px 50px 40px 90px', boxShadow: '0 40px 120px #000', transform: 'rotate(2deg)', borderLeft: `6px solid ${renk.kirmizi}80`}}>
      <div style={{fontSize: 36, fontWeight: 800, color: '#222', letterSpacing: 4}}>KAPORA DEFTERİ</div>
      {satir('Civic · Örnek kapora', 0)}
      {satir('süre? 5 gün mü, 7 mi?', 1)}
      {satir('Focus · aradı · ???', 2, true)}
      {satir('Passat · Salı dönecek', 3)}
      {satir('i20 · senet ne oldu', 4)}
      <div style={{position: 'absolute', left: 80, top: 210, width: 300, height: 100, border: `5px solid ${renk.kirmizi}`, borderRadius: '50%', opacity: interpolate(frame, [12, 18], [0, 0.8], cl)}} />
    </div>
    <Damga f={frame - 27} metin="SÜRESİ DOLDU" renkKod={renk.kirmizi} style={{top: 560}} />
    {frame >= 42 && <div style={{position: 'absolute', top: 1180, fontSize: 64, fontWeight: 800, color: '#fff', letterSpacing: 6, opacity: sp(frame - 42, 30)}}>👀 BAKAN YOK</div>}
  </AbsoluteFill>;
};

const Duzen: React.FC = () => {
  const frame = useCurrentFrame();
  const vurus = 34; // VO "düzen" 6 + 28
  const g = sp(frame - vurus, 30, 10, 380);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, transform: sars(frame, vurus, vurus + 10, 40, 'd')}}>
    <div style={{fontSize: 66, color: '#fff', letterSpacing: 4, textAlign: 'center', opacity: interpolate(frame, [0, 8], [0, 1], cl), marginBottom: 60}}>
      SORUN <span style={{textDecoration: frame > 18 ? 'line-through' : 'none', textDecorationColor: renk.kirmizi, textDecorationThickness: 10}}>ARABA</span> DEĞİL.
    </div>
    <div style={{opacity: frame >= vurus ? 1 : 0, fontSize: 230, lineHeight: 1, color: renk.kirmizi, transform: `scale(${2 - 1 * g})`, textShadow: `0 0 80px ${renk.kirmizi}`}}>DÜZEN</div>
    {frame >= vurus && <Lazer y={1200} o={sp(frame - vurus, 30)} />}
  </AbsoluteFill>;
};

// ——— Nexus Car ekranları (demo veri, etiketler koddan) ———
const UstBar: React.FC<{baslik: string; alt: string}> = ({baslik, alt}) => <div style={{padding: '90px 36px 24px', borderBottom: '1px solid #222', background: '#0f0f12'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 56}} />
    <div style={{fontSize: 24, letterSpacing: 4, opacity: 0.6}}>NEXUS CAR</div>
    <div style={{marginLeft: 'auto', fontSize: 18, letterSpacing: 2, padding: '4px 10px', border: '1px solid #444', borderRadius: 8, opacity: 0.6}}>DEMO VERİ</div>
  </div>
  <div style={{fontSize: 44, fontWeight: 800, marginTop: 14}}>{baslik}</div>
  <div style={{fontSize: 26, opacity: 0.6, marginTop: 4}}>{alt}</div>
</div>;

const Rozet: React.FC<{renkKod: string; children: React.ReactNode; style?: React.CSSProperties}> = ({renkKod, children, style}) => <span style={{display: 'inline-block', padding: '6px 16px', borderRadius: 30, fontSize: 22, fontWeight: 800, color: renkKod, background: `${renkKod}22`, border: `2px solid ${renkKod}`, ...style}}>{children}</span>;

const Alan: React.FC<{et: string; deger: string; f: number}> = ({et, deger, f}) => {
  const frame = useCurrentFrame();
  const g = sp(frame - f, 30, 12, 200);
  return <div style={{padding: '16px 22px', borderRadius: 18, background: '#16161a', border: '2px solid #2a2a30', marginTop: 14, opacity: g, transform: `translateX(${(1 - g) * 60}px)`}}>
    <div style={{fontSize: 22, opacity: 0.55}}>{et}</div><div style={{fontSize: 34, fontWeight: 800, marginTop: 4}}>{deger}</div>
  </div>;
};

// Araç alış akışı — AlisAkisi.tsx adımları
const NAlis: React.FC = () => {
  const frame = useCurrentFrame();
  const adimlar = ['Alış bilgisi', 'Sahiplik', 'Ekspertiz, tramer ve evrak', 'Parça haritası'];
  const adim = frame < 74 ? 0 : frame < 114 ? 1 : 2;
  const evrak = ['Ruhsat aslı görüldü', 'Muayene geçerli', 'Tramer sorgusu yapıldı', 'Anahtar ve yedek anahtar teslim alındı'];
  const ozmal = frame >= 92;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Araç Al" alt="34 DEM 101 · Volkswagen Passat" />
        <div style={{padding: '20px 30px'}}>
          <div style={{display: 'flex', gap: 10}}>
            {adimlar.map((a, i) => <div key={a} style={{flex: 1, height: 10, borderRadius: 5, background: i < adim ? yesil : i === adim ? renk.kirmizi : '#2a2a30'}} />)}
          </div>
          <div style={{fontSize: 24, opacity: 0.6, marginTop: 14}}>Adım {adim + 1} / 4</div>
          <div style={{fontSize: 40, fontWeight: 800, marginTop: 4}}>{adimlar[adim]}</div>
          {adim === 0 && <>
            <Alan et="Alış fiyatı" deger={tl(780000)} f={8} />
            <Alan et="Ödeme" deger="Havale / EFT" f={18} />
            <Alan et="Hedef satış" deger={tl(899000)} f={28} />
          </>}
          {adim === 1 && <div style={{display: 'flex', gap: 12, marginTop: 24}}>
            {['Özmal', 'Konsinye', 'Ortaklı'].map((s, i) => {
              const sec = i === 0 && ozmal;
              return <div key={s} style={{flex: 1, padding: '28px 0', textAlign: 'center', borderRadius: 18, fontSize: 32, fontWeight: 800, background: sec ? renk.kirmizi : '#1d1d22', color: sec ? '#fff' : '#999', transform: `scale(${sec ? 1 + 0.12 * (1 - sp(frame - 92, 30, 8, 260)) : 1})`}}>{s}</div>;
            })}
          </div>}
          {adim === 2 && <>
            <Alan et="Tramer tutarı" deger="Yok" f={116} />
            <div style={{marginTop: 14}}>
              {evrak.map((e, i) => {
                const tik = frame >= 124 + i * 8;
                return <div key={e} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid #222', fontSize: 26}}>
                  <div style={{width: 40, height: 40, flexShrink: 0, borderRadius: 10, border: `3px solid ${tik ? yesil : '#555'}`, background: tik ? yesil : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26}}>{tik ? '✓' : ''}</div>{e}
                </div>;
              })}
            </div>
            <div style={{marginTop: 16, fontSize: 21, opacity: 0.55}}>Yalnız kayıt içindir; resmi sorgu yapmaz.</div>
          </>}
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 76 && frame < 106 && <Parmak x={250 + interpolate(frame, [76, 92], [1, 0], cl) * 120} y={720 + interpolate(frame, [76, 92], [1, 0], cl) * 200} />}
    <Bolum no="01" metin="ARAÇ ALIŞ" />
  </>;
};

// Parça haritası — parcalar.ts durum renkleri: Orijinal #9E9E9E, Lokal Boyalı #F4C430, Boyalı #F57C00, Değişen #C62828
const NParca: React.FC = () => {
  const frame = useCurrentFrame();
  const gri = '#9E9E9E';
  const isaret: Record<string, [string, number]> = {sol_on_camurluk: [turuncu, 55], sag_arka_kapi: [sari, 74], on_tampon: ['#C62828', 66]};
  const r = (kod: string) => {
    const x = isaret[kod];
    if (!x || frame < x[1]) return gri;
    return x[0];
  };
  const P = (kod: string, x: number, y: number, w: number, h: number, rad = 10) => {
    const x2 = isaret[kod];
    const pop = x2 ? 1 - sp(frame - x2[1], 30, 8, 260) : 0;
    return <rect key={kod} x={x - pop * 6} y={y - pop * 6} width={w + pop * 12} height={h + pop * 12} rx={rad} fill={r(kod)} stroke="#0b0b0d" strokeWidth={5} />;
  };
  const ozet: [string, string, string, number][] = [['Boyalı', 'Sol Ön Çamurluk', turuncu, 55], ['Değişen', 'Ön Tampon', '#C62828', 66], ['Lokal Boyalı', 'Sağ Arka Kapı', sari, 74]];
  const parmak = frame < 55 ? {x: 300, y: 560} : frame < 66 ? {x: 450, y: 470} : {x: 610, y: 900};
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Parça haritası" alt="34 DEM 101 · Kaporta" />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, padding: '18px 30px 0'}}>
          {[['Orijinal', gri], ['Lokal Boyalı', sari], ['Boyalı', turuncu], ['Değişen', '#C62828']].map(([a, c]) => <Rozet key={a} renkKod={c}>{a}</Rozet>)}
        </div>
        <svg width={680} height={560} viewBox="0 0 680 560" style={{marginTop: 10}}>
          {/* üstten görünüm: ön üstte */}
          {P('on_tampon', 240, 10, 200, 34, 16)}
          {P('sol_on_camurluk', 190, 50, 46, 120)}{P('kaput', 240, 50, 200, 120)}{P('sag_on_camurluk', 444, 50, 46, 120)}
          {P('on_cam', 240, 176, 200, 40)}
          {P('sol_on_kapi', 190, 176, 46, 120)}{P('sag_on_kapi', 444, 176, 46, 120)}
          {P('tavan', 240, 222, 200, 150)}
          {P('sol_arka_kapi', 190, 302, 46, 120)}{P('sag_arka_kapi', 444, 302, 46, 120)}
          {P('arka_cam', 240, 378, 200, 40)}
          {P('sol_arka_camurluk', 190, 428, 46, 80)}{P('bagaj', 240, 424, 200, 84)}{P('sag_arka_camurluk', 444, 428, 46, 80)}
          {P('arka_tampon', 240, 514, 200, 34, 16)}
        </svg>
        <div style={{padding: '0 30px'}}>
          {ozet.map(([d, p, c, f]) => frame >= f && <div key={d} style={{fontSize: 28, fontWeight: 800, padding: '8px 0', opacity: sp(frame - f, 30), transform: `translateX(${(1 - sp(frame - f, 30)) * 60}px)`}}><span style={{color: c}}>{d}:</span> {p}</div>)}
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 40 && frame < 100 && <Parmak x={parmak.x} y={parmak.y} />}
    <Bolum no="02" metin="PARÇA HARİTASI" />
  </>;
};

// Kâr — galeri.ts: maliyet = alış + masraflar; tahmini kâr = hedef satış − maliyet
const NKar: React.FC = () => {
  const frame = useCurrentFrame();
  const kalemF = [6, 14, 22, 30, 38];
  const eklenen = masraflar.reduce((t, [, tutar], i) => t + tutar * interpolate(frame, [kalemF[i], kalemF[i] + 8], [0, 1], cl), 0);
  const kar = frame >= 80;
  const g = sp(frame - 80, 30, 9, 220);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Alış / Satış" alt="34 DEM 101 · Passat 1.6 TDI" />
        <div style={{padding: '16px 30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, padding: '12px 0', borderBottom: '1px solid #222'}}><span style={{opacity: 0.7}}>Alış fiyatı</span><b>{tl(780000)}</b></div>
          {masraflar.map(([ad, tutar], i) => {
            const gg = sp(frame - kalemF[i], 30, 10, 220);
            return <div key={ad} style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, padding: '10px 0', borderBottom: '1px solid #222', opacity: gg, transform: `translateX(${(1 - gg) * 80}px)`}}><span style={{opacity: 0.7}}>+ {ad}</span><b style={{color: '#ffb4b4'}}>{tl(tutar)}</b></div>;
          })}
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 800, padding: '16px 0'}}><span>Maliyet</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{tl(780000 + eklenen)}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, padding: '6px 0', opacity: 0.7}}><span>Hedef satış</span><b>{tl(899000)}</b></div>
          <div style={{marginTop: 20, padding: '24px 28px', borderRadius: 22, background: kar ? `${yesil}22` : '#16161a', border: `3px solid ${kar ? yesil : '#2a2a30'}`, transform: `scale(${kar ? 0.9 + 0.1 * g : 1})`, boxShadow: kar ? `0 0 50px ${yesil}50` : 'none'}}>
            <div style={{fontSize: 26, opacity: 0.8}}>Tahmini kâr</div>
            <div style={{fontSize: 76, fontWeight: 800, color: kar ? yesil : '#555'}}>{kar ? tl(75000) : '—'}</div>
            <div style={{fontSize: 22, opacity: 0.55}}>Satışta: Gerçekleşen kâr</div>
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="03" metin="GERÇEK KÂR" />
  </>;
};

// Stok — Stok.tsx rozetleri + galeriRapor.ts bağlı sermaye ve ortalama stok yaşı
const NStok: React.FC = () => {
  const frame = useCurrentFrame();
  const araclar: [string, string, number, string, string][] = [['34 DEM 101', 'Volkswagen Passat', 12, 'Taze', yesil], ['34 DEM 102', 'Honda Civic', 27, 'Bekliyor', turuncu], ['34 DEM 103', 'Ford Focus', 52, 'Uzun süredir', renk.kirmizi]];
  const isaret = frame >= 24;
  const nabiz = isaret ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  const kpi = sp(frame - 67, 30, 10, 200);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Stok" alt="Stokta · 3 araç" />
        <div style={{padding: '18px 30px'}}>
          <div style={{display: 'flex', gap: 12}}>
            {['Stokta', 'Satılanlar'].map((m, i) => <div key={m} style={{flex: 1, padding: '14px 0', textAlign: 'center', borderRadius: 16, fontSize: 28, fontWeight: 800, background: i === 0 ? renk.kirmizi : '#1d1d22', color: i === 0 ? '#fff' : '#888'}}>{m}</div>)}
          </div>
          {araclar.map(([plaka, ad, gun, rz, c], i) => {
            const kritik = i === 2 && isaret;
            const g = sp(frame - i * 5, 30, 12, 200);
            return <div key={plaka} style={{marginTop: 16, padding: '18px 22px', borderRadius: 20, background: '#16161a', border: `3px solid ${kritik ? renk.kirmizi : '#2a2a30'}`, boxShadow: kritik ? `0 0 ${20 + nabiz * 40}px ${renk.kirmizi}` : 'none', opacity: g, transform: `translateY(${(1 - g) * 60}px)`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div><div style={{fontSize: 30, fontWeight: 800}}>{ad}</div><div style={{fontSize: 22, opacity: 0.55}}>{plaka} · {gun} gün</div></div>
                <Rozet renkKod={c}>{rz}</Rozet>
              </div>
              {i === 2 && isaret && <div style={{marginTop: 10, fontSize: 22, color: renk.kirmizi, fontWeight: 800}}>İndirim / ilan düşünün</div>}
            </div>;
          })}
          {frame >= 63 && <div style={{display: 'flex', gap: 14, marginTop: 22, opacity: kpi, transform: `scale(${0.85 + 0.15 * kpi})`}}>
            <div style={{flex: 1.4, padding: '20px 22px', borderRadius: 20, background: `${renk.kirmizi}22`, border: `3px solid ${renk.kirmizi}`}}><div style={{fontSize: 22, opacity: 0.8}}>Bağlı sermaye</div><div style={{fontSize: 40, fontWeight: 800}}>{tl(2210000)}</div></div>
            <div style={{flex: 1, padding: '20px 22px', borderRadius: 20, background: '#16161a', border: '2px solid #2a2a30'}}><div style={{fontSize: 22, opacity: 0.8}}>Ort. stok yaşı</div><div style={{fontSize: 40, fontWeight: 800}}>30 gün</div></div>
          </div>}
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="04" metin="STOK YAŞI" />
  </>;
};

// Kapora — Kaparo.tsx durum "Aktif", hatirlatma.ts "Kapora süresi" / "Kapora için N gün kaldı."
const NKapora: React.FC = () => {
  const frame = useCurrentFrame();
  const dus = sp(frame - 34, 30, 10, 180);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Kapora" alt="34 DEM 102 · Honda Civic 1.6 i-VTEC" />
        <div style={{padding: '20px 30px'}}>
          <div style={{transform: `translateY(${(1 - dus) * -420}px)`, opacity: frame >= 34 ? 1 : 0, padding: '22px 26px', borderRadius: 24, background: `${sari}1c`, border: `3px solid ${sari}`, boxShadow: `0 0 50px ${sari}40`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 800, color: sari}}><span>🔔 Kapora süresi</span><span style={{opacity: 0.8}}>Civic</span></div>
            <div style={{fontSize: 40, fontWeight: 800, marginTop: 10}}>Kapora için 2 gün kaldı.</div>
          </div>
          <div style={{marginTop: 22, padding: '22px 26px', borderRadius: 24, background: '#16161a', border: '2px solid #2a2a30'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span style={{fontSize: 28, opacity: 0.7}}>Durum</span><Rozet renkKod={yesil}>Aktif</Rozet></div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, marginTop: 18}}><span style={{opacity: 0.7}}>Araç</span><b>Kaporalı</b></div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, marginTop: 14}}><span style={{opacity: 0.7}}>Kapora</span><b>{tl(50000)}</b></div>
          </div>
          <div style={{marginTop: 22, height: 84, borderRadius: 20, background: '#1d1d22', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800}}>📄 Kapora makbuzu PDF</div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="05" metin="KAPORA" />
  </>;
};

// Talep eşleşme — talepEslesme.ts kriterleri; yalnız "satışta/hazır" stokla
const NTalep: React.FC = () => {
  const frame = useCurrentFrame();
  const bulundu = frame >= 62;
  const g = sp(frame - 62, 30, 10, 200);
  const tarama = interpolate(frame % 24, [0, 24], [0, 1]);
  const kriter = ['Honda Civic', '2019 ve sonrası', 'Otomatik', 'En çok 80.000 km', `Bütçe ${tl(1050000)}`];
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Talepler" alt="Müşteri talepleri" />
        <div style={{padding: '20px 30px'}}>
          <div style={{padding: '22px 26px', borderRadius: 24, background: '#16161a', border: `3px solid ${bulundu ? yesil : '#2a2a30'}`, boxShadow: bulundu ? `0 0 50px ${yesil}40` : 'none'}}>
            <div style={{fontSize: 34, fontWeight: 800}}>Mehmet Y.</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14}}>
              {kriter.map((k, i) => <span key={k} style={{padding: '8px 16px', borderRadius: 30, background: '#25252b', fontSize: 22, fontWeight: 800, opacity: sp(frame - 4 - i * 4, 30)}}>{k}</span>)}
            </div>
            <div style={{marginTop: 18, borderTop: '1px solid #2a2a30', paddingTop: 16}}>
              {!bulundu ? <div style={{position: 'relative', height: 60, borderRadius: 14, overflow: 'hidden', background: '#1d1d22', fontSize: 24, display: 'flex', alignItems: 'center', paddingLeft: 20, opacity: 0.8}}>
                Stok taranıyor…
                <div style={{position: 'absolute', top: 0, bottom: 0, left: `${tarama * 100}%`, width: 80, background: `linear-gradient(90deg, transparent, ${renk.kirmizi}90, transparent)`}} />
              </div> : <div style={{padding: '18px 20px', borderRadius: 18, background: `${yesil}1c`, border: `2px solid ${yesil}`, transform: `scale(${0.8 + 0.2 * g})`, opacity: g}}>
                <div style={{fontSize: 22, color: yesil, fontWeight: 800}}>✓ UYAN ARAÇ</div>
                <div style={{fontSize: 30, fontWeight: 800, marginTop: 6}}>Honda Civic 1.6 i-VTEC</div>
                <div style={{fontSize: 22, opacity: 0.7, marginTop: 4}}>34 DEM 102 · 2020 · 61.000 km · Otomatik</div>
              </div>}
            </div>
          </div>
          <div style={{marginTop: 20, padding: '20px 26px', borderRadius: 24, background: '#16161a', border: '2px solid #2a2a30', opacity: 0.6}}>
            <div style={{fontSize: 30, fontWeight: 800}}>Ayşe K.</div>
            <div style={{fontSize: 22, marginTop: 8}}>Her araç · Dizel · Manuel</div>
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="06" metin="TALEP EŞLEŞME" />
  </>;
};

// İlan metni — galeriIlan.ts satırları; Ilan.tsx: Kopyala / Paylaş / Vitrin kartı PDF
const NIlan: React.FC = () => {
  const frame = useCurrentFrame();
  const satirlar = ['2019 Volkswagen Passat 1.6 TDI · 98.000 km · Dizel · Otomatik', '', `Fiyat: ${tl(899000)}`, 'Model yılı: 2019', 'Kilometre: 98.000 km', 'Yakıt: Dizel', 'Vites: Otomatik', 'Tramer kaydı: Yok', 'Boya / değişen: Boyalı: Sol Ön Çamurluk · Değişen: Ön Tampon · Lokal Boyalı: Sağ Arka Kapı'];
  const metin = satirlar.join('\n');
  const n = Math.floor(interpolate(frame, [18, 70], [0, metin.length], cl));
  const kopya = interpolate(frame, [83, 85, 89], [0, 1, 0], cl);
  const paylas = interpolate(frame, [90, 92, 96], [0, 1, 0], cl);
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="İlan metni" alt="34 DEM 101 · Volkswagen Passat" />
        <div style={{padding: '20px 30px'}}>
          <div style={{minHeight: 560, padding: '22px 24px', borderRadius: 20, background: '#16161a', border: '2px solid #2a2a30', fontSize: 25, lineHeight: 1.45, whiteSpace: 'pre-wrap'}}>
            {metin.slice(0, n)}<span style={{opacity: frame % 16 < 8 && n < metin.length ? 1 : 0}}>|</span>
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 20}}>
            {['Kopyala', 'Paylaş'].map((b, i) => {
              const aktif = i === 0 ? frame >= 85 : frame >= 92;
              return <div key={b} style={{flex: 1, height: 86, borderRadius: 20, background: aktif ? yesil : renk.kirmizi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, transform: `scale(${1 - 0.08 * (i === 0 ? kopya : paylas)})`}}>{aktif ? `${b} ✓` : b}</div>;
            })}
          </div>
          <div style={{marginTop: 14, height: 76, borderRadius: 20, background: '#1d1d22', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800}}>📄 Vitrin kartı PDF</div>
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 72 && frame < 98 && <Parmak x={frame < 88 ? 320 : 640} y={1010} />}
    <Bolum no="07" metin="İLAN METNİ" />
  </>;
};

const Ozet: React.FC = () => {
  const frame = useCurrentFrame();
  const satirlar: [string, number, number][] = [['DEFTER', 4, 18], ['TAHMİN', 36, 45], ['UNUTMAK', 70, 82]];
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, gap: 40}}>
    {satirlar.map(([k, gel, yok]) => {
      const g = sp(frame - gel, 30, 10, 220);
      const y = frame >= yok;
      return <div key={k} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: g, transform: `translateX(${(1 - g) * -200}px)`}}>
        <div style={{fontSize: 120, color: y ? '#ffffff70' : '#fff', textDecoration: y ? 'line-through' : 'none', textDecorationColor: renk.kirmizi, textDecorationThickness: 12}}>{k}</div>
        {y && <div style={{fontSize: 80, color: '#fff', background: renk.kirmizi, padding: '4px 22px', transform: `scale(${2 - sp(frame - yok, 30, 8, 300)}) rotate(-6deg)`}}>YOK</div>}
      </div>;
    })}
    <div style={{marginTop: 30, fontSize: 44, letterSpacing: 8, color: yesil, opacity: interpolate(frame, [88, 94], [0, 1], cl)}}>NEXUS CAR İLE</div>
  </AbsoluteFill>;
};

const Dm: React.FC = () => {
  const frame = useCurrentFrame();
  const yazi = 'GALERİ';
  const n = Math.min(yazi.length, Math.max(0, Math.floor((frame - 4) / 3)));
  const gonder = frame >= 24;
  const b = sp(frame - 24, 30, 11, 220);
  return <Telefon>
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '90px 30px 26px', borderBottom: '1px solid #222'}}>
        <div style={{width: 80, height: 80, borderRadius: 40, background: '#000', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}><Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 70}} /></div>
        <div><div style={{fontSize: 34, fontWeight: 800}}>nexusstudiocs</div><div style={{fontSize: 24, opacity: 0.6}}>Nexus Studio</div></div>
      </div>
      <div style={{position: 'absolute', top: 340, left: 40, right: 40, textAlign: 'center', fontSize: 34, opacity: 0.55, lineHeight: 1.4}}>Nexus Car demosu için<br /><b style={{color: '#fff', opacity: 1, fontSize: 64}}>GALERİ</b><br />yazın.</div>
      {gonder && <div style={{position: 'absolute', right: 30, bottom: 200, background: 'linear-gradient(135deg, #C20D38, #941F38)', borderRadius: 40, padding: '24px 40px', fontSize: 48, fontWeight: 800, transform: `scale(${b})`, transformOrigin: 'bottom right'}}>GALERİ</div>}
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
      <div style={{fontSize: 40, fontWeight: 800, letterSpacing: 6, opacity: 0.8}}>NEXUS CAR · NEXUS STUDIO</div>
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

const sira: [number, React.FC][] = [[sahne.kanca, Kanca], [sahne.masraf, Masraf], [sahne.stok, StokSorun], [sahne.kapora, KaporaSorun], [sahne.duzen, Duzen], [sahne.nAlis, NAlis], [sahne.nParca, NParca], [sahne.nKar, NKar], [sahne.nStok, NStok], [sahne.nKapora, NKapora], [sahne.nTalep, NTalep], [sahne.nIlan, NIlan], [sahne.ozet, Ozet], [sahne.dm, Dm], [sahne.son, Son]];

const Ses: React.FC<{ad: string; at: number; v?: number}> = ({ad, at, v = 0.5}) => <Sequence from={at}><Audio src={sfxYolu(ad)} volume={v} /></Sequence>;

export const Reels06: React.FC = () => {
  const vurus = sahne.duzen + 34;
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    <Zemin />
    {sira.map(([bas, Bil], i) => {
      const bitis = i + 1 < sira.length ? sira[i + 1][0] : REELS06_SURE;
      return <Sequence key={i} from={bas} durationInFrames={bitis - bas}>{i === 0 ? <Bil /> : <Kesme><Bil /></Kesme>}</Sequence>;
    })}
    <Sequence durationInFrames={sahne.son}><Vizor /></Sequence>
    <Altyazi />
    <Gren />
    {seslendirme.map((v) => <Sequence key={v.dosya} from={v.at}><Audio src={staticFile(`${R}${v.dosya}.wav`)} volume={1} /></Sequence>)}
    {/* ses tasarımı: sorun kısmı saat + nabız gerilimi, Nexus Car kısmı ritimli */}
    <Sequence durationInFrames={sahne.kapora + 2}><Audio src={sfxYolu('ortam--11325622-clock-ticking-sound-effect')} volume={0.35} loop /></Sequence>
    <Sequence from={sahne.masraf} durationInFrames={sahne.nAlis - sahne.masraf}><Audio src={sfxYolu('dramatik--gerilim-droneu')} volume={0.22} loop /></Sequence>
    <Sequence from={sahne.masraf} durationInFrames={sahne.duzen - sahne.masraf}><Audio src={sfxYolu('dramatik--nabiz-hizli')} volume={0.25} loop /></Sequence>
    {Array.from({length: Math.floor((sahne.son - sahne.nAlis) / 15)}).map((_, i) => <Ses key={`b${i}`} ad="vurgu--vurus-orta" at={sahne.nAlis + i * 15} v={i % 2 === 0 ? 0.14 : 0.07} />)}
    <Sequence durationInFrames={sahne.masraf}><Audio src={sfxYolu('acilis--hook')} volume={0.4} /></Sequence>
    <Ses ad="vurgu--sub-dusus" at={40} v={0.55} />
    <Ses ad="dijital--glitch-kisa" at={42} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.masraf} />
    {masraflar.map(([, , f]) => <Ses key={f} ad="metin--pop" at={sahne.masraf + f} v={0.35} />)}
    <Ses ad="bildirim--hata" at={sahne.masraf + 96} v={0.45} />
    <Ses ad="gecis--kagit-swipe" at={sahne.stok} v={0.45} />
    <Ses ad="dramatik--yukselen-kisa" at={sahne.stok + 4} v={0.25} />
    <Ses ad="vurgu--sub-dusus" at={sahne.stok + 44} v={0.5} />
    <Ses ad="metin--klik" at={sahne.stok + 58} v={0.5} />
    <Ses ad="gecis--kagit-swipe" at={sahne.kapora - 8} v={0.3} />
    <Ses ad="metin--yazi-yazma" at={sahne.kapora + 22} v={0.25} />
    <Ses ad="bildirim--hata" at={sahne.kapora + 27} v={0.45} />
    <Ses ad="gecis--whoosh-sert" at={sahne.duzen} v={0.5} />
    <Ses ad="gecis--tape-stop" at={vurus - 14} v={0.35} />
    <Ses ad="vurgu--trailer-boom" at={vurus} v={0.45} />
    <Ses ad="dramatik--yukselen-kisa" at={sahne.nAlis - 34} v={0.35} />
    <Ses ad="gecis--whoosh-uzun" at={sahne.nAlis - 6} v={0.5} />
    {[8, 18, 28].map((f) => <Ses key={f} ad="metin--pop-yumusak" at={sahne.nAlis + f} v={0.4} />)}
    <Ses ad="metin--klik" at={sahne.nAlis + 92} v={0.5} />
    {[0, 1, 2, 3].map((i) => <Ses key={i} ad="bildirim--ding" at={sahne.nAlis + 124 + i * 8} v={0.3} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.nParca} />
    {[55, 66, 74].map((f) => <Ses key={f} ad="metin--klik" at={sahne.nParca + f} v={0.5} />)}
    <Ses ad="bildirim--basari" at={sahne.nParca + 112} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nKar} />
    {[6, 14, 22, 30, 38].map((f) => <Ses key={f} ad="metin--pop-yumusak" at={sahne.nKar + f} v={0.4} />)}
    <Ses ad="bildirim--dragon-studio-correct" at={sahne.nKar + 80} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nStok} />
    <Ses ad="dramatik--alarm" at={sahne.nStok + 24} v={0.18} />
    <Ses ad="metin--pop" at={sahne.nStok + 67} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nKapora - 8} v={0.3} />
    <Ses ad="bildirim--mesaj" at={sahne.nKapora + 36} v={0.55} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nTalep} />
    <Ses ad="dijital--robot-bip" at={sahne.nTalep + 30} v={0.3} />
    <Ses ad="bildirim--basari" at={sahne.nTalep + 62} v={0.45} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nIlan} />
    <Ses ad="metin--yazi-yazma" at={sahne.nIlan + 18} v={0.3} />
    <Ses ad="metin--klik" at={sahne.nIlan + 85} v={0.5} />
    <Ses ad="metin--klik" at={sahne.nIlan + 92} v={0.5} />
    <Ses ad="bildirim--ding" at={sahne.nIlan + 94} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.ozet} />
    {[18, 45, 82].map((f) => <Ses key={f} ad="vurgu--vurus-orta" at={sahne.ozet + f} v={0.45} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.dm} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Ses key={i} ad="metin--tik-daktilo" at={sahne.dm + 4 + i * 3} v={0.5} />)}
    <Ses ad="bildirim--mesaj" at={sahne.dm + 24} v={0.6} />
    <Ses ad="vurgu--trailer-boom" at={sahne.son} v={0.5} />
  </AbsoluteFill>;
};
