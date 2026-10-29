import React from 'react';
import {Audio, Video} from '@remotion/media';
import {AbsoluteFill, Img, spring, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {sfxYolu} from './sfx';
import {Kapanis} from './NexusTanitim';
import {renk, yaziTipi} from './marka';

export type Altyazi = {metin: string; baslangicMs: number; bitisMs: number};
export type AltyaziliProps = {video: string; altyazilar: Altyazi[]; sureSn: number; sfxOlaylari?: {ad: string; ms: number; seviye?: number}[]};
export const varsayilanAltyazili: AltyaziliProps = {video: '', altyazilar: [], sureSn: 10};
export const altyaziliSuresi = (p: AltyaziliProps) => Math.ceil(Math.max(0, p.sureSn) * 30) + 60;

export const NexusAltyazili: React.FC<AltyaziliProps> = ({video, altyazilar, sureSn, sfxOlaylari = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const videoFrames = Math.ceil(Math.max(0, sureSn) * fps);
  const efektler = <>{sfxOlaylari.map((olay, i) => {
    if (olay.ms < 0 || (olay.seviye ?? 1) < 0 || (olay.seviye ?? 1) > 1) throw new Error("SFX zamanı/seviyesi geçersiz");
    return <Sequence key={i} from={Math.round(olay.ms * fps / 1000)}><Audio src={sfxYolu(olay.ad)} volume={olay.seviye ?? 1} /></Sequence>;
  })}<Sequence from={videoFrames}><Audio src={sfxYolu('bildirim--basari')} volume={0.45} /></Sequence></>;
  if (frame >= videoFrames) return <><Kapanis />{efektler}</>;
  const ms = frame / fps * 1000;
  const active = altyazilar.find((a) => ms >= a.baslangicMs && ms < a.bitisMs);
  const entry = active ? Math.max(0, frame - Math.ceil(active.baslangicMs * fps / 1000)) : 0;
  const pop = spring({frame: entry, fps, config: {damping: 12, stiffness: 220}});
  return <AbsoluteFill style={{backgroundColor: renk.siyah, fontFamily: yaziTipi}}>
    {efektler}
    {video && <Video src={staticFile(video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
    <Img src={staticFile('logo/nexus-bordo-beyaz.webp')} style={{position: 'absolute', top: 65, right: 55, width: 155, opacity: 0.58}} />
    {active && <div style={{position: 'absolute', left: 65, right: 65, bottom: 300, textAlign: 'center', color: renk.beyaz, fontSize: 69, lineHeight: 1.15, fontWeight: 800, WebkitTextStroke: '2px #09090B', textShadow: '0 4px 14px #000, 0 0 5px #000', transform: `scale(${0.84 + 0.16 * pop})`, opacity: pop, overflowWrap: 'anywhere'}}>{active.metin}</div>}
  </AbsoluteFill>;
};
