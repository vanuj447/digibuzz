'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Instagram, Play, Target, Orbit, Camera, Globe, PenTool, Radio, Sparkles, Compass, Layers } from 'lucide-react';
import EnquiryForm from './EnquiryForm';
import Link from 'next/link';
import { services } from '@/data/services';
import { site, reels, clientProfiles, process as workflow } from '@/data/site';
const icons=[Target,Radio,Orbit,Camera,Globe,PenTool];
const names=['Gala Deventure','The Ruttba','Ainakvala','Arora Folding Furniture','3R Fitness','Lino Perros','D’Decor'];
const number=(n:number)=>String(n+1).padStart(2,'0');
const vars=(v:Record<string,string|number>)=>v as CSSProperties;
export function Arrival({enter}:{enter:()=>void}){return <section className="story-frame new-arrival">
 <div className="hero-kicker" data-emerge><span className="scene-label">DIGIBUZZ MARKETING</span><span>NCR / KARNAL / CHANDIGARH</span></div>
 <div className="hero-title" data-emerge><h1>Great brands<br/>start with a <em>spark.</em></h1><p>Digital marketing, content & design.<br/>Connected by one creative team.</p></div>
 <button className="hero-entry" data-emerge onClick={enter}><span>ENTER OUR WORLD</span><ArrowUpRight size={23}/></button>
 <div className="hero-bottom" data-emerge><span>STRATEGY → CONTENT → CONNECTION</span><span>SCROLL TO DISCOVER ↓</span></div>
 </section>}
export function Studio({next}:{next:()=>void}){return <section className="story-frame new-about">
 <div className="chapter-intro" data-emerge><span className="scene-label">01 / ABOUT US</span><h2>One team.<br/><em>A bigger picture.</em></h2><p>We’re DigiBuzz Marketing — a creative and digital marketing team bringing your brand’s strategy, content, and campaigns together.</p><button className="signal-link" onClick={next}>Discover our services <ArrowRight size={17}/></button></div>
 <div className="about-principles">{[{title:'Understand your world.',copy:'We start with your business, your audience, and what you want to achieve. A clear direction comes before any creative.',Icon:Compass},{title:'Make it unmistakably yours.',copy:'From reels and campaign ideas to your visual identity, we shape a consistent voice people can recognise.',Icon:Sparkles},{title:'Bring every part together.',copy:'Content, design, social media, and advertising work as one connected plan — with room to learn and improve.',Icon:Layers}].map(({title,copy,Icon},i)=><article data-emerge className="principle" key={title}><div><Icon size={24}/><span>0{i+1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div><span className="about-location" data-emerge>BASED ACROSS NCR, KARNAL & CHANDIGARH. BUILT AROUND YOUR BRAND.</span>
 </section>}
export function Capabilities(){const [active,setActive]=useState(0),[expanded,setExpanded]=useState(false);const service=services[active],Icon=icons[active];return <section className="story-frame new-services">
 <div className="chapter-title" data-emerge><div><span className="scene-label">02 / SERVICES</span><h2>What your brand needs.<br/><em>All working together.</em></h2></div><p>Explore six ways we help you show up, stand out, and connect with the right people.</p></div>
 <div className="services-console"><nav className="services-tabs" data-emerge aria-label="Choose a service">{services.map((s,i)=>{const Symbol=icons[i];return <button key={s.slug} aria-pressed={active===i} className={active===i?'is-selected':''} onClick={()=>{setActive(i);setExpanded(false)}}><span>{number(i)}</span><Symbol size={20}/><strong>{s.name}</strong><ArrowUpRight size={16}/></button>})}</nav>
 <article className="service-sheet" data-emerge><div className="service-sheet-content" key={active}><div className="service-sheet-top"><span className="scene-label">{service.name}</span><Icon size={30} strokeWidth={1.3}/></div><h3>{service.short}</h3><p>{service.description}</p><span className="deliverable-label">WHAT WE CAN HELP WITH</span><div className="deliverables">{service.capabilities.slice(0,expanded?undefined:4).map((cap,i)=><div key={cap} style={vars({'--order':i})}><span>{number(i)}</span>{cap}</div>)}</div><div className="service-actions"><button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?'Show less':'Explore all deliverables'} <ArrowRight size={16}/></button><a href="#contact">Let’s discuss it <ArrowUpRight size={16}/></a></div></div></article></div>
 </section>}
const workflowCopy=['We listen to your goals, understand your audience, and identify what your brand needs next.','We turn the brief into a focused direction, a content plan, and the right channels for your brand.','We bring the plan to life through concepts, shoots, design, and content made for your audience.','We publish and launch with attention to timing, consistency, and the details that matter.','We review the response and refine the content, targeting, and experience as we learn.','We build on what works and plan the next phase around your business priorities.'];
export function Process(){
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
   const time=Math.max(0,elapsed-2100),cycle=time%12000,index=Math.floor(cycle/2000),local=cycle%2000/2000;
   if(index!==shown){shown=index;setCurrent(index);}
   const move=Math.max(0,Math.min(1,(local-.45)/.55));const eased=move*move*(3-2*move);
   const position=Math.min(5,index+eased);
   beam.current?.setAttribute('cx',String(50+position*100));beam.current?.setAttribute('cy',String(170-position*22));
   trail.current?.setAttribute('stroke-dashoffset',String(100-position*20));
  };raf=requestAnimationFrame(animate);return()=>cancelAnimationFrame(raf);
 },[reduced]);
 const StepIcon=[Compass,Target,Camera,Radio,Orbit,Sparkles][current];
 return <section className="story-frame workflow-cinema">
 <header className="workflow-heading" data-emerge><div><span className="scene-label">03 / HOW WE WORK</span><h2>Good work.<em> Built together.</em></h2></div><p>A clear plan. A hands-on team.<br/>From your first brief to your next campaign.</p></header>
 <div className="workflow-composition">
 <div className="workflow-film" data-emerge><div className="workflow-film-shell">
 <div className="workflow-film-image">{playing?<iframe title="DigiBuzz behind the scenes" src="https://www.instagram.com/reel/DebA_yyAonB/embed/" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen/>:<button aria-label="Play our behind the scenes reel" onClick={()=>setPlaying(true)}><Image src="/images/reels/DebA_yyAonB.jpg" alt="DigiBuzz team working on a client shoot" fill unoptimized sizes="(max-width:760px) 240px, 320px"/><span className="workflow-watch"><Play size={18}/> Watch our team</span></button>}</div>
 <a href="https://www.instagram.com/reel/DebA_yyAonB/" target="_blank" rel="noreferrer"><Instagram size={17}/><span>BEHIND THE SCENES</span><ArrowUpRight size={18}/></a></div><span className="workflow-film-note">REAL PEOPLE. REAL CREATIVE WORK.</span></div>
 <div className="workflow-story" data-emerge>
 <div className="workflow-active" key={current}><div className="workflow-active-top"><span>OUR PROCESS / {number(current)}</span><StepIcon size={25}/></div><span className="workflow-watermark" aria-hidden="true">{number(current)}</span><h3>{workflow[current][0]}<em>.</em></h3><p>{workflowCopy[current]}</p></div>
 <div className="workflow-staircase"><svg className="workflow-graph" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="workflowArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bc8fe9" stopOpacity=".24"/><stop offset="100%" stopColor="#bc8fe9" stopOpacity="0"/></linearGradient></defs><path className="workflow-graph-area" d="M50 170 L150 148 L250 126 L350 104 L450 82 L550 60 L550 225 L50 225Z"/>{[0,1,2,3,4].map(i=><path className="workflow-grid" key={i} d={`M25 ${225-i*32} H575`}/>)}{workflow.map((_,i)=><path className="workflow-grid" key={i} d={`M${50+i*100} 225 V${170-i*22}`}/>)}<path className="workflow-graph-depth" d="M50 178 L150 156 L250 134 L350 112 L450 90 L550 68"/><path className="workflow-graph-line" d="M50 170 L150 148 L250 126 L350 104 L450 82 L550 60"/><path ref={trail} className="workflow-live-beam" pathLength="100" strokeDasharray="100" strokeDashoffset="100" d="M50 170 L150 148 L250 126 L350 104 L450 82 L550 60"/>{workflow.map((_,i)=><circle key={i} cx={50+i*100} cy={170-i*22} r="5" className={current>=i?'graph-dot passed':'graph-dot'}/>)}<circle ref={beam} className="graph-traveller" cx="50" cy="170" r="6"/></svg>{workflow.map(([name],i)=>{const Icon=[Compass,Target,Camera,Radio,Orbit,Sparkles][i];return <div key={name} aria-current={current===i?'step':undefined} aria-label={`Step ${i+1}: ${name}`} className={`workflow-step ${current===i?'is-current':''} ${current>i?'is-done':''}`} style={vars({'--step':i})}><span className="workflow-step-glass"><span>{number(i)}</span><Icon size={24}/><i/></span><b>{name}</b></div>})}</div>
 <div className="workflow-foot"><span>01 — UNDERSTAND YOUR BRAND</span><ArrowRight size={16}/><span>06 — BUILD ON WHAT WORKS</span></div>
 </div></div></section>}
export function Work(){const [active,setActive]=useState(0);return <section className="story-frame work-scene renewed-work">
 <div data-emerge className="scene-heading"><span className="scene-label">04 / CLIENT WORK</span><h2>Stories made<br/><em>for real brands.</em></h2></div>
 <div className="work-gallery" aria-roledescription="carousel" aria-label="Client reels">{[-2,-1,0,1,2].map(slot=>{const index=(active+slot+reels.length)%reels.length,r=reels[index];return <a key={r.url} href={r.url} target="_blank" rel="noreferrer" data-emerge className={`work-screen ${slot===0?'work-screen-active':''}`} style={vars({'--slot':slot,'--depth':Math.abs(slot)})} tabIndex={slot===0?0:-1} aria-label={`Watch client reel ${number(index)} on Instagram`}><div className="screen-chrome"><span>DB / CLIENT STORIES</span><Instagram size={12}/></div><div className="screen-image">{r.thumbnail&&<Image src={r.thumbnail} alt={r.title} fill unoptimized sizes="(max-width:760px) 65vw, 25vw"/>}<span className="screen-play"><Play size={22}/></span></div><div className="screen-caption"><span>STORY {number(index)}</span><ArrowUpRight size={15}/></div></a>})}</div>
 <div className="gallery-controller"><button aria-label="Previous portfolio reels" onClick={()=>setActive((active+reels.length-1)%reels.length)}><ArrowLeft size={18}/></button><span>{number(active)}<i>/ {reels.length}</i></span><button aria-label="Next portfolio reels" onClick={()=>setActive((active+1)%reels.length)}><ArrowRight size={18}/></button></div><span className="scene-footnote">REAL CLIENT CONTENT. OPEN A STORY ON INSTAGRAM.</span>
 </section>}
export function Clients(){
 const [rotation,setRotation]=useState(0),[orbit,setOrbit]=useState(0),[direction,setDirection]=useState(0);
 const angleRef=useRef(0);
 useEffect(()=>{let raf=0,last=0;const tick=(now:number)=>{const dt=last?Math.min(50,now-last):16;last=now;angleRef.current+=(rotation-angleRef.current)*(1-Math.exp(-dt/240));setOrbit(angleRef.current);if(Math.abs(rotation-angleRef.current)>.001)raf=requestAnimationFrame(tick);};if(matchMedia('(prefers-reduced-motion: reduce)').matches){angleRef.current=rotation;raf=requestAnimationFrame(()=>setOrbit(rotation));return()=>cancelAnimationFrame(raf);}raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[rotation]);
 const reduced=useRef(false);
 useEffect(()=>{reduced.current=matchMedia('(prefers-reduced-motion: reduce)').matches},[]);
 useEffect(()=>{if(!direction||reduced.current)return;const timer=setInterval(()=>setRotation(value=>value+direction),1100);return()=>clearInterval(timer)},[direction]);
 const active=((rotation%clientProfiles.length)+clientProfiles.length)%clientProfiles.length;
 const move=(value:number)=>setRotation(r=>r+value);
 return <section className="story-frame orbital-clients">
 <div className="scene-heading" data-emerge><span className="scene-label">05 / OUR CLIENTS</span><h2>The brands<br/><em>in our world.</em></h2></div>
 <div className="client-galaxy-carousel" aria-roledescription="carousel" aria-label="Client Instagram accounts" data-emerge>
 <div className="client-orbit-track">{clientProfiles.map((client,i)=>{const angle=(i-orbit)*Math.PI*2/clientProfiles.length,depth=Math.cos(angle);return <a className={`client-orbit-card ${active===i?'is-front':''}`} key={client.handle} href={client.url} target="_blank" rel="noreferrer" tabIndex={active===i?0:-1} aria-label={`${names[i]} on Instagram`} style={vars({'--orbit-x':Math.sin(angle),'--orbit-y':depth*45,'--orbit-z':depth*140,'--orbit-turn':-Math.sin(angle)*24,'--orbit-opacity':depth<.05?0:Math.min(1,(depth-.05)*2),zIndex:Math.round((depth+1)*10)})}><span className="client-orbit-index">CLIENT / {number(i)}</span><Instagram className="client-orbit-instagram" size={28}/><strong>{names[i]}</strong><span className="client-orbit-handle">@{client.handle}</span><span className="client-orbit-visit">VIEW INSTAGRAM <ArrowUpRight size={16}/></span></a>})}</div>
 <button className="client-orbit-prev" aria-label="Previous client" onMouseEnter={()=>setDirection(-1)} onMouseLeave={()=>setDirection(0)} onFocus={()=>setDirection(-1)} onBlur={()=>setDirection(0)} onClick={()=>move(-1)}><ArrowLeft size={23}/></button>
 <button className="client-orbit-next" aria-label="Next client" onMouseEnter={()=>setDirection(1)} onMouseLeave={()=>setDirection(0)} onFocus={()=>setDirection(1)} onBlur={()=>setDirection(0)} onClick={()=>move(1)}><ArrowRight size={23}/></button>
 </div><div className="client-orbit-caption"><span>{number(active)} / {number(clientProfiles.length-1)}</span><span>HOVER THE ARROWS TO EXPLORE · SELECT A CLIENT TO CONNECT</span></div>
 </section>}
export function Contact({replay}:{replay:()=>void}){return <section className="story-frame contact-scene renewed-contact"><div data-emerge className="contact-copy"><span className="scene-label">06 / CONTACT US</span><h2>Let’s talk<br/><em>about your brand.</em></h2><p>Tell us what you’re building, what you need, and where you’d like to go next.</p><div className="contact-options"><a href={`https://wa.me/${site.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"><span>CALL / WHATSAPP</span><strong>+91 97290 00829</strong><ArrowUpRight size={17}/></a><a href={`mailto:${site.email}`}><span>EMAIL US</span><strong>{site.email}</strong><ArrowUpRight size={17}/></a><a href={site.socials.instagram} target="_blank" rel="noreferrer"><span><Instagram size={15}/> INSTAGRAM</span><strong>@digibuzzmarketing.in</strong><ArrowUpRight size={17}/></a></div><span className="contact-regions">NCR · KARNAL · CHANDIGARH</span></div><EnquiryForm/><div className="contact-baseline"><span>LET’S MAKE SOMETHING WORTH NOTICING.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><button onClick={replay}>Back to the beginning ↗</button></div></div></section>}
