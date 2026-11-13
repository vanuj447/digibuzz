'use client';
import { useEffect, useState } from 'react';
import { Brand } from '../Shell';
/** Brand and sculpture share one opening, then dock into the actual website. */
export default function Startup({ready,onComplete}:{ready:boolean;onComplete:()=>void}){
 const [leaving,setLeaving]=useState(false),[closed,setClosed]=useState(false);
 useEffect(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)return;const frame=requestAnimationFrame(()=>{setClosed(true);onComplete()});return()=>cancelAnimationFrame(frame)},[onComplete]);
 // Start the hold only after the first rendered WebGL frame, not during shader loading.
 useEffect(()=>{if(!ready||closed)return;const timer=setTimeout(()=>setLeaving(true),4200);return()=>clearTimeout(timer)},[ready,closed]);
 useEffect(()=>{if(!leaving)return;onComplete();const timer=setTimeout(()=>setClosed(true),1400);return()=>clearTimeout(timer)},[leaving,onComplete]);
 useEffect(()=>{if(closed)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[closed]);
 if(closed)return null;
 return <div className={`brand-opening ${ready?'brand-ready':''} ${leaving?'brand-departing':''}`} aria-label="DigiBuzz opening animation"><div className="brand-opening-logo" role="img" aria-label="DigiBuzz Marketing"><Brand/></div><div className="brand-opening-progress" role="status" aria-label={ready?'Opening DigiBuzz':'Loading DigiBuzz'}><i/></div><button className="brand-opening-skip" onClick={()=>setLeaving(true)}>Skip intro ↗</button></div>;
}
