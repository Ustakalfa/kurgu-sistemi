import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {iletisim, renk, yaziTipi} from './marka';

export type Sahne = {baslik: string; alt?: string; gorsel?: string};
export type TanitimProps = {sahneler: Sahne[]; muzik?: string; dissSes?: string; sfx?: boolean; sfxSeviye?: number};
export const GIRIS = 45;
export const SAHNE = 90;
export const KAPANIS = 90;
export const tanitimSuresi = (p: TanitimProps) => GIRIS + p.sahneler.length * SAHNE + KAPANIS;
export const varsayilanTanitim: TanitimProps = {
  sahneler: [{baslik: 'Nexus Studio', alt: 'Hikâyenizi birlikte anlatalım.'}, {baslik: 'Yaratıcı içerikler', alt: 'Markanıza özel görsel anlatım.'}],
};

const logo = staticFile('logo/nexus-bordo-beyaz.webp');

export const Kapanis: React.FC = () => <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${renk.bordo}55, transparent 65%), ${renk.siyah}`, alignItems: 'center', justifyContent: 'center', color: renk.beyaz, fontFamily: yaziTipi}}>
  <Img src={logo} style={{width: '70%', maxWidth: 640, objectFit: 'contain'}} />
  <div style={{height: 4, width: 110, background: renk.kirmizi, margin: '32px 0'}} />
  <div style={{fontSize: 37, fontWeight: 600, marginBottom: 14}}>{iletisim.telefon}</div>
  <div style={{fontSize: 31, fontWeight: 600}}>{iletisim.instagram}</div>
</AbsoluteFill>;

export const NexusTanitim: React.FC<TanitimProps> = ({sahneler, muzik, dissSes, sfx = true, sfxSeviye = 0.45}) => {
  if (sfxSeviye < 0 || sfxSeviye > 1) throw new Error("sfxSeviye 0–1 arasında olmalı");
  const efektSeviyesi = sfxSeviye * (muzik || dissSes ? 0.7 : 1);
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const square = width === height;
  const end = GIRIS + sahneler.length * SAHNE;
  const logoIn = spring({frame, fps, config: {damping: 14, stiffness: 85}});
  const base: React.CSSProperties = {fontFamily: yaziTipi, color: renk.beyaz, overflow: 'hidden'};
  return <AbsoluteFill style={base}>
    <AbsoluteFill style={{background: `radial-gradient(circle at 75% 18%, ${renk.bordo}80, transparent 45%), linear-gradient(145deg, ${renk.antrasit}, ${renk.siyah})`}} />
    {frame < GIRIS && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: logoIn, transform: `scale(${0.72 + 0.28 * logoIn})`}}><Img src={logo} style={{width: '75%', objectFit: 'contain'}} /></AbsoluteFill>}
    {sahneler.map((s, i) => {
      const local = frame - GIRIS - i * SAHNE;
      if (local < -12 || local >= SAHNE + 12) return null;
      const opacity = interpolate(local, [-12, 0, 12, SAHNE - 12, SAHNE, SAHNE + 12], [0, 0, 1, 1, 0, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      return <AbsoluteFill key={i} style={{opacity}}>
        {s.gorsel && <Img src={staticFile(s.gorsel)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + Math.max(0, local) * 0.0007})`}} />}
        <AbsoluteFill style={{background: 'linear-gradient(0deg, #09090BFA 5%, #09090B78 55%, #09090B33 100%)'}} />
        <div style={{position: 'absolute', left: square ? 85 : 90, right: square ? 85 : 90, bottom: square ? 150 : 310}}>
          <div style={{width: 80, height: 7, background: renk.kirmizi, marginBottom: 35}} />
          <div style={{fontSize: square ? 66 : 84, fontWeight: 800, lineHeight: 1.06, overflowWrap: 'anywhere'}}>{s.baslik}</div>
          {s.alt && <div style={{fontSize: square ? 34 : 40, fontWeight: 600, lineHeight: 1.28, marginTop: 30}}>{s.alt}</div>}
        </div>
      </AbsoluteFill>;
    })}
    {frame >= end && <Kapanis />}
    {sfx && <>
      <Sequence from={0}><Audio src={sfxYolu('metin--parlama')} volume={efektSeviyesi} /></Sequence>
      {sahneler.map((_, i) => <React.Fragment key={i}>
        <Sequence from={GIRIS + i * SAHNE}><Audio src={sfxYolu('gecis--whoosh-yumusak')} volume={efektSeviyesi} /></Sequence>
        <Sequence from={GIRIS + i * SAHNE + 6}><Audio src={sfxYolu('metin--pop-yumusak')} volume={efektSeviyesi * 0.6} /></Sequence>
      </React.Fragment>)}
      <Sequence from={end}><Audio src={sfxYolu('bildirim--basari')} volume={efektSeviyesi} /></Sequence>
    </>}
    {muzik && <Audio src={staticFile(muzik)} volume={0.35} />}
    {dissSes && <Audio src={staticFile(dissSes)} />}
  </AbsoluteFill>;
};
