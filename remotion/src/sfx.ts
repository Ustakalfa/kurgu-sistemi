import katalog from '../public/sfx/katalog.json';
import {staticFile} from 'remotion';

export type SfxKaydi = (typeof katalog)[number];
export const sfxKatalogu: readonly SfxKaydi[] = katalog;
export const sfxYolu = (ad: string): string => {
  const kayit = sfxKatalogu.find((item) => item.dosya === `sfx/${ad}.wav`);
  if (!kayit) throw new Error(`Ses efekti katalogda bulunamadı: ${ad}`);
  return staticFile(kayit.dosya);
};
