import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {sfxYolu} from './sfx';
import {Kapanis} from './NexusTanitim';
import {renk} from './marka';

// Hazır (yazısı basılı) 4:5 slaytları 9:16 Reels'e çevirir: üstüne yazı eklemez.
export type SlaytReelsProps = {slaytlar: string[]; sure?: number; sfx?: boolean; sfxSeviye?: number};
export const ILK = 20;
export const varsayilanSlaytReels: SlaytReelsProps = {slaytlar: []};
export const slaytReelsSuresi = (p: SlaytReelsProps) => ILK + p.slaytlar.length * (p.sure ?? 105) + 90;

export const NexusSlaytReels: React.FC<SlaytReelsProps> = ({slaytlar, sure = 105, sfx = true, sfxSeviye = 0.45}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const end = ILK + slaytlar.length * sure;
  return <AbsoluteFill style={{background: renk.siyah, overflow: 'hidden'}}>
    {slaytlar.map((s, i) => {
      const local = frame - ILK - i * sure;
      if (local < -10 || local >= sure + 10) return null;
      const opacity = interpolate(local, [-10, 4, sure - 6, sure + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const giris = spring({frame: Math.max(0, local), fps, config: {damping: 16, stiffness: 120}});
      const zoom = 1 + Math.max(0, local) * 0.0006;
      return <AbsoluteFill key={i} style={{opacity}}>
        <Img src={staticFile(s)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.35)', transform: 'scale(1.2)'}} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile(s)} style={{width: '100%', boxShadow: '0 30px 90px #000C', transform: `translateY(${(1 - giris) * 60}px) scale(${zoom})`}} />
        </AbsoluteFill>
        <div style={{position: 'absolute', left: 90, right: 90, bottom: 150, height: 6, background: '#FFFFFF22'}}>
          <div style={{height: '100%', width: `${((i + Math.min(1, Math.max(0, local) / sure)) / slaytlar.length) * 100}%`, background: renk.kirmizi}} />
        </div>
      </AbsoluteFill>;
    })}
    {frame >= end && <Kapanis />}
    {sfx && <>
      {slaytlar.map((_, i) => <Sequence key={i} from={ILK + i * sure - 4}><Audio src={sfxYolu('gecis--whoosh-yumusak')} volume={sfxSeviye} /></Sequence>)}
      <Sequence from={end}><Audio src={sfxYolu('bildirim--basari')} volume={sfxSeviye} /></Sequence>
    </>}
  </AbsoluteFill>;
};
