import React from 'react';
import {Composition} from 'remotion';
import {NexusTanitim, tanitimSuresi, varsayilanTanitim, type TanitimProps} from './NexusTanitim';
import {NexusSlaytReels, slaytReelsSuresi, varsayilanSlaytReels, type SlaytReelsProps} from './NexusSlaytReels';
import {Reels03, REELS03_SURE} from './Reels03';
import {Reels04, REELS04_SURE} from './Reels04';
import {Reels05, REELS05_SURE} from './Reels05';
import {Reels06, REELS06_SURE} from './Reels06';
import {Reels07, REELS07_SURE} from './Reels07';
import {Reels08, REELS08_SURE} from './Reels08';
import {NexusAltyazili, altyaziliSuresi, varsayilanAltyazili, type AltyaziliProps} from './NexusAltyazili';
import {KiyasI1, KiyasI2, KiyasI3, KiyasI4, KIYAS_SURE} from './kiyas/Kiyas';

export const RemotionRoot: React.FC = () => <>
  <Composition id="NexusTanitim" component={NexusTanitim} width={1080} height={1920} fps={30} durationInFrames={tanitimSuresi(varsayilanTanitim)} defaultProps={varsayilanTanitim} calculateMetadata={({props}) => ({durationInFrames: tanitimSuresi(props as TanitimProps)})} />
  <Composition id="NexusTanitimKare" component={NexusTanitim} width={1080} height={1080} fps={30} durationInFrames={tanitimSuresi(varsayilanTanitim)} defaultProps={varsayilanTanitim} calculateMetadata={({props}) => ({durationInFrames: tanitimSuresi(props as TanitimProps)})} />
  <Composition id="NexusAltyazili" component={NexusAltyazili} width={1080} height={1920} fps={30} durationInFrames={altyaziliSuresi(varsayilanAltyazili)} defaultProps={varsayilanAltyazili} calculateMetadata={({props}) => ({durationInFrames: altyaziliSuresi(props as AltyaziliProps)})} />
  <Composition id="NexusSlaytReels" component={NexusSlaytReels} width={1080} height={1920} fps={30} durationInFrames={slaytReelsSuresi(varsayilanSlaytReels)} defaultProps={varsayilanSlaytReels} calculateMetadata={({props}) => ({durationInFrames: slaytReelsSuresi(props as SlaytReelsProps)})} />
  <Composition id="Reels03" component={Reels03} width={1080} height={1920} fps={30} durationInFrames={REELS03_SURE} />
  <Composition id="Reels04" component={Reels04} width={1080} height={1920} fps={30} durationInFrames={REELS04_SURE} />
  <Composition id="Reels05" component={Reels05} width={1080} height={1920} fps={30} durationInFrames={REELS05_SURE} />
      <Composition id="Reels06" component={Reels06} width={1080} height={1920} fps={30} durationInFrames={REELS06_SURE} />
      <Composition id="Reels07" component={Reels07} width={1080} height={1920} fps={30} durationInFrames={REELS07_SURE} />
      <Composition id="Reels08" component={Reels08} width={1080} height={1920} fps={30} durationInFrames={REELS08_SURE} />
  <Composition id="KiyasI1" component={KiyasI1} width={3840} height={2160} fps={25} durationInFrames={KIYAS_SURE} />
  <Composition id="KiyasI2" component={KiyasI2} width={3840} height={2160} fps={25} durationInFrames={KIYAS_SURE} />
  <Composition id="KiyasI3" component={KiyasI3} width={3840} height={2160} fps={25} durationInFrames={KIYAS_SURE} />
  <Composition id="KiyasI4" component={KiyasI4} width={3840} height={2160} fps={25} durationInFrames={KIYAS_SURE} />
</>;
