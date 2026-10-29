import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

// Reels 07: "Bu müşteriyi sen kaybettin" — Nexus CRM, Reels06 kalıbı, yalnız demo veri.
// Ekrandaki her özellik ve etiket koddan doğrulandı (Nexus CRM main):
// db/sabitler.ts (aşama adları ve renkleri, SONUC_ETIKET), db/kurallar.ts (Teklif istedi → aşama Teklif + "Teklif hazırla ve gönder" görevi),
// VARSAYILAN_ZINCIRLER ("İlgilendi → sıcak tut": 💬 Örnek işlerimizi gönder / 📞 Takip araması / 📞 Toplantı için tekrar ara),
// features/adaylar/Adaylar.tsx ("Müşteri adayı bul", "Fırsat {skor}", — "Sitesi yok" rozeti videoda kullanılmaz), features/arama ("Hızlı Arama", "Sonuç"),
// features/huni/Huni.tsx ("Satış Hunisi"), pano/OncelikListesi.tsx ("Bugün önce bunları ara") + lib/skor.ts nedenleri, Pano "Günlük arama hedefi",
// teklifler/TeklifDuzenle.tsx ("WhatsApp ile gönder", "N numaralı teklif PDF'i WhatsApp ile gönderildi"),
// finans/Alacaklar.tsx + lib/alacak.ts ("Gecikmiş alacaklar", "Vade … · N gün gecikti", WhatsApp / Tahsilat ekle / Vadeyi değiştir, kademe 2 metni),
// lib/ornekVeri.ts (demo firmalar). Teklif onay sayfası, sesli komut, resmi entegrasyon YOK → videoda iddia edilmez. Teklifte tutar gösterilmez.
const R = 'reels/r07/';
const sahne = {kanca: 0, daginik: 100, teklif: 258, odeme: 376, duzen: 492, nAday: 590, nArama: 744, nHuni: 898, nZincir: 1012, nBugun: 1166, nTeklif: 1254, nTahsilat: 1388, ozet: 1510, dm: 1638, son: 1760};
export const REELS07_SURE = 1860;

type Obek = [number, string, string[]?];
type Vo = {dosya: string; at: number; sure: number; alt: Obek[]};
const seslendirme: Vo[] = [
  {dosya: 'vo1', at: 6, sure: 89, alt: []}, // kapak başlığı ekranda
  {dosya: 'vo2', at: 104, sure: 150, alt: [[1, 'ARAMA DEFTERDE', ['DEFTERDE']], [30, 'NUMARA TELEFONDA', ['TELEFONDA']], [68, 'TEKLİF MAİLDE', ['MAİLDE']], [122, 'SÖZ AKLINDA', ['AKLINDA']]]},
  {dosya: 'vo3', at: 262, sure: 110, alt: [[0, 'TEKLİFİ GÖNDERDİN'], [46, '12 GÜN GEÇTİ', ['12']], [90, 'ARAYAN YOK', ['YOK']]]},
  {dosya: 'vo4', at: 380, sure: 108, alt: [[0, 'İŞ TESLİM EDİLDİ'], [44, 'ÖDEME GECİKTİ', ['GECİKTİ']], [87, 'SORAN YOK', ['YOK']]]},
  {dosya: 'vo5', at: 498, sure: 60, alt: []}, // metin ekranda
  {dosya: 'vo6', at: 596, sure: 116, alt: [[0, "NEXUS CRM'DE", ['NEXUS', "CRM'DE"]], [22, 'ADAY HARİTADAN GELİR', ['HARİTADAN']], [71, 'EN GÜÇLÜ FIRSAT', ['FIRSAT']], [95, 'ÖNE ÇIKAR', ['ÖNE', 'ÇIKAR']]]},
  {dosya: 'vo7', at: 748, sure: 145, alt: [[0, 'ARAMAYI BİTİR'], [29, 'SONUCU SEÇ', ['SEÇ']], [65, 'TEKLİF İSTEDİ DERSEN'], [100, 'GÖREV KENDİLİĞİNDEN AÇILIR', ['KENDİLİĞİNDEN']]]},
  {dosya: 'vo8', at: 902, sure: 106, alt: [[1, 'HER MÜŞTERİ HUNİDE', ['HUNİDE']], [49, 'KİM HANGİ AŞAMADA'], [77, 'TEK BAKIŞTA', ['BAKIŞTA']]]},
  {dosya: 'vo9', at: 1016, sure: 145, alt: [[0, 'İLGİLENDİ DEDİĞİN AN'], [38, 'TAKİP ZİNCİRİ KURULUR', ['ZİNCİRİ']], [88, 'MESAJ'], [92, 'MESAJ ARAMA'], [110, 'TEKRAR ARAMA', ['TEKRAR']]]},
  {dosya: 'vo10', at: 1170, sure: 78, alt: [[4, 'SABAH AÇTIĞINDA'], [27, 'ÖNCE KİMİ ARAYACAĞIN'], [57, 'HAZIR', ['HAZIR']]]},
  {dosya: 'vo11', at: 1258, sure: 125, alt: [[0, 'TEKLİF PDF OLARAK HAZIR', ['PDF']], [70, "WHATSAPP'TAN"], [86, 'TEK DOKUNUŞLA GİDER', ['GİDER']]]},
  {dosya: 'vo12', at: 1392, sure: 102, alt: [[0, 'ÖDEME GECİKİRSE'], [29, 'TAHSİLAT GÖREVİ', ['TAHSİLAT']], [58, 'VE MESAJ TASLAĞI'], [79, 'HAZIR', ['HAZIR']]]},
  {dosya: 'voO', at: 1514, sure: 118, alt: []}, // kelimeler ekranda
  {dosya: 'vo13', at: 1644, sure: 109, alt: [[2, "DM'DEN CRM YAZIN", ['CRM']], [66, 'SİSTEMİ SİZE GÖSTERELİM']]},
];

const sp = (f: number, fps: number, d = 12, s = 160) => spring({frame: Math.max(0, f), fps, config: {damping: d, stiffness: s}});
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const yesil = '#2DBE60';
const sari = '#F4C430';
const bilgi = '#60a5fa';
const tl = (n: number) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₺`;
// db/sabitler.ts VARSAYILAN_ASAMALAR
const asamalar: [string, string][] = [['Yeni', '#71717a'], ['Arandı', '#60a5fa'], ['Görüşüldü', '#818cf8'], ['İlgili', '#c084fc'], ['Toplantı', '#f59e0b'], ['Teklif', '#ff5a1f'], ['Kazanıldı', '#22c55e'], ['Kaybedildi', '#ef4444']];
const asamaRenk = (ad: string) => (asamalar.find(([a]) => a === ad) ?? ['', '#888'])[1];

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
    <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${(frame / REELS07_SURE) * 100}%`, background: renk.kirmizi, boxShadow: `0 0 16px ${renk.kirmizi}`}} />
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
    <div style={{position: 'absolute', right: 140, top: 140, fontFamily: 'monospace', fontSize: 26, color: '#FFFFFF88'}}>MÜŞTERİ · TAKİP</div>
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

const Rozet: React.FC<{renkKod: string; children: React.ReactNode; style?: React.CSSProperties}> = ({renkKod, children, style}) => <span style={{display: 'inline-block', padding: '6px 16px', borderRadius: 30, fontSize: 22, fontWeight: 800, color: renkKod, background: `${renkKod}22`, border: `2px solid ${renkKod}`, whiteSpace: 'nowrap', ...style}}>{children}</span>;

const Satir: React.FC<{et: string; children: React.ReactNode; boyut?: number}> = ({et, children, boyut = 30}) => <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: boyut, padding: '12px 0', borderBottom: '1px solid #ffffff1c'}}><span style={{opacity: 0.6}}>{et}</span><b>{children}</b></div>;

// ——— Sorun sahneleri ———
// KANCA: ilk karede müşteri kartı + kapak başlığı; müşterinin mesajı düşer, aşama "Teklif"ten "Kaybedildi"ye çakılır.
const Kanca: React.FC = () => {
  const frame = useCurrentFrame();
  const vurus = 67; // VO "sen kaybettin" ~ 6+61
  const kayip = frame >= vurus;
  const flas = interpolate(frame, [vurus, vurus + 4, vurus + 14], [0, 0.55, 0], cl);
  const mesaj = sp(frame - 24, 30, 10, 220);
  const asama = kayip ? 'Kaybedildi' : 'Teklif';
  return <AbsoluteFill style={{fontFamily: yaziTipi, color: '#fff', transform: sars(frame, vurus, vurus + 12, 34, 'k')}}>
    <div style={{position: 'absolute', top: 250, left: 140, right: 140, padding: '28px 40px', borderRadius: 30, background: '#16161aee', border: `3px solid ${kayip ? renk.kirmizi : '#ffffff30'}`, boxShadow: kayip ? `0 0 60px ${renk.kirmizi}70` : '0 30px 80px #000'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 10}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: '#2a2a30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800}}>AO</div>
        <div><div style={{fontSize: 44, fontWeight: 800}}>Örnek otel</div><div style={{fontSize: 26, opacity: 0.6}}>Selin Aydın</div></div>
      </div>
      <Satir et="Aşama"><Rozet renkKod={asamaRenk(asama)} style={{fontSize: 28, transform: kayip ? `scale(${1.4 - 0.4 * sp(frame - vurus, 30, 8, 260)})` : undefined}}>{asama}</Rozet></Satir>
      <Satir et="Son sonuç">Teklif istedi</Satir>
      <Satir et="Son temas"><span style={{color: kayip ? renk.kirmizi : '#fff'}}>12 gün önce</span></Satir>
    </div>
    {frame >= 24 && <div style={{position: 'absolute', top: 690, left: 140, maxWidth: 720, padding: '22px 30px', borderRadius: '34px 34px 34px 8px', background: '#26262c', fontSize: 40, boxShadow: '0 20px 60px #000', transform: `scale(${mesaj})`, transformOrigin: 'left bottom'}}>
      <div style={{fontSize: 24, opacity: 0.55, marginBottom: 6}}>Selin Aydın · şimdi</div>
      Başka bir firmayla anlaştık 🙏
    </div>}
    <div style={{position: 'absolute', top: 960, left: 0, right: 0, textAlign: 'center', fontWeight: 800, lineHeight: 1, textShadow: '0 8px 30px #000'}}>
      <div style={{fontSize: 92, letterSpacing: 4}}>BU MÜŞTERİYİ</div>
      <div style={{fontSize: 56, letterSpacing: 4, marginTop: 14, opacity: 0.75}}>RAKİBİN ALMADI.</div>
      <div style={{fontSize: 130, color: renk.kirmizi, marginTop: 22, transform: `scale(${1 + 0.08 * interpolate(frame, [vurus, vurus + 4, vurus + 16], [0, 1, 0], cl)})`, textShadow: `0 0 40px ${renk.kirmizi}, 0 8px 30px #000`}}>SEN</div>
      <div style={{fontSize: 130, color: renk.kirmizi, textShadow: `0 0 40px ${renk.kirmizi}, 0 8px 30px #000`}}>KAYBETTİN</div>
    </div>
    <AbsoluteFill style={{background: renk.kirmizi, opacity: flas, mixBlendMode: 'screen'}} />
  </AbsoluteFill>;
};

// Dağınık bilgi: defter, telefon rehberi, mail, akıl
const Parca: React.FC<{f: number; etiket: string; rot: number; style: React.CSSProperties; children: React.ReactNode}> = ({f, etiket, rot, style, children}) => {
  const frame = useCurrentFrame();
  if (frame < f) return null;
  const g = sp(frame - f, 30, 10, 220);
  return <div style={{position: 'absolute', opacity: g, transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * g})`, ...style}}>
    {children}
    <div style={{position: 'absolute', top: -28, left: 24, background: renk.kirmizi, color: '#fff', fontSize: 30, fontWeight: 800, letterSpacing: 3, padding: '6px 18px'}}>{etiket}</div>
  </div>;
};
const Daginik: React.FC = () => {
  const frame = useCurrentFrame();
  const el = {fontStyle: 'italic', color: '#1d2a6b', fontSize: 36, padding: '10px 0', borderBottom: '2px solid #9ec3e6'} as const;
  return <AbsoluteFill style={{fontFamily: yaziTipi, transform: sars(frame, 140, 152, 24, 'dg')}}>
    <Parca f={14} etiket="DEFTERDE" rot={-6} style={{left: 80, top: 280, width: 440}}>
      <div style={{background: '#fdfbf3', padding: '40px 34px 30px', boxShadow: '0 30px 80px #000'}}>
        <div style={el}>Örnek otel → ara!</div>
        <div style={el}>Selin H. — teklif?</div>
        <div style={{...el, textDecoration: 'line-through'}}>Salı dönecek</div>
      </div>
    </Parca>
    <Parca f={47} etiket="TELEFONDA" rot={5} style={{left: 560, top: 420, width: 420}}>
      <div style={{background: '#1c1c20', borderRadius: 30, padding: '44px 30px 30px', color: '#fff', boxShadow: '0 30px 80px #000', border: '2px solid #333'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 72, height: 72, borderRadius: 36, background: '#3a3a42', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800}}>S</div>
          <div><div style={{fontSize: 34, fontWeight: 800}}>Selin otel</div><div style={{fontSize: 22, opacity: 0.5}}>Kişiler · not yok</div></div>
        </div>
      </div>
    </Parca>
    <Parca f={91} etiket="MAİLDE" rot={3} style={{left: 100, top: 780, width: 540}}>
      <div style={{background: '#f2f3f5', borderRadius: 18, padding: '44px 30px 24px', color: '#222', boxShadow: '0 30px 80px #000'}}>
        <div style={{fontSize: 24, opacity: 0.55}}>Gelen kutusu (214)</div>
        <div style={{fontSize: 30, fontWeight: 800, padding: '12px 0', borderBottom: '1px solid #ccc'}}>RE: RE: Teklif_son_v3.pdf</div>
        <div style={{fontSize: 28, padding: '12px 0', opacity: 0.5}}>Fwd: Hâlâ geçerli mi?</div>
      </div>
    </Parca>
    <Parca f={131} etiket="AKLINDA" rot={-4} style={{left: 520, top: 1080, width: 460}}>
      <div style={{background: '#fff', borderRadius: 70, padding: '50px 36px 40px', color: '#222', fontSize: 40, fontStyle: 'italic', fontWeight: 700, textAlign: 'center', boxShadow: '0 30px 80px #000'}}>“Perşembe dönerim…”</div>
    </Parca>
    {frame >= 140 && <AbsoluteFill style={{background: renk.kirmizi, opacity: interpolate(frame, [140, 144, 156], [0, 0.25, 0], cl), mixBlendMode: 'screen'}} />}
  </AbsoluteFill>;
};

// Gönderilen teklif + geçen gün sayacı
const TeklifSorun: React.FC = () => {
  const frame = useCurrentFrame();
  const gun = Math.round(interpolate(frame, [14, 54], [1, 12], cl));
  const kayit = sp(frame - 62, 30, 10, 200);
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, color: '#fff', transform: sars(frame, 94, 104, 26, 'ts')}}>
    <div style={{position: 'absolute', top: 280, right: 150, padding: '22px 30px', borderRadius: '34px 34px 8px 34px', background: 'linear-gradient(135deg, #C20D38, #941F38)', fontSize: 38, fontWeight: 800, boxShadow: '0 20px 60px #000', transform: `scale(${sp(frame - 2, 30, 10, 220)})`, transformOrigin: 'right bottom'}}>
      📄 Teklif_AnkaOtel.pdf
      <div style={{fontSize: 24, fontWeight: 600, opacity: 0.8, textAlign: 'right', marginTop: 6}}>Gönderildi ✓✓</div>
    </div>
    <div style={{position: 'absolute', top: 500, width: 460, borderRadius: 30, overflow: 'hidden', background: '#f6f2e8', boxShadow: '0 40px 120px #000', textAlign: 'center', transform: `rotate(${Math.sin(frame / 2) * (frame < 54 ? 2 : 0)}deg)`}}>
      <div style={{background: renk.kirmizi, fontSize: 30, fontWeight: 800, letterSpacing: 4, padding: '14px 0'}}>TEKLİF GÖNDERİLELİ</div>
      <div style={{fontSize: 230, fontWeight: 800, lineHeight: 1.05, color: gun >= 12 ? renk.kirmizi : '#222', fontVariantNumeric: 'tabular-nums'}}>{gun}</div>
      <div style={{fontSize: 40, fontWeight: 800, color: '#222', letterSpacing: 8, paddingBottom: 20}}>GÜN</div>
    </div>
    {frame >= 62 && <div style={{position: 'absolute', top: 1010, display: 'flex', gap: 24, opacity: kayit, transform: `scale(${1.3 - 0.3 * kayit})`}}>
      {['📞 Arama: 0', '💬 Mesaj: 0'].map((m) => <div key={m} style={{padding: '14px 26px', borderRadius: 20, background: '#16161a', border: '2px solid #333', fontSize: 36, fontWeight: 800}}>{m}</div>)}
    </div>}
    <Damga f={frame - 94} metin="ARAYAN YOK" renkKod={renk.kirmizi} style={{top: 760}} />
  </AbsoluteFill>;
};

// Teslim edilen işin ödemesi gecikiyor
const OdemeSorun: React.FC = () => {
  const frame = useCurrentFrame();
  const gecikme = Math.round(interpolate(frame, [48, 70], [1, 8], cl));
  const teslim = frame >= 6;
  return <AbsoluteFill style={{alignItems: 'center', fontFamily: yaziTipi, transform: sars(frame, 48, 58, 26, 'od')}}>
    <div style={{position: 'absolute', top: 290, width: 660, background: '#f6f2e8', padding: '34px 44px 30px', boxShadow: '0 40px 120px #000', transform: `rotate(-2deg) translateY(${(1 - sp(frame, 30, 14, 160)) * 300}px)`, color: '#222'}}>
      <div style={{fontSize: 32, fontWeight: 800, letterSpacing: 4}}>FATURA #0142</div>
      <div style={{fontSize: 40, fontWeight: 800, marginTop: 10, marginBottom: 10}}>Örnek restoran</div>
      {([['İş', 'Aylık bakım hizmeti'], ['Teslim', teslim ? '✓ Edildi' : '…'], ['Vade', '7 Ekim'], ['Tutar', tl(18500)]] as const).map(([e, d]) => <div key={e} style={{display: 'flex', justifyContent: 'space-between', height: 78, alignItems: 'center', borderBottom: '2px dashed #bbb', fontSize: 36}}>
        <span style={{opacity: 0.6}}>{e}</span><b style={{color: e === 'Teslim' && teslim ? yesil : '#222'}}>{d}</b>
      </div>)}
    </div>
    <Damga f={frame - 48} metin="GECİKTİ" renkKod={renk.kirmizi} style={{top: 560}} />
    {frame >= 48 && <div style={{position: 'absolute', top: 960, padding: '16px 34px', borderRadius: 40, background: renk.kirmizi, color: '#fff', fontSize: 50, fontWeight: 800, fontVariantNumeric: 'tabular-nums', transform: `scale(${sp(frame - 48, 30, 8, 260)})`}}>{gecikme} gün gecikti</div>}
    {frame >= 91 && <div style={{position: 'absolute', top: 1160, fontSize: 64, fontWeight: 800, color: '#fff', letterSpacing: 6, opacity: sp(frame - 91, 30)}}>🤐 SORAN YOK</div>}
  </AbsoluteFill>;
};

const Duzen: React.FC = () => {
  const frame = useCurrentFrame();
  const vurus = 37; // VO "düzen" 6 + 31
  const g = sp(frame - vurus, 30, 10, 380);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, transform: sars(frame, vurus, vurus + 10, 40, 'd')}}>
    <div style={{fontSize: 66, color: '#fff', letterSpacing: 4, textAlign: 'center', opacity: interpolate(frame, [0, 8], [0, 1], cl), marginBottom: 60}}>
      SORUN <span style={{textDecoration: frame > 22 ? 'line-through' : 'none', textDecorationColor: renk.kirmizi, textDecorationThickness: 10}}>MÜŞTERİ</span> DEĞİL.
    </div>
    <div style={{opacity: frame >= vurus ? 1 : 0, fontSize: 230, lineHeight: 1, color: renk.kirmizi, transform: `scale(${2 - 1 * g})`, textShadow: `0 0 80px ${renk.kirmizi}`}}>DÜZEN</div>
    {frame >= vurus && <Lazer y={1200} o={sp(frame - vurus, 30)} />}
  </AbsoluteFill>;
};

// ——— Nexus CRM ekranları (demo veri, etiketler koddan) ———
const UstBar: React.FC<{baslik: string; alt: string}> = ({baslik, alt}) => <div style={{padding: '90px 36px 24px', borderBottom: '1px solid #222', background: '#0f0f12'}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 56}} />
    <div style={{fontSize: 24, letterSpacing: 4, opacity: 0.6}}>NEXUS CRM</div>
    <div style={{marginLeft: 'auto', fontSize: 18, letterSpacing: 2, padding: '4px 10px', border: '1px solid #444', borderRadius: 8, opacity: 0.6}}>DEMO VERİ</div>
  </div>
  <div style={{fontSize: 44, fontWeight: 800, marginTop: 14}}>{baslik}</div>
  <div style={{fontSize: 26, opacity: 0.6, marginTop: 4}}>{alt}</div>
</div>;

const Kart: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => <div style={{padding: '20px 24px', borderRadius: 22, background: '#16161a', border: '2px solid #2a2a30', ...style}}>{children}</div>;

// Aday Bul — Adaylar.tsx: "Fırsat {skor}" (≥70 iyi, ≥45 orta). CRM genel amaçlı → karışık sektör, ajans rozeti ("Sitesi yok") gösterilmez
const NAday: React.FC = () => {
  const frame = useCurrentFrame();
  const one = frame >= 89;
  const tasi = sp(frame - 112, 30, 12, 160);
  const adaylar = [
    {ad: 'Yıldız Oto Servis', sektor: 'Oto servis', puan: '4,7', yorum: 318, skor: 54, sira: [0, 1]},
    {ad: 'Defne Diş Kliniği', sektor: 'Sağlık', puan: '4,8', yorum: 126, skor: 82, sira: [1, 0]},
    {ad: 'Kuzey Mobilya', sektor: 'Mağaza', puan: '4,5', yorum: 89, skor: 38, sira: [2, 2]},
  ];
  const skorRenk = (s: number) => s >= 70 ? yesil : s >= 45 ? sari : '#9a9aa2';
  const pinler: [number, number, number][] = [[140, 120, 12], [330, 80, 18], [470, 190, 24], [250, 230, 30], [560, 100, 36]];
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Müşteri adayı bul" alt="Çankaya · haritadan tara" />
        <svg width={680} height={310} viewBox="0 0 680 310" style={{display: 'block'}}>
          <rect width={680} height={310} fill="#141418" />
          {[[0, 70, 680, 120], [0, 220, 680, 180], [120, 0, 200, 310], [420, 0, 380, 310], [560, 0, 640, 310]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#2c2c34" strokeWidth={i % 2 ? 14 : 22} />)}
          {pinler.map(([x, y, f], i) => {
            const g = sp(frame - f, 30, 8, 260);
            const ozel = i === 2 && one;
            return <g key={i} transform={`translate(${x} ${y - (1 - g) * 40}) scale(${g * (ozel ? 1.3 : 1)})`} opacity={g}>
              <path d="M0 0 C -18 -26 -18 -46 0 -50 C 18 -46 18 -26 0 0 Z" fill={ozel ? yesil : renk.kirmizi} transform="translate(0 0) scale(1.1)" />
              <circle cx={0} cy={-36} r={7} fill="#fff" />
            </g>;
          })}
        </svg>
        <div style={{position: 'relative', margin: '18px 30px 0', height: 520}}>
          {adaylar.map((a, i) => {
            const g = sp(frame - 40 - i * 6, 30, 12, 200);
            const y = interpolate(tasi, [0, 1], [a.sira[0], a.sira[1]]) * 168;
            const ozel = a.skor >= 70 && one;
            return <div key={a.ad} style={{position: 'absolute', left: 0, right: 0, top: y, opacity: g, transform: `translateY(${(1 - g) * 60}px) scale(${ozel ? 1 + 0.03 * Math.sin(frame / 4) : 1})`, zIndex: ozel ? 2 : 1}}>
              <Kart style={{border: `3px solid ${ozel ? yesil : '#2a2a30'}`, boxShadow: ozel ? `0 0 50px ${yesil}60` : 'none'}}>
                <div style={{fontSize: 32, fontWeight: 800}}>{a.ad}</div>
                <div style={{fontSize: 22, opacity: 0.6, marginTop: 4}}>★ {a.puan} · {a.yorum} yorum</div>
                <div style={{display: 'flex', gap: 10, marginTop: 10}}>
                  <Rozet renkKod={skorRenk(a.skor)}>Fırsat {a.skor}</Rozet>
                  <Rozet renkKod={bilgi}>{a.sektor}</Rozet>
                </div>
              </Kart>
            </div>;
          })}
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="01" metin="ADAY BUL" />
  </>;
};

// Hızlı Arama — sonucu tek dokunuşla kaydet; kurallar.ts: Teklif istedi → aşama Teklif, ilgi sıcak, görev
const sonuclar = ['Ulaşılamadı', 'Meşgul', 'Geri ara', 'İlgilenmedi', 'İlgilendi', 'Toplantı ayarlandı', 'Teklif istedi'];
const NArama: React.FC = () => {
  const frame = useCurrentFrame();
  const bitti = frame >= 14;
  const sn = 128 + Math.min(frame, 14);
  const sure = `${String(Math.floor(sn / 60)).padStart(2, '0')}:${String(sn % 60).padStart(2, '0')}`;
  const secili = frame >= 69;
  const sonuc = frame >= 96;
  const satir = (f: number, et: string, deger: React.ReactNode) => frame >= f && <div style={{opacity: sp(frame - f, 30), transform: `translateX(${(1 - sp(frame - f, 30)) * 60}px)`}}><Satir et={et}>{deger}</Satir></div>;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Hızlı Arama" alt="Sonucu tek dokunuşla kaydedin" />
        <div style={{padding: '20px 30px'}}>
          <Kart style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div><div style={{fontSize: 34, fontWeight: 800}}>Örnek eğitim</div><div style={{fontSize: 24, opacity: 0.6, marginTop: 4}}>{bitti ? `Arama bitti · ${sure}` : `Aranıyor · ${sure}`}</div></div>
            <div style={{width: 96, height: 96, borderRadius: 48, background: bitti ? '#3a3a42' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, transform: `scale(${1 - 0.12 * interpolate(frame, [12, 14, 18], [0, 1, 0], cl)})`}}>📞</div>
          </Kart>
          {frame >= 28 && !sonuc && <div style={{marginTop: 22, opacity: interpolate(frame, [88, 96], [1, 0], cl)}}>
            <div style={{fontSize: 30, fontWeight: 800, marginBottom: 14}}>📞 Sonuç</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
              {sonuclar.map((s, i) => {
                const g = sp(frame - 28 - i * 2, 30, 12, 220);
                const bu = s === 'Teklif istedi' && secili;
                return <div key={s} style={{height: 86, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, background: bu ? asamaRenk('Teklif') : '#1d1d22', color: bu ? '#fff' : '#ccc', border: '2px solid #2a2a30', opacity: g, transform: `scale(${(0.8 + 0.2 * g) * (bu ? 1 + 0.1 * (1 - sp(frame - 69, 30, 8, 260)) : 1)})`}}>{s}</div>;
              })}
            </div>
          </div>}
          {sonuc && <div style={{marginTop: 22}}>
            <div style={{fontSize: 26, opacity: 0.6, marginBottom: 6}}>Sonuç kaydedildi: Teklif istedi</div>
            {satir(98, 'Aşama', <Rozet renkKod={asamaRenk('Teklif')} style={{fontSize: 26}}>Teklif</Rozet>)}
            {satir(104, 'İlgi', <Rozet renkKod="#ef4444" style={{fontSize: 26}}>Sıcak</Rozet>)}
            {frame >= 110 && <Kart style={{marginTop: 22, border: `3px solid ${yesil}`, boxShadow: `0 0 50px ${yesil}40`, transform: `scale(${0.8 + 0.2 * sp(frame - 110, 30, 9, 220)})`, opacity: sp(frame - 110, 30)}}>
              <div style={{fontSize: 22, color: yesil, fontWeight: 800}}>✓ YENİ GÖREV</div>
              <div style={{fontSize: 34, fontWeight: 800, marginTop: 6}}>Teklif hazırla ve gönder</div>
              <div style={{fontSize: 24, opacity: 0.6, marginTop: 4}}>Örnek eğitim · Yarın</div>
            </Kart>}
          </div>}
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 2 && frame < 18 && <Parmak x={720} y={420} />}
    {frame >= 56 && frame < 80 && <Parmak x={330} y={1130} />}
    <Bolum no="02" metin="TEK DOKUNUŞ" />
  </>;
};

// Satış Hunisi — Huni.tsx kanban, aşama renkleri sabitler.ts
const huniKartlari: Record<string, [string, string][]> = {
  Yeni: [['Örnek etkinlik', 'Etkinlik'], ['Örnek mimarlık', 'Mimarlık']],
  Arandı: [['Örnek oto galeri', 'Oto galeri']],
  Görüşüldü: [],
  İlgili: [['Örnek kafe', 'Kafe']],
  Toplantı: [],
  Teklif: [['Örnek eğitim', 'Eğitim']],
  Kazanıldı: [['Örnek restoran', 'Restoran']],
  Kaybedildi: [['Örnek otel', 'Otel']],
};
const NHuni: React.FC = () => {
  const frame = useCurrentFrame();
  const kolon = 250;
  const aralik = 14;
  const toplam = asamalar.length * (kolon + aralik);
  const kaydir = interpolate(frame, [14, 70], [0, toplam - 640], {...cl, easing: Easing.inOut(Easing.cubic)});
  const zoom = sp(frame - 78, 30, 14, 140);
  const olcek = 1 - (1 - 640 / toplam) * zoom;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Satış Hunisi" alt="8 aşama · 7 firma" />
        <div style={{padding: '22px 30px', overflow: 'hidden'}}>
          <div style={{display: 'flex', gap: aralik, width: toplam, transform: `translateX(${-kaydir * (1 - zoom)}px) scale(${olcek})`, transformOrigin: 'left top'}}>
            {asamalar.map(([ad, c], i) => {
              const kartlar = huniKartlari[ad];
              const g = sp(frame - i * 3, 30, 12, 200);
              return <div key={ad} style={{width: kolon, flexShrink: 0, minHeight: 720, borderRadius: 22, background: '#121216', border: `2px solid ${c}55`, padding: 14, opacity: g, boxShadow: zoom > 0.5 ? `0 0 30px ${c}50` : 'none'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 800, paddingBottom: 12, borderBottom: `3px solid ${c}`}}>
                  <span style={{width: 16, height: 16, borderRadius: 8, background: c}} />{ad}<span style={{marginLeft: 'auto', opacity: 0.6}}>{kartlar.length}</span>
                </div>
                {kartlar.length === 0 && <div style={{marginTop: 14, height: 90, borderRadius: 16, border: '2px dashed #333'}} />}
                {kartlar.map(([f, s]) => <div key={f} style={{marginTop: 14, padding: '16px 16px', borderRadius: 16, background: '#1d1d22', borderLeft: `6px solid ${c}`}}>
                  <div style={{fontSize: 24, fontWeight: 800, lineHeight: 1.2}}>{f}</div>
                  <div style={{fontSize: 20, opacity: 0.55, marginTop: 4}}>{s}</div>
                </div>)}
              </div>;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="03" metin="SATIŞ HUNİSİ" />
  </>;
};

// Takip zinciri — VARSAYILAN_ZINCIRLER "İlgilendi → sıcak tut"
const NZincir: React.FC = () => {
  const frame = useCurrentFrame();
  const secili = frame >= 8;
  const zincir = frame >= 42;
  const adimlar: [string, string, number][] = [['💬 Örnek işlerimizi gönder', '1. gün · 11:00', 92], ['📞 Takip araması', '4. gün', 98], ['📞 Toplantı için tekrar ara', '10. gün', 116]];
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Örnek kafe" alt="Arama sonucu" />
        <div style={{padding: '20px 30px'}}>
          <div style={{display: 'flex', gap: 12}}>
            {['Geri ara', 'İlgilendi', 'İlgilenmedi'].map((s) => {
              const bu = s === 'İlgilendi' && secili;
              return <div key={s} style={{flex: 1, height: 84, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, background: bu ? yesil : '#1d1d22', color: bu ? '#fff' : '#bbb', transform: `scale(${bu ? 1 + 0.1 * (1 - sp(frame - 8, 30, 8, 260)) : 1})`}}>{s}</div>;
            })}
          </div>
          {zincir && <Kart style={{marginTop: 24, border: `3px solid ${asamaRenk('İlgili')}`, boxShadow: `0 0 50px ${asamaRenk('İlgili')}40`, transform: `translateY(${(1 - sp(frame - 42, 30, 12, 180)) * 200}px)`, opacity: sp(frame - 42, 30)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{fontSize: 24, opacity: 0.7, fontWeight: 800}}>⛓ TAKİP ZİNCİRİ</div>
              <Rozet renkKod={yesil}>Başladı</Rozet>
            </div>
            <div style={{fontSize: 36, fontWeight: 800, marginTop: 8}}>İlgilendi → sıcak tut</div>
            <div style={{position: 'relative', marginTop: 18, paddingLeft: 46}}>
              <div style={{position: 'absolute', left: 15, top: 20, width: 4, height: interpolate(frame, [92, 124], [0, 236], cl), background: asamaRenk('İlgili')}} />
              {adimlar.map(([b, z, f]) => {
                const g = sp(frame - f, 30, 10, 220);
                return <div key={b} style={{position: 'relative', height: 118, opacity: frame >= f ? g : 0.15}}>
                  <div style={{position: 'absolute', left: -46, top: 12, width: 34, height: 34, borderRadius: 17, background: frame >= f ? asamaRenk('İlgili') : '#333', transform: `scale(${frame >= f ? 0.7 + 0.3 * g : 1})`}} />
                  <div style={{fontSize: 30, fontWeight: 800}}>{b}</div>
                  <div style={{fontSize: 24, opacity: 0.6, marginTop: 4}}>Görev · {z}</div>
                </div>;
              })}
            </div>
          </Kart>}
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame < 22 && <Parmak x={470} y={600} />}
    <Bolum no="04" metin="TAKİP ZİNCİRİ" />
  </>;
};

// Pano — OncelikListesi "Bugün önce bunları ara", skor.ts nedenleri, "Günlük arama hedefi"
const NBugun: React.FC = () => {
  const frame = useCurrentFrame();
  const hazir = frame >= 61;
  const liste: [string, string[], number][] = [['Örnek eğitim', ['Sıcak müşteri', 'Teklif aşamasında'], 30], ['Örnek kafe', ['Takip günü geldi', 'Ilık müşteri'], 36], ['Örnek oto galeri', ['30 gündür temas yok'], 42]];
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Pano" alt="Günaydın" />
        <div style={{padding: '20px 30px'}}>
          <Kart>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26}}><span style={{opacity: 0.7}}>Günlük arama hedefi</span><b>0 / 20</b></div>
            <div style={{marginTop: 12, height: 12, borderRadius: 6, background: '#2a2a30'}} />
          </Kart>
          <Kart style={{marginTop: 18, border: `3px solid ${hazir ? renk.kirmizi : '#2a2a30'}`, boxShadow: hazir ? `0 0 50px ${renk.kirmizi}50` : 'none'}}>
            <div style={{fontSize: 30, fontWeight: 800}}>🎯 Bugün önce bunları ara</div>
            {liste.map(([ad, nedenler, f], i) => {
              const g = sp(frame - f, 30, 11, 220);
              return <div key={ad} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderTop: i ? '1px solid #2a2a30' : 'none', marginTop: i ? 0 : 10, opacity: g, transform: `translateX(${(1 - g) * 80}px)`}}>
                <div style={{width: 50, height: 50, borderRadius: 25, background: renk.kirmizi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, flexShrink: 0}}>{i + 1}</div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 30, fontWeight: 800}}>{ad}</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8}}>{nedenler.map((n) => <Rozet key={n} renkKod={sari} style={{fontSize: 19, padding: '4px 12px'}}>{n}</Rozet>)}</div>
                </div>
                <div style={{width: 70, height: 70, borderRadius: 35, background: yesil, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0}}>📞</div>
              </div>;
            })}
          </Kart>
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="05" metin="BUGÜN" />
  </>;
};

// Teklif — TeklifDuzenle.tsx PDF + "WhatsApp ile gönder"; tutar gösterilmez
const NTeklif: React.FC = () => {
  const frame = useCurrentFrame();
  const gitti = frame >= 94;
  const kalem = (f: number, w: number) => <div style={{height: 18, width: w, borderRadius: 9, background: '#d6d6dc', marginTop: 16, opacity: interpolate(frame, [f, f + 6], [0, 1], cl)}} />;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Teklif #12" alt="Örnek eğitim" />
        <div style={{padding: '20px 30px'}}>
          <div style={{position: 'relative', height: 420, borderRadius: 14, background: '#fff', color: '#222', padding: '30px 34px', boxShadow: '0 20px 60px #000', transform: `scale(${0.9 + 0.1 * sp(frame - 2, 30)})`}}>
            <div style={{position: 'absolute', right: 24, top: 24, background: renk.kirmizi, color: '#fff', fontSize: 24, fontWeight: 800, padding: '6px 14px', borderRadius: 8}}>PDF</div>
            <div style={{fontSize: 40, fontWeight: 800, letterSpacing: 4}}>TEKLİF</div>
            <div style={{fontSize: 24, opacity: 0.6, marginTop: 4}}>No: 12 · Örnek eğitim</div>
            {kalem(8, 520)}{kalem(13, 440)}{kalem(18, 480)}{kalem(23, 360)}{kalem(28, 500)}
            <div style={{position: 'absolute', left: 34, right: 34, bottom: 30, height: 4, background: '#222', opacity: interpolate(frame, [32, 38], [0, 1], cl)}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, fontSize: 28}}>
            <span style={{opacity: 0.7}}>Durum</span>
            <Rozet renkKod={gitti ? bilgi : '#9a9aa2'} style={{fontSize: 26, transform: gitti ? `scale(${1.3 - 0.3 * sp(frame - 94, 30, 8, 260)})` : undefined}}>{gitti ? 'Gönderildi' : 'Taslak'}</Rozet>
          </div>
          <div style={{marginTop: 20, height: 96, borderRadius: 22, background: '#25D366', color: '#08240f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, transform: `scale(${1 - 0.06 * interpolate(frame, [72, 74, 80], [0, 1, 0], cl)})`}}>{frame >= 74 ? 'WhatsApp ile gönder ✓' : 'WhatsApp ile gönder'}</div>
          {frame >= 96 && <Kart style={{marginTop: 20, opacity: sp(frame - 96, 30), transform: `translateY(${(1 - sp(frame - 96, 30)) * 40}px)`}}>
            <div style={{fontSize: 22, opacity: 0.6}}>Aktivite</div>
            <div style={{fontSize: 26, fontWeight: 800, marginTop: 6}}>💬 12 numaralı teklif PDF'i WhatsApp ile gönderildi</div>
          </Kart>}
        </div>
      </AbsoluteFill>
    </Telefon>
    {frame >= 60 && frame < 84 && <Parmak x={520} y={1000} />}
    <Bolum no="06" metin="TEKLİF" />
  </>;
};

// Alacaklar — Alacaklar.tsx satırı + alacak.ts görev başlığı ve kademe 2 mesajı
const tahsilatMesaji = 'Merhaba Örnek restoran yetkilisi, ben Demo Firma ekibinden Can. 07.10.2026 vadeli 18.500 ₺ tutarındaki ödemeniz hakkında yazıyorum. Ödeme henüz kayıtlarımıza yansımadı. Planlanan ödeme tarihini iletmenizi rica ederiz. İyi çalışmalar.';
const NTahsilat: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [62, 100], [0, tahsilatMesaji.length], cl));
  const hazir = frame >= 83;
  return <>
    <Telefon>
      <AbsoluteFill style={{background: '#0b0b0d'}}>
        <UstBar baslik="Alacaklar" alt="Finans" />
        <div style={{padding: '18px 30px'}}>
          <div style={{fontSize: 28, fontWeight: 800, color: '#ef4444'}}>Gecikmiş alacaklar</div>
          <Kart style={{marginTop: 12, border: '3px solid #ef444480'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}><div style={{fontSize: 30, fontWeight: 800}}>Örnek restoran</div><b style={{fontSize: 30}}>{tl(18500)}</b></div>
            <div style={{fontSize: 22, marginTop: 6}}><span style={{opacity: 0.6}}>Aylık bakım hizmeti · Vade 07.10.2026 · </span><b style={{color: '#ef4444'}}>8 gün gecikti</b></div>
            <div style={{display: 'flex', gap: 10, marginTop: 14}}>{['WhatsApp', 'Tahsilat ekle', 'Vadeyi değiştir'].map((b) => <div key={b} style={{padding: '10px 16px', borderRadius: 14, background: '#25252b', fontSize: 22, fontWeight: 800}}>{b}</div>)}</div>
          </Kart>
          {frame >= 33 && <Kart style={{marginTop: 18, border: `3px solid ${yesil}`, transform: `translateX(${(1 - sp(frame - 33, 30, 11, 200)) * 600}px)`}}>
            <div style={{fontSize: 22, color: yesil, fontWeight: 800}}>✓ GÖREV AÇILDI</div>
            <div style={{fontSize: 27, fontWeight: 800, marginTop: 6, lineHeight: 1.3}}>Tahsilat: Örnek restoran — 18.500 ₺ (8 gün gecikti)</div>
          </Kart>}
          {frame >= 60 && <div style={{marginTop: 18, padding: '20px 24px', borderRadius: '26px 26px 8px 26px', background: '#1f3a2b', border: `2px solid ${hazir ? '#25D366' : '#2f5a42'}`, boxShadow: hazir ? '0 0 40px #25D36650' : 'none', opacity: sp(frame - 60, 30)}}>
            <div style={{fontSize: 20, fontWeight: 800, color: '#25D366', marginBottom: 6}}>WhatsApp mesaj taslağı{hazir ? ' · hazır ✓' : ''}</div>
            <div style={{fontSize: 22, lineHeight: 1.4}}>{tahsilatMesaji.slice(0, n)}<span style={{opacity: frame % 16 < 8 && n < tahsilatMesaji.length ? 1 : 0}}>|</span></div>
          </div>}
        </div>
      </AbsoluteFill>
    </Telefon>
    <Bolum no="07" metin="TAHSİLAT" />
  </>;
};

const Ozet: React.FC = () => {
  const frame = useCurrentFrame();
  const satirlar: [string, number, number][] = [['DAĞINIK NOT', 4, 25], ['UNUTULAN TAKİP', 43, 66], ['KAÇAN ÖDEME', 80, 104]];
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: yaziTipi, fontWeight: 800, gap: 46}}>
    {satirlar.map(([k, gel, yok]) => {
      const g = sp(frame - gel, 30, 10, 220);
      const y = frame >= yok;
      return <div key={k} style={{display: 'flex', alignItems: 'center', gap: 26, opacity: g, transform: `translateX(${(1 - g) * -200}px)`}}>
        <div style={{fontSize: 80, color: y ? '#ffffff70' : '#fff', textDecoration: y ? 'line-through' : 'none', textDecorationColor: renk.kirmizi, textDecorationThickness: 10, whiteSpace: 'nowrap'}}>{k}</div>
        {y && <div style={{fontSize: 66, color: '#fff', background: renk.kirmizi, padding: '4px 20px', transform: `scale(${2 - sp(frame - yok, 30, 8, 300)}) rotate(-6deg)`}}>YOK</div>}
      </div>;
    })}
    <div style={{marginTop: 30, fontSize: 44, letterSpacing: 8, color: yesil, opacity: interpolate(frame, [108, 114], [0, 1], cl)}}>NEXUS CRM İLE</div>
  </AbsoluteFill>;
};

const Dm: React.FC = () => {
  const frame = useCurrentFrame();
  const yazi = 'CRM';
  const n = Math.min(yazi.length, Math.max(0, Math.floor((frame - 8) / 3)));
  const gonder = frame >= 28;
  const b = sp(frame - 28, 30, 11, 220);
  return <Telefon>
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '90px 30px 26px', borderBottom: '1px solid #222'}}>
        <div style={{width: 80, height: 80, borderRadius: 40, background: '#000', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}><Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{width: 70}} /></div>
        <div><div style={{fontSize: 34, fontWeight: 800}}>nexusstudiocs</div><div style={{fontSize: 24, opacity: 0.6}}>Nexus Studio</div></div>
      </div>
      <div style={{position: 'absolute', top: 340, left: 40, right: 40, textAlign: 'center', fontSize: 34, opacity: 0.55, lineHeight: 1.4}}>Nexus CRM demosu için<br /><b style={{color: '#fff', opacity: 1, fontSize: 64}}>CRM</b><br />yazın.</div>
      {gonder && <div style={{position: 'absolute', right: 30, bottom: 200, background: 'linear-gradient(135deg, #C20D38, #941F38)', borderRadius: 40, padding: '24px 40px', fontSize: 48, fontWeight: 800, transform: `scale(${b})`, transformOrigin: 'bottom right'}}>CRM</div>}
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
      <div style={{fontSize: 40, fontWeight: 800, letterSpacing: 6, opacity: 0.8}}>NEXUS CRM · NEXUS STUDIO</div>
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

const sira: [number, React.FC][] = [[sahne.kanca, Kanca], [sahne.daginik, Daginik], [sahne.teklif, TeklifSorun], [sahne.odeme, OdemeSorun], [sahne.duzen, Duzen], [sahne.nAday, NAday], [sahne.nArama, NArama], [sahne.nHuni, NHuni], [sahne.nZincir, NZincir], [sahne.nBugun, NBugun], [sahne.nTeklif, NTeklif], [sahne.nTahsilat, NTahsilat], [sahne.ozet, Ozet], [sahne.dm, Dm], [sahne.son, Son]];

const Ses: React.FC<{ad: string; at: number; v?: number}> = ({ad, at, v = 0.5}) => <Sequence from={at}><Audio src={sfxYolu(ad)} volume={v} /></Sequence>;

export const Reels07: React.FC = () => {
  const vurus = sahne.duzen + 37;
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    <Zemin />
    {sira.map(([bas, Bil], i) => {
      const bitis = i + 1 < sira.length ? sira[i + 1][0] : REELS07_SURE;
      return <Sequence key={i} from={bas} durationInFrames={bitis - bas}>{i === 0 ? <Bil /> : <Kesme><Bil /></Kesme>}</Sequence>;
    })}
    <Sequence durationInFrames={sahne.son}><Vizor /></Sequence>
    <Altyazi />
    <Gren />
    {seslendirme.map((v) => <Sequence key={v.dosya} from={v.at}><Audio src={staticFile(`${R}${v.dosya}.wav`)} volume={1} /></Sequence>)}
    {/* ses tasarımı: sorun kısmı saat + nabız gerilimi, Nexus CRM kısmı ritimli */}
    <Sequence durationInFrames={sahne.odeme + 2}><Audio src={sfxYolu('ortam--11325622-clock-ticking-sound-effect')} volume={0.35} loop /></Sequence>
    <Sequence from={sahne.daginik} durationInFrames={sahne.nAday - sahne.daginik}><Audio src={sfxYolu('dramatik--gerilim-droneu')} volume={0.22} loop /></Sequence>
    <Sequence from={sahne.daginik} durationInFrames={sahne.duzen - sahne.daginik}><Audio src={sfxYolu('dramatik--nabiz-hizli')} volume={0.25} loop /></Sequence>
    {Array.from({length: Math.floor((sahne.son - sahne.nAday) / 15)}).map((_, i) => <Ses key={`b${i}`} ad="vurgu--vurus-orta" at={sahne.nAday + i * 15} v={i % 2 === 0 ? 0.14 : 0.07} />)}
    <Sequence durationInFrames={sahne.daginik}><Audio src={sfxYolu('acilis--hook')} volume={0.4} /></Sequence>
    <Ses ad="bildirim--mesaj" at={24} v={0.45} />
    <Ses ad="vurgu--sub-dusus" at={67} v={0.55} />
    <Ses ad="dijital--glitch-kisa" at={69} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.daginik} />
    {[14, 47, 91, 131].map((f) => <Ses key={f} ad="metin--pop" at={sahne.daginik + f} v={0.35} />)}
    <Ses ad="bildirim--hata" at={sahne.daginik + 140} v={0.4} />
    <Ses ad="gecis--kagit-swipe" at={sahne.teklif} v={0.45} />
    {[16, 24, 32, 40, 48].map((f) => <Ses key={f} ad="metin--klik" at={sahne.teklif + f} v={0.22} />)}
    <Ses ad="vurgu--sub-dusus" at={sahne.teklif + 94} v={0.5} />
    <Ses ad="bildirim--hata" at={sahne.teklif + 96} v={0.4} />
    <Ses ad="gecis--kagit-swipe" at={sahne.odeme - 8} v={0.3} />
    <Ses ad="bildirim--basari" at={sahne.odeme + 6} v={0.3} />
    <Ses ad="bildirim--hata" at={sahne.odeme + 48} v={0.45} />
    <Ses ad="gecis--whoosh-sert" at={sahne.duzen} v={0.5} />
    <Ses ad="gecis--tape-stop" at={vurus - 14} v={0.35} />
    <Ses ad="vurgu--trailer-boom" at={vurus} v={0.45} />
    <Ses ad="dramatik--yukselen-kisa" at={sahne.nAday - 34} v={0.35} />
    <Ses ad="gecis--whoosh-uzun" at={sahne.nAday - 6} v={0.5} />
    {[12, 18, 24, 30, 36].map((f) => <Ses key={f} ad="metin--pop-yumusak" at={sahne.nAday + f} v={0.35} />)}
    <Ses ad="dijital--robot-bip" at={sahne.nAday + 54} v={0.25} />
    <Ses ad="bildirim--basari" at={sahne.nAday + 89} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nArama} />
    <Ses ad="metin--klik" at={sahne.nArama + 14} v={0.5} />
    <Ses ad="metin--klik" at={sahne.nArama + 69} v={0.5} />
    <Ses ad="bildirim--dragon-studio-correct" at={sahne.nArama + 110} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nHuni} />
    <Ses ad="gecis--whoosh-uzun" at={sahne.nHuni + 76} v={0.3} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nZincir} />
    <Ses ad="metin--klik" at={sahne.nZincir + 8} v={0.5} />
    <Ses ad="bildirim--mesaj" at={sahne.nZincir + 44} v={0.45} />
    {[92, 98, 116].map((f) => <Ses key={f} ad="bildirim--ding" at={sahne.nZincir + f} v={0.3} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.nBugun} />
    {[30, 36, 42].map((f) => <Ses key={f} ad="metin--pop-yumusak" at={sahne.nBugun + f} v={0.4} />)}
    <Ses ad="bildirim--basari" at={sahne.nBugun + 46} v={0.4} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nTeklif - 16} v={0.4} />
    {[24, 32].map((f) => <Ses key={f} ad="metin--pop-yumusak" at={sahne.nTeklif + f} v={0.12} />)}
    <Ses ad="metin--klik" at={sahne.nTeklif + 74} v={0.5} />
    <Ses ad="bildirim--mesaj" at={sahne.nTeklif + 94} v={0.5} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.nTahsilat} />
    <Ses ad="dramatik--alarm" at={sahne.nTahsilat + 4} v={0.14} />
    <Ses ad="metin--pop" at={sahne.nTahsilat + 33} v={0.4} />
    <Ses ad="metin--yazi-yazma" at={sahne.nTahsilat + 66} v={0.18} />
    <Ses ad="bildirim--ding" at={sahne.nTahsilat + 84} v={0.35} />
    <Ses ad="gecis--whoosh-kisa" at={sahne.ozet} />
    {[25, 66, 104].map((f) => <Ses key={f} ad="vurgu--vurus-orta" at={sahne.ozet + f} v={0.45} />)}
    <Ses ad="gecis--whoosh-kisa" at={sahne.dm - 8} v={0.4} />
    {[0, 1, 2].map((i) => <Ses key={i} ad="metin--tik-daktilo" at={sahne.dm + 8 + i * 3} v={0.15} />)}
    <Ses ad="bildirim--mesaj" at={sahne.dm + 28} v={0.6} />
    <Ses ad="vurgu--trailer-boom" at={sahne.son} v={0.5} />
  </AbsoluteFill>;
};
