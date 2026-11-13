'use client';
import { useLayoutEffect, type RefObject } from 'react';

/** Rasterise each visible glyph once, in its final DOM coordinates. */
export default function ChapterEntrance({stage,panel,opened}:{stage:number;panel:RefObject<HTMLDivElement|null>;opened:boolean}){
 useLayoutEffect(()=>{
  const host=panel.current;
  if(!host||!opened||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const width=innerWidth,height=innerHeight;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ink=canvas.getContext('2d',{willReadFrequently:true});if(!ink)return;
  const nodes=Array.from(host.querySelectorAll<HTMLElement>('[data-emerge],.enquiry-form'));
  ink.fillStyle='#fff';ink.strokeStyle='#fff';ink.lineWidth=1;
  host.querySelectorAll('h1,h2,h3,.scene-label').forEach(label=>{
   const walker=document.createTreeWalker(label,NodeFilter.SHOW_TEXT);let text:Node|null;
   while((text=walker.nextNode())){
    const style=getComputedStyle(text.parentElement!);
    ink.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;ink.textBaseline='alphabetic';
    const ascent=ink.measureText('Hg').fontBoundingBoxAscent||parseFloat(style.fontSize)*.8;
    const descent=ink.measureText('Hg').fontBoundingBoxDescent||parseFloat(style.fontSize)*.2;
    for(let i=0;i<(text.textContent?.length||0);i++){
     const character=text.textContent![i];if(!character.trim())continue;
     const range=document.createRange();range.setStart(text,i);range.setEnd(text,i+1);const r=range.getBoundingClientRect();
     if(r.top<95||r.bottom>height-65||!r.width)continue;
     ink.fillText(character,r.left,r.top+(r.height-ascent-descent)/2+ascent);
    }
   }
  });
  host.querySelectorAll('article,.service-sheet,.client-world,.work-screen,.enquiry-form,.workflow-film-shell,.workflow-step-glass,.client-orbit-card').forEach(node=>{
   const r=node.getBoundingClientRect();if(r.bottom<100||r.top>height-65)return;
   ink.beginPath();ink.roundRect(r.left,r.top,r.width,r.height,8);ink.stroke();
  });
  const pixels=ink.getImageData(0,0,width,height).data,targets:number[]=[];
  for(let y=100;y<height-65;y+=2)for(let x=20;x<width-20;x+=2)if(pixels[(y*width+x)*4+3]>70)targets.push(x,y);
  if(!targets.length)return;
  window.dispatchEvent(new CustomEvent('digibuzz-assembly',{detail:{targets,width,height}}));
  const animations=nodes.map(node=>node.animate([{opacity:0,offset:0},{opacity:0,offset:.67},{opacity:1,offset:1}],{duration:2100,easing:'linear',fill:'backwards'}));
  const collapse=()=>{animations.forEach(a=>a.cancel());nodes.forEach(node=>animations.push(node.animate([{opacity:1},{opacity:0}],{duration:320,fill:'forwards'})));};
  host.addEventListener('digibuzz-collapse',collapse);
  return()=>{host.removeEventListener('digibuzz-collapse',collapse);animations.forEach(a=>a.cancel());window.dispatchEvent(new Event('digibuzz-assembly-cancel'));};
 },[stage,panel,opened]);
 return null;
}
