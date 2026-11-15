'use client';
import Image from 'next/image';
import { flushSync } from 'react-dom';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Phone, MessageCircle, Instagram, Play, Target, Orbit, Camera, Globe, PenTool, Radio, Sparkles, Compass, Layers } from 'lucide-react';
import EnquiryForm from './EnquiryForm';
import ExpandingReel from './ExpandingReel';
import { useSwipe } from '@/lib/useSwipe';
import Link from 'next/link';
import { services } from '@/data/services';
import { site, reels, clientProfiles, process as workflow } from '@/data/site';
const icons=[Target,Radio,Orbit,Camera,Globe,PenTool];
const names=['Gala Deventure','The Ruttba','Ainakvala','Arora Folding Furniture','3R Fitness','Lino Perros','D’Decor'];
const number=(n:number)=>String(n+1).padStart(2,'0');
const vars=(v:Record<string,string|number>)=>v as CSSProperties;
export function Arrival({enter}:{enter:()=>void}){return <section className="story-frame new-arrival">
 <div className="hero-kicker" data-emerge><span className="scene-label">DIGIBUZZ MARKETING</span><span>NCR / KARNAL / CHANDIGARH</span></div>
 <div className="hero-title" data-emerge><h1>Make your brand<br/><em>impossible to ignore.</em></h1><p>Strategy. Creativity. Technology. Results.<br/>One partner. Every digital possibility.</p><button className="hero-entry" onClick={enter}><span>Explore what we create</span><ArrowUpRight size={23}/></button></div>
 <div className="hero-bottom" data-emerge><span>DIGITAL MARKETING · CONTENT · AI & CGI</span><span>SCROLL TO DISCOVER ↓</span></div>
 </section>}
export function Studio({next}:{next:()=>void}){return <section className="story-frame new-about">
 <div className="chapter-intro" data-emerge><span className="scene-label">THE DIGIBUZZ DIFFERENCE</span><h2>We think<br/><em>beyond the feed.</em></h2><p>We build digital identities, create attention-grabbing content and turn creativity into measurable growth. From strategic branding and high-impact content to AI-powered visuals and performance marketing, we help ambitious businesses stand out in a crowded digital world.</p><button className="signal-link" onClick={next}>Discover our services <ArrowRight size={17}/></button></div>
 <div className="about-principles">{[{title:'Creative first.',copy:'We create content that captures attention and builds brand recall.',Icon:Sparkles},{title:'Technology driven.',copy:'AI, CGI and innovative tools push our creative boundaries.',Icon:Layers},{title:'Strategy led. Growth focused.',copy:'Every campaign starts with a purpose, audience and measurable objective — focused on visibility, engagement, leads and conversions.',Icon:Compass}].map(({title,copy,Icon},i)=><article data-emerge className="principle" key={title}><div><Icon size={24}/><span>0{i+1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div><span className="about-location" data-emerge>BASED ACROSS NCR, KARNAL & CHANDIGARH. BUILT AROUND YOUR BRAND.</span>
 </section>}
export function Capabilities({standalone=false}:{standalone?:boolean}){
 const [active,setActive]=useState(0),[expanded,setExpanded]=useState(false);
 const Heading=standalone?'h1':'h2';
 return <section className={`story-frame new-services ${standalone?'services-standalone':''}`}>
 <div className="chapter-title" data-emerge><div><span className="scene-label">SERVICES</span><Heading>What your brand needs.<br/><em>All working together.</em></Heading></div><p>Explore six ways we help you show up, stand out, and connect with the right people.</p></div>
 <div className="services-console"><nav className="services-tabs" data-emerge aria-label="Choose a service">{services.map((service,i)=>{const Symbol=icons[i];return <button key={service.slug} aria-pressed={active===i} aria-controls={`service-${service.slug}`} className={active===i?'is-selected':''} onClick={()=>{setActive(i);setExpanded(false)}}><span>{number(i)}</span><Symbol size={20}/><strong>{service.name}</strong><ArrowUpRight size={16}/></button>})}</nav>
 {services.map((service,i)=>{const Icon=icons[i];return <article id={`service-${service.slug}`} key={service.slug} hidden={active!==i} className="service-sheet" data-emerge><div className="service-sheet-content"><div className="service-sheet-top"><span className="scene-label">{service.name}</span><Icon size={30} strokeWidth={1.3}/></div><h3>{service.short}</h3><p>{service.description}</p><span className="deliverable-label">WHAT WE CAN HELP WITH</span><div className="deliverables">{service.capabilities.map((cap,index)=><div key={cap} hidden={!expanded&&index>=4} style={vars({'--order':index})}><span>{number(index)}</span>{cap}</div>)}</div><div className="service-actions"><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?'Show less':'Explore all deliverables'} <ArrowRight size={16}/></button><a href={standalone?'/#contact':'#contact'}>Let’s discuss it <ArrowUpRight size={16}/></a></div></div></article>})}</div>
 <div className="services-locations"><p>Digital marketing for brands in <strong>Karnal, Chandigarh, Delhi and Gurugram (Gurgaon)</strong>. These are our service areas; project scope and shoot locations are agreed with you.</p></div>
 </section>
}
const workflowCopy=workflow.map(step=>step[1]);
export function Process(){
 const film=useRef<HTMLDivElement>(null);
 const beam=useRef<SVGCircleElement>(null),trail=useRef<SVGPathElement>(null);
 const [playing,setPlaying]=useState(false),[current,setCurrent]=useState(0),[reduced,setReduced]=useState(false);
 useEffect(()=>{const preference=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setReduced(preference.matches);sync();preference.addEventListener('change',sync);return()=>preference.removeEventListener('change',sync)},[]);
 useEffect(()=>{
  if(reduced)return;
  let raf=0,last=0,elapsed=0,shown=0;
  const animate=(now:number)=>{
   raf=requestAnimationFrame(animate);const dt=last?Math.min(now-last,50):0;last=now;if(document.hidden)return;
   elapsed+=dt;
   // Wait until the section materialises, then visit every stage on a single clock.
   const time=Math.max(0,elapsed-2100),cycle=time%(workflow.length*2000),index=Math.floor(cycle/2000),local=cycle%2000/2000;
   if(index!==shown){shown=index;setCurrent(index);}
   const move=Math.max(0,Math.min(1,(local-.45)/.55));const eased=move*move*(3-2*move);
   const position=Math.min(workflow.length-1,index+eased);
   beam.current?.setAttribute('cx',String(50+position*500/(workflow.length-1)));beam.current?.setAttribute('cy',String(170-position*110/(workflow.length-1)));
   trail.current?.setAttribute('stroke-dashoffset',String(100-position*100/(workflow.length-1)));
  };raf=requestAnimationFrame(animate);return()=>cancelAnimationFrame(raf);
 },[reduced]);
 useEffect(()=>{const mobile=matchMedia('(max-width:760px)');const stop=()=>{if(mobile.matches)setPlaying(false);};mobile.addEventListener('change',stop);return()=>mobile.removeEventListener('change',stop);},[]);

 const StepIcon=[Compass,Target,Camera,Radio,Orbit,Sparkles][current];
 return <section className="story-frame workflow-cinema">
 <header className="workflow-heading" data-emerge><div><span className="scene-label">HOW WE WORK</span><h2>Good work.<em> Built together.</em></h2></div><p>A clear plan. A hands-on team.<br/>From your first brief to your next campaign.</p></header>
 <div className="workflow-composition">
 <div className="workflow-film" data-emerge><div className="workflow-film-shell" ref={film}>
 <div className="workflow-film-image">
 <a className="workflow-mobile-poster" href="https://www.instagram.com/reel/DebA_yyAonB/" target="_blank" rel="noreferrer" aria-label="Watch our behind the scenes reel on Instagram"><Image src="/images/reels/DebA_yyAonB.jpg" alt="DigiBuzz team working on a client shoot" fill unoptimized sizes="(max-width:760px) 180px, 320px"/><span className="workflow-watch"><Instagram size={16}/> Watch on Instagram</span></a>
 <div className="workflow-desktop-player"><button aria-label="Play our behind the scenes reel" onClick={()=>flushSync(()=>setPlaying(true))}><Image src="/images/reels/DebA_yyAonB.jpg" alt="DigiBuzz team working on a client shoot" fill unoptimized sizes="320px"/><span className="workflow-watch"><Play size={18}/> Watch our team</span></button></div>
 </div>
 <a href="https://www.instagram.com/reel/DebA_yyAonB/" target="_blank" rel="noreferrer"><Instagram size={17}/><span>OPEN IN INSTAGRAM</span><ArrowUpRight size={18}/></a>
 {playing&&<ExpandingReel origin={film} onClose={()=>setPlaying(false)}/>}
 </div><span className="workflow-film-note">REAL PEOPLE. REAL CREATIVE WORK.</span></div>
 <div className="workflow-story">
 <div className="workflow-active" key={current}><div className="workflow-active-top"><span>OUR PROCESS / {number(current)}</span><StepIcon size={25}/></div><span className="workflow-watermark" aria-hidden="true">{number(current)}</span><h3>{workflow[current][0]}<em>.</em></h3><p>{workflowCopy[current]}</p></div>
 <div className="workflow-staircase" data-emerge><svg className="workflow-graph" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="workflowArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bc8fe9" stopOpacity=".24"/><stop offset="100%" stopColor="#bc8fe9" stopOpacity="0"/></linearGradient></defs><path className="workflow-graph-area" d="M50 170 L150 148 L250 126 L350 104 L450 82 L550 60 L550 225 L50 225Z"/>{[0,1,2,3,4].map(i=><path className="workflow-grid" key={i} d={`M25 ${225-i*32} H575`}/>)}{workflow.map((_,i)=><path className="workflow-grid" key={i} d={`M${50+i*500/(workflow.length-1)} 225 V${170-i*110/(workflow.length-1)}`}/>)}<path className="workflow-graph-depth" d="M50 178 L150 156 L250 134 L350 112 L450 90 L550 68"/><path className="workflow-graph-line" d="M50 170 L150 148 L250 126 L350 104 L450 82 L550 60"/><path ref={trail} className="workflow-live-beam" pathLength="100" strokeDasharray="100" strokeDashoffset="100" d="M50 170 L150 148 L250 126 L350 104 L450 82 L550 60"/>{workflow.map((_,i)=><circle key={i} cx={50+i*500/(workflow.length-1)} cy={170-i*110/(workflow.length-1)} r="5" className={current>=i?'graph-dot passed':'graph-dot'}/>)}<circle ref={beam} className="graph-traveller" cx="50" cy="170" r="6"/></svg>{workflow.map(([name],i)=>{const Icon=[Compass,Target,Camera,Radio,Orbit,Sparkles][i];return <div key={name} aria-current={current===i?'step':undefined} aria-label={`Step ${i+1}: ${name}`} className={`workflow-step ${current===i?'is-current':''} ${current>i?'is-done':''}`} style={vars({'--step':i})}><span className="workflow-step-glass"><span>{number(i)}</span><Icon size={24}/><i/></span><b>{name}</b></div>})}</div>
 <div className="workflow-foot"><span>01 — UNDERSTAND YOUR BRAND</span><ArrowRight size={16}/><span>05 — IMPROVE WHAT WORKS</span></div>
 </div></div></section>}
export function Work(){const [active,setActive]=useState(0);const swipe=useSwipe(direction=>setActive(value=>(value+direction+reels.length)%reels.length));return <section className="story-frame work-scene renewed-work">
 <div data-emerge className="scene-heading"><span className="scene-label">WORK THAT SPEAKS</span><h2>Stories made<br/><em>for real brands.</em></h2></div>
 <div className="work-gallery" {...swipe} aria-roledescription="carousel" aria-label="Client reels">{[-2,-1,0,1,2].map(slot=>{const index=(active+slot+reels.length)%reels.length,r=reels[index];return <a key={r.url} href={r.url} target="_blank" rel="noreferrer" data-emerge className={`work-screen ${slot===0?'work-screen-active':''}`} style={vars({'--slot':slot,'--depth':Math.abs(slot)})} tabIndex={slot===0?0:-1} aria-label={`Watch client reel ${number(index)} on Instagram`}><div className="screen-chrome"><span>DB / CLIENT STORIES</span><Instagram size={12}/></div><div className="screen-image">{r.thumbnail&&<Image src={r.thumbnail} alt={r.title} fill unoptimized sizes="(max-width:760px) 65vw, 25vw"/>}<span className="screen-play"><Play size={22}/></span></div><div className="screen-caption"><span>STORY {number(index)}</span><ArrowUpRight size={15}/></div></a>})}</div>
 <div className="gallery-controller"><button aria-label="Previous portfolio reels" onClick={()=>setActive((active+reels.length-1)%reels.length)}><ArrowLeft size={18}/></button><span>{number(active)}<i>/ {reels.length}</i></span><button aria-label="Next portfolio reels" onClick={()=>setActive((active+1)%reels.length)}><ArrowRight size={18}/></button></div><span className="scene-footnote">REAL CLIENT CONTENT. OPEN A STORY ON INSTAGRAM.</span>
 </section>}
export function Clients(){
 const [rotation,setRotation]=useState(0),[direction,setDirection]=useState(0);
 const angleRef=useRef(0),track=useRef<HTMLDivElement>(null);
 const paintOrbit=(orbit:number)=>{track.current?.querySelectorAll<HTMLElement>('.client-orbit-card').forEach((card,i)=>{const angle=(i-orbit)*Math.PI*2/clientProfiles.length,depth=Math.cos(angle);const slot=((i-orbit+clientProfiles.length*100+clientProfiles.length/2)%clientProfiles.length)-clientProfiles.length/2;const values={'--mobile-slot':slot,'--mobile-depth':Math.abs(slot),'--orbit-x':Math.sin(angle),'--orbit-y':depth*45,'--orbit-z':depth*140,'--orbit-turn':-Math.sin(angle)*24,'--orbit-opacity':depth<.05?0:Math.min(1,(depth-.05)*2)};Object.entries(values).forEach(([key,value])=>card.style.setProperty(key,String(value)));card.style.zIndex=String(Math.round((depth+1)*10));});};
 useEffect(()=>{let raf=0,last=0;const tick=(now:number)=>{const dt=last?Math.min(50,now-last):16;last=now;angleRef.current+=(rotation-angleRef.current)*(1-Math.exp(-dt/240));paintOrbit(angleRef.current);if(Math.abs(rotation-angleRef.current)>.001)raf=requestAnimationFrame(tick);};if(matchMedia('(prefers-reduced-motion: reduce)').matches){angleRef.current=rotation;raf=requestAnimationFrame(()=>paintOrbit(rotation));return()=>cancelAnimationFrame(raf);}raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[rotation]);
 const reduced=useRef(false);
 useEffect(()=>{reduced.current=matchMedia('(prefers-reduced-motion: reduce)').matches},[]);
 useEffect(()=>{if(!direction||reduced.current)return;const timer=setInterval(()=>setRotation(value=>value+direction),1100);return()=>clearInterval(timer)},[direction]);
 const active=((rotation%clientProfiles.length)+clientProfiles.length)%clientProfiles.length;
 const move=(value:number)=>setRotation(r=>r+value);
 const swipe=useSwipe(move);
 const hover=(value:number)=>{if(matchMedia('(hover: hover) and (pointer: fine)').matches)setDirection(value);};
 return <section className="story-frame orbital-clients">
 <div className="scene-heading" data-emerge><span className="scene-label">OUR CLIENTS</span><h2>The brands<br/><em>in our world.</em></h2></div>
 <div className="client-galaxy-carousel" {...swipe} aria-roledescription="carousel" aria-label="Client Instagram accounts">
 <div className="client-orbit-track" ref={track}>{clientProfiles.map((client,i)=>{const angle=i*Math.PI*2/clientProfiles.length,depth=Math.cos(angle);return <a className={`client-orbit-card ${active===i?'is-front':''}`} key={client.handle} href={client.url} target="_blank" rel="noreferrer" tabIndex={active===i?0:-1} aria-label={`${names[i]} on Instagram`} style={vars({'--mobile-slot':i>clientProfiles.length/2?i-clientProfiles.length:i,'--mobile-depth':Math.min(i,clientProfiles.length-i),'--orbit-x':Math.sin(angle),'--orbit-y':depth*45,'--orbit-z':depth*140,'--orbit-turn':-Math.sin(angle)*24,'--orbit-opacity':depth<.05?0:Math.min(1,(depth-.05)*2),zIndex:Math.round((depth+1)*10)})}><span className="client-orbit-index">CLIENT / {number(i)}</span><Instagram className="client-orbit-instagram" size={28}/><strong>{names[i]}</strong><span className="client-orbit-handle">@{client.handle}</span><span className="client-orbit-visit">VIEW INSTAGRAM <ArrowUpRight size={16}/></span></a>})}</div>
 <button className="client-orbit-prev" aria-label="Previous client" onMouseEnter={()=>hover(-1)} onMouseLeave={()=>setDirection(0)} onFocus={()=>hover(-1)} onBlur={()=>setDirection(0)} onClick={()=>move(-1)}><ArrowLeft size={23}/></button>
 <button className="client-orbit-next" aria-label="Next client" onMouseEnter={()=>hover(1)} onMouseLeave={()=>setDirection(0)} onFocus={()=>hover(1)} onBlur={()=>setDirection(0)} onClick={()=>move(1)}><ArrowRight size={23}/></button>
 </div><div className="client-orbit-caption"><span>{number(active)} / {number(clientProfiles.length-1)}</span><span>SWIPE OR USE THE ARROWS · TAP A CLIENT TO CONNECT</span></div>
 </section>}
export function Contact({replay}:{replay:()=>void}){return <section className="story-frame contact-scene renewed-contact"><div data-emerge className="contact-copy"><span className="scene-label">CONTACT US</span><h2>Ready to make<br/><em>some noise?</em></h2><p>Your brand deserves more than ordinary marketing. Let’s build something people notice, remember and talk about.</p><div className="contact-options"><a href={`https://wa.me/${site.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"><span><MessageCircle size={15}/> WHATSAPP</span><strong>Connect on WhatsApp</strong><ArrowUpRight size={17}/></a><a className="contact-call" href={`tel:${site.phone}`}><span><Phone size={15}/> SPEAK TO US</span><strong>+91 97290 00829</strong><ArrowUpRight size={17}/></a><a href={`mailto:${site.email}`}><span>EMAIL US</span><strong>{site.email}</strong><ArrowUpRight size={17}/></a><a href={site.socials.instagram} target="_blank" rel="noreferrer"><span><Instagram size={15}/> INSTAGRAM</span><strong>@digibuzzmarketing.in</strong><ArrowUpRight size={17}/></a></div><span className="contact-regions">NCR · KARNAL · CHANDIGARH</span></div><EnquiryForm/><div className="contact-baseline"><span>LET’S MAKE SOMETHING WORTH NOTICING.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><button onClick={replay}>Back to the beginning ↗</button></div></div></section>}
