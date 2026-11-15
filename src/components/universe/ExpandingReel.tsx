'use client';
import { useLayoutEffect, useRef, useState, type RefObject, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Instagram, Play, X } from 'lucide-react';

export default function ExpandingReel({origin,onClose}:{origin:RefObject<HTMLDivElement|null>;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),video=useRef<HTMLVideoElement>(null),closing=useRef(false);
 const [settled,setSettled]=useState(false),[blocked,setBlocked]=useState(false);
 const close=()=>{
  if(closing.current)return;closing.current=true;video.current?.pause();
  const panel=dialog.current,source=origin.current;if(!panel||!source){onClose();return;}
  const from=panel.getBoundingClientRect(),to=source.getBoundingClientRect();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  panel.animate([{transform:'none',opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`,opacity:.7}],{duration:reduced?0:480,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}).finished.then(onClose).catch(()=>{});
 };
 useLayoutEffect(()=>{
  const panel=dialog.current,source=origin.current;if(!panel||!source)return;
  const from=source.getBoundingClientRect();panel.showModal();
  const to=panel.getBoundingClientRect(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // This runs synchronously within the Play gesture (flushSync at the trigger),
  // so audible playback is requested before animation promises lose activation.
  const player=video.current;
  if(player){player.muted=false;void player.play().catch(()=>setBlocked(true));}
  const originalVisibility=source.style.visibility;source.style.visibility='hidden';
  const dx=from.left-to.left,dy=from.top-to.top,sx=from.width/to.width,sy=from.height/to.height;
  const animation=panel.animate([
   {transform:`perspective(1400px) translate3d(${dx}px,${dy}px,0) scale(${sx},${sy}) rotateY(0deg) rotateZ(0deg)`,borderRadius:'19px',offset:0,easing:'cubic-bezier(.4,0,.3,1)'},
   {transform:`perspective(1400px) translate3d(${dx*.62}px,${dy*.6-28}px,95px) scale(${sx+(1-sx)*.42},${sy+(1-sy)*.42}) rotateY(-24deg) rotateX(8deg) rotateZ(-4deg)`,borderRadius:'28px',offset:.36,easing:'cubic-bezier(.16,.8,.25,1)'},
   {transform:'perspective(1400px) translate3d(0,-8px,35px) scale(1.015) rotateY(5deg) rotateX(-2deg) rotateZ(1deg)',borderRadius:'22px',offset:.76,easing:'ease-out'},
   {transform:'perspective(1400px) translate3d(0,0,0) scale(1) rotateY(0deg) rotateX(0deg) rotateZ(0deg)',borderRadius:'22px',offset:1}
  ],{duration:reduced?0:1150,fill:'both'});
  let cancelled=false;
  animation.finished.then(()=>{if(cancelled)return;setSettled(true);}).catch(()=>{});
  return()=>{cancelled=true;animation.cancel();source.style.visibility=originalVisibility;panel.close();};
 },[origin]);
 return createPortal(<dialog ref={dialog} className="reel-cinema" aria-label="DigiBuzz behind the scenes video" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}}}>
  <div className="reel-particle-shell" aria-hidden="true">{Array.from({length:64},(_,i)=>{const theta=i*2.399963,r=Math.sqrt((i+.5)/64)*48;return <i key={i} style={{'--px':`${50+Math.cos(theta)*r}%`,'--py':`${50+Math.sin(theta)*r}%`,'--dx':`${Math.cos(theta)*240}px`,'--dy':`${Math.sin(theta)*280}px`,'--delay':`${(i%8)*22}ms`} as CSSProperties}/>})}<span/><span/><span/></div>
  <header><span>BEHIND THE SCENES</span><button autoFocus onClick={close} aria-label="Close video"><X size={20}/></button></header>
  <video ref={video} src="/videos/behind-the-scenes.mp4" poster="/images/reels/DebA_yyAonB.jpg" controls={settled} playsInline preload="metadata" aria-label="DigiBuzz team behind the scenes"/>
  {blocked&&<button className="reel-start-sound" onClick={()=>{void video.current?.play().then(()=>setBlocked(false)).catch(()=>{});}}><Play size={20}/> Play video with sound</button>}
  <footer><span>DIGIBUZZ · BEHIND THE SCENES</span><a href="https://www.instagram.com/reel/DebA_yyAonB/" target="_blank" rel="noreferrer"><Instagram size={15}/> Open in Instagram <ArrowUpRight size={15}/></a></footer>
 </dialog>,document.body);
}
