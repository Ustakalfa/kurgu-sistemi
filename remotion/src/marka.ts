import {loadFont} from '@remotion/google-fonts/Montserrat';

export const renk = {
  bordo: '#941F38',
  kirmizi: '#C20D38',
  antrasit: '#2B2A2E',
  siyah: '#09090B',
  beyaz: '#FFFFFF',
} as const;

export const iletisim = {telefon: '0 553 988 70 62', instagram: '@nexusstudiocs'} as const;
export const yaziTipi = loadFont('normal', {weights: ['600', '800'], subsets: ['latin', 'latin-ext']}).fontFamily;
