'use client';
import { useLayoutEffect, type RefObject } from 'react';

/** Sample a compact mask after the browser has laid out the new chapter. */
export default function ChapterEntrance({stage,panel,opened}:{stage:number;panel:RefObject<HTMLDivElement|null>;opened:boolean}){
 useLayoutEffect(()=>{
  const host=panel.current;
  if(!host||!opened||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const nodes=Array.from(host.querySelectorAll<HTMLElement>(stage===5?'.scene-heading,.client-orbit-card,.client-orbit-prev,.client-orbit-next,.client-orbit-caption':'[data-emerge],.enquiry-form'));
  // Opacity on the preserve-3d carousel itself flattens it until opacity reaches 1.
  const opacity=new Map(nodes.map(node=>[node,Number(getComputedStyle(node).opacity)]));
  const animations=nodes.map(node=>node.animate([{opacity:0,offset:0},{opacity:0,offset:.48},{opacity:opacity.get(node)??1,offset:1}],{duration:innerWidth<=760?850:1600,easing:'linear',fill:'backwards'}));
  let frame=0,cancelled=false;
  const assemble=()=>{
   if(cancelled)return;
   const width=innerWidth,height=innerHeight,scale=.5;
   if(stage===5||innerWidth<=760){
    // Analytic card outlines avoid a screen-sized canvas readback on galaxy entry.
    const targets:number[]=[];
    host.querySelectorAll<HTMLElement>(stage===5?'.client-orbit-card':'h1,h2,.service-sheet,.workflow-film-shell,.work-screen-active,.enquiry-form').forEach(card=>{
     if(stage===5&&Number(card.style.getPropertyValue('--orbit-opacity'))<.1)return;
     const r=card.getBoundingClientRect(),inset=12;
     for(let x=r.left+inset;x<r.right-inset;x+=5)targets.push(x,r.top,x,r.bottom);
     for(let y=r.top+inset;y<r.bottom-inset;y+=5)targets.push(r.left,y,r.right,y);
    });
    if(targets.length)window.dispatchEvent(new CustomEvent('digibuzz-assembly',{detail:{targets,width,height}}));
    return;
   }
   const canvas=document.createElement('canvas');canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);
   const ink=canvas.getContext('2d',{willReadFrequently:true});if(!ink)return;
   ink.scale(scale,scale);ink.fillStyle='#fff';ink.strokeStyle='#fff';ink.lineWidth=2;
   // Per-word ranges preserve line wrapping with far fewer layout measurements.
   host.querySelectorAll('h1,h2,.scene-label').forEach(label=>{
    const walker=document.createTreeWalker(label,NodeFilter.SHOW_TEXT);let text:Node|null;
    while((text=walker.nextNode())){
     const style=getComputedStyle(text.parentElement!);ink.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;ink.textBaseline='alphabetic';
     const metrics=ink.measureText('Hg'),ascent=metrics.fontBoundingBoxAscent||parseFloat(style.fontSize)*.8,descent=metrics.fontBoundingBoxDescent||parseFloat(style.fontSize)*.2;
     for(const match of (text.textContent||'').matchAll(/\S+/g)){
      const range=document.createRange();range.setStart(text,match.index!);range.setEnd(text,match.index!+match[0].length);const r=range.getBoundingClientRect();
      if(r.top<80||r.bottom>height-55||!r.width)continue;ink.fillText(match[0],r.left,r.top+(r.height-ascent-descent)/2+ascent);
     }
    }
   });
   host.querySelectorAll('article,.service-sheet,.work-screen,.enquiry-form,.workflow-film-shell,.client-orbit-card.is-front').forEach(node=>{
    const r=node.getBoundingClientRect();if(r.bottom<80||r.top>height-55)return;ink.beginPath();ink.roundRect(r.left,r.top,r.width,r.height,10);ink.stroke();
   });
   const pixels=ink.getImageData(0,0,canvas.width,canvas.height).data,targets:number[]=[];
   for(let y=40;y<canvas.height-28;y++)for(let x=10;x<canvas.width-10;x++)if(pixels[(y*canvas.width+x)*4+3]>70)targets.push(x/scale,y/scale);
   if(targets.length)window.dispatchEvent(new CustomEvent('digibuzz-assembly',{detail:{targets,width,height}}));
  };
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(assemble)});
  const collapse=()=>{cancelled=true;cancelAnimationFrame(frame);animations.forEach(a=>a.cancel());nodes.forEach(node=>animations.push(node.animate([{opacity:opacity.get(node)??1},{opacity:0}],{duration:320,fill:'forwards'})));};
  host.addEventListener('digibuzz-collapse',collapse);
  return()=>{cancelled=true;cancelAnimationFrame(frame);host.removeEventListener('digibuzz-collapse',collapse);animations.forEach(a=>a.cancel());window.dispatchEvent(new Event('digibuzz-assembly-cancel'));};
 },[stage,panel,opened]);
 return null;
}
