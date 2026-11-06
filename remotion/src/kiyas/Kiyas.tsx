import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const O = '#F58220';
const W = '#F6F2EC';
const font = 'Montserrat, sans-serif';
export const KIYAS_SURE = 150;

const fade = (f: number) => interpolate(f, [0, 15, 130, 149], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Glass: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => <div style={{background:'linear-gradient(135deg,rgba(38,49,64,.76),rgba(12,18,29,.56))',border:'2px solid rgba(255,255,255,.18)',boxShadow:'0 28px 80px rgba(0,0,0,.3),inset 0 1px rgba(255,255,255,.22)',backdropFilter:'blur(28px)',borderRadius:38,...style}}>{children}</div>;

export const KiyasI1: React.FC = () => {
  const f=useCurrentFrame(); const p=spring({frame:f-3,fps:25,config:{damping:18,stiffness:120,mass:.8}});
  return <AbsoluteFill style={{fontFamily:font,opacity:fade(f)}}>
    <Glass style={{position:'absolute',left:180,bottom:170,width:1780,height:330,overflow:'hidden',transform:`translateY(${(1-p)*110}px)`}}>
      <div style={{position:'absolute',inset:'0 auto 0 0',width:16,background:O,transform:`scaleY(${p})`}}/>
      <div style={{padding:'65px 86px'}}><div style={{fontSize:104,fontWeight:800,color:W,letterSpacing:-2}}>Konuk Adı</div><div style={{fontSize:54,fontWeight:500,color:'rgba(246,242,236,.82)',marginTop:14}}>Örnek Program · Cumartesi Buluşması</div></div>
      <div style={{position:'absolute',top:-130,left:-260,width:520,height:700,transform:`translateX(${f*16}px) rotate(18deg)`,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent)'}}/>
    </Glass>
  </AbsoluteFill>;
};

const words=[['Dert',0],['aslında',13],['bizim',25],['odağımızı',36],['belirleyen',54],['şeydir.',71]] as const;
export const KiyasI2: React.FC = () => {const f=useCurrentFrame(); return <AbsoluteFill style={{fontFamily:font,alignItems:'flex-end',justifyContent:'center',paddingRight:210,boxSizing:'border-box',opacity:fade(f)}}>
  <Glass style={{width:2460,padding:'86px 110px',boxSizing:'border-box',overflow:'hidden'}}>
    <div style={{fontSize:120,fontWeight:800,lineHeight:1.35,whiteSpace:'normal',textAlign:'left',letterSpacing:-2,color:W}}>{words.map(([w,t],i)=>{const q=interpolate(f,[t,t+8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});const hot=i===3&&f>=t&&f<t+28;return <React.Fragment key={w}><span style={{display:'inline-block',opacity:q,transform:`translateY(${(1-q)*42}px)`,filter:`blur(${(1-q)*12}px)`,color:i===3?O:W,textShadow:hot?'0 0 18px #F58220,0 0 52px rgba(245,130,32,.75)':'none'}}>{w}</span>{i<words.length-1?' ':''}</React.Fragment>})}</div>
  </Glass>
  <div style={{position:'absolute',right:165,top:520,width:8,height:1120,background:O,boxShadow:'0 0 38px #F58220'}}/>
  </AbsoluteFill>};

const Grain:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{opacity:.13,mixBlendMode:'screen',backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' seed='${f%9}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E")`}}/>};
export const KiyasI3:React.FC=()=>{const f=useCurrentFrame();const line=interpolate(f,[46,96],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});return <AbsoluteFill style={{background:'#080A12',fontFamily:font,overflow:'hidden'}}>
  <div style={{position:'absolute',inset:-500,background:`radial-gradient(circle at ${25+f*.12}% 42%,rgba(93,48,91,.42),transparent 27%),radial-gradient(circle at ${75-f*.08}% 58%,rgba(245,130,32,.25),transparent 25%)`,filter:'blur(55px)'}}/>
  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',gap:72}}>{'DERT'.split('').map((c,i)=>{const q=interpolate(f,[12+i*7,46+i*7],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});return <span key={c+i} style={{fontSize:430,fontWeight:800,color:W,opacity:q,transform:`translateY(${(1-q)*130}px) scale(${.88+.12*q})`,filter:`blur(${(1-q)*16}px)`,letterSpacing:8}}>{c}</span>})}</div>
  <div style={{position:'absolute',left:820,right:820,top:1435,height:7,background:O,transformOrigin:'left',transform:`scaleX(${line})`,boxShadow:'0 0 30px rgba(245,130,32,.8)'}}/>
  <div style={{position:'absolute',top:0,bottom:0,width:780,left:interpolate(f,[50,112],[-900,4100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),transform:'skewX(-18deg)',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',filter:'blur(22px)'}}/>
  <Grain/>
  </AbsoluteFill>};

export const KiyasI4:React.FC=()=>{const f=useCurrentFrame();const items=['Zihin','+','Kalp','=','Dert'];return <AbsoluteFill style={{fontFamily:font,justifyContent:'center',paddingLeft:150,boxSizing:'border-box',opacity:fade(f)}}><Glass style={{width:'45%',height:760,display:'flex',alignItems:'center',justifyContent:'center',gap:42,padding:70,boxSizing:'border-box'}}>{items.map((x,i)=>{const q=spring({frame:f-8-i*10,fps:25,config:{damping:12,stiffness:115,mass:.8}});return <span key={x+i} style={{fontSize:x.length>1?112:92,fontWeight:800,color:x==='Dert'?O:W,opacity:q,transform:`translateY(${(1-q)*90}px) scale(${.7+.3*q})`,textShadow:x==='Dert'?'0 0 34px rgba(245,130,32,.65)':'none'}}>{x}</span>})}</Glass></AbsoluteFill>};
