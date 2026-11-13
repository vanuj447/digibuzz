'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, X } from 'lucide-react';
import { Brand } from './Shell';
import UniverseScene from './UniverseScene';
import Startup from './universe/Startup';
import ChapterEntrance from './universe/ChapterEntrance';
import { reels } from '@/data/site';
import { getJourneyState } from '@/lib/journey';
import { Arrival, Studio, Capabilities, Process, Work, Clients, Contact } from './universe/StoryChapters';
const chapters=[['Home','arrival'],['About us','about'],['Services','expertise'],['How we work','process'],['Client work','work'],['Our clients','clients'],['Contact us','contact']];
export default function UniverseHome(){
 const [stage,setStage]=useState(0),[menu,setMenu]=useState(false),[ready,setReady]=useState(false),[opened,setOpened]=useState(false);
 const journey=useRef(0),stageRef=useRef(0),panel=useRef<HTMLDivElement>(null),meter=useRef<HTMLDivElement>(null);
 const onReady=useCallback(()=>setReady(true),[]);
 const launched=useRef(false),fusion=useRef(0),navigation=useRef<{destination:number;started:number;switched:boolean}|null>(null);
 const onComplete=useCallback(()=>{launched.current=true;setOpened(true)},[]);
 const go=useCallback((destination:number)=>{
  setMenu(false);if(navigation.current||destination===stageRef.current)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo({top:destination*innerHeight*1.35+(destination?1:0),behavior:'instant'});return;}
  navigation.current={destination,started:performance.now(),switched:false};
  panel.current?.dispatchEvent(new Event('digibuzz-collapse'));
 },[]);
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,target=0,last=0;
  const measure=()=>{target=Math.min(6.6,Math.max(0,scrollY/(innerHeight*1.35)))};measure();journey.current=target;
  const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(document.hidden)return;const dt=Math.min(50,now-last);last=now;
   const transfer=navigation.current;let transferExit=0;
   if(transfer){const elapsed=now-transfer.started;
    if(elapsed<1200){const t=Math.min(1,elapsed/900);fusion.current=t*t*(3-2*t);transferExit=t;}
    else{
     if(!transfer.switched){transfer.switched=true;window.scrollTo({top:transfer.destination*innerHeight*1.35+(transfer.destination?1:0),behavior:'instant'});measure();journey.current=target;}
     const t=Math.min(1,(elapsed-1200)/1200);fusion.current=1-t*t*(3-2*t);
     if(t===1){navigation.current=null;fusion.current=0;}
    }
   }else journey.current=reduced.matches?target:journey.current+(target-journey.current)*(1-Math.exp(-dt/75));
   const {progress:p,chapter:measured,fraction}=getJourneyState(journey.current);
   const i=transfer&&!transfer.switched?stageRef.current:measured;
   if(i!==stageRef.current){stageRef.current=i;setStage(i)}
   const exit=transfer&&!transfer.switched?transferExit:i===6?0:Math.min(1,Math.max(0,(fraction-(i===0?.35:.78))/(i===0?.5:.22)));
   if(panel.current){panel.current.style.setProperty('--departure',String(reduced.matches?0:exit));panel.current.style.setProperty('--passage',String(fraction));panel.current.inert=!!transfer||exit>.92||!opened;}
   if(meter.current)meter.current.style.transform=`scaleX(${p/6.6})`;
  };raf=requestAnimationFrame(draw);window.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',measure);window.removeEventListener('resize',measure)};
 },[opened]);
 useEffect(()=>{const follow=(event:MouseEvent)=>{const anchor=(event.target as Element).closest?.('a[href^="#"]');const index=chapters.findIndex(([,id])=>anchor?.getAttribute('href')===`#${id}`);if(index>=0){event.preventDefault();go(index)}};document.addEventListener('click',follow);return()=>document.removeEventListener('click',follow)},[go]);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setMenu(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[]);
 useEffect(()=>{if(!ready)return;const images:HTMLImageElement[]=[];const timer=setTimeout(()=>{reels.forEach(reel=>{if(reel.thumbnail){const image=new window.Image();image.decoding='async';image.src=reel.thumbnail;images.push(image);}});},500);return()=>clearTimeout(timer);},[ready]);
 return <div className={`universe universe-chapter-${stage} ${opened?'experience-open':'experience-loading'}`}><UniverseScene journey={journey} fusion={fusion} launched={launched} onReady={onReady}/><Startup ready={ready} onComplete={onComplete}/><div className="universe-vignette"/><div className="universe-grain" aria-hidden="true"/>
 <header className="universe-nav"><button aria-label="Return to the beginning" onClick={()=>go(0)}><Brand/></button><nav aria-label="Main navigation"><button onClick={()=>go(1)}>About us</button><button onClick={()=>go(2)}>Services</button><button onClick={()=>go(4)}>Client work</button><button onClick={()=>go(6)} className="nav-contact">Contact us <ArrowUpRight size={13}/></button></nav><button className="universe-index" aria-expanded={menu} aria-label={menu?'Close chapter menu':'Open chapter menu'} onClick={()=>setMenu(!menu)}>{menu?<X size={19}/>:<><i/><i/></>}</button></header>
 {menu&&<nav className="universe-menu" aria-label="Journey chapters">{chapters.map(([label],i)=><button key={label} onClick={()=>go(i)}><span>0{i+1}</span>{label}<ArrowUpRight size={17}/></button>)}</nav>}
 <div className="universe-chapter"><span>0{stage+1}</span><i/>{chapters[stage][0]}</div>
 <div className={`scene-viewport scene-${stage}`} ref={panel}>
 <ChapterEntrance stage={stage} panel={panel} opened={opened}/>
 {stage===0?<Arrival enter={()=>go(1)}/>:stage===1?<Studio next={()=>go(2)}/>:stage===2?<Capabilities/>:stage===3?<Process/>:stage===4?<Work/>:stage===5?<Clients/>:<Contact replay={()=>go(0)}/>}
 </div>
 <footer className="universe-hud"><span>DIGIBUZZ / <b>DIGITAL MARKETING & CREATIVE AGENCY</b></span><nav aria-label="Chapter navigation">{chapters.map(([name],i)=><button key={name} aria-label={`Go to ${name}`} aria-current={stage===i?'step':undefined} onClick={()=>go(i)}><i/></button>)}</nav><button onClick={()=>go(stage===6?0:stage+1)}>{stage===6?'REPLAY':'NEXT SECTION'} <ArrowDown size={13}/></button><div ref={meter} className="universe-meter"/></footer>
 <div className="universe-scroll-track" aria-hidden="true">{chapters.map(([,id])=><div key={id} id={id}/>)}</div>
 </div>;
}
