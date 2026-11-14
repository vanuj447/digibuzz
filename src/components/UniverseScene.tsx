'use client';
import { useEffect, useRef, type MutableRefObject } from 'react';

// All chapters deform the same UV surface: particle identities and filaments persist.
const vertex = `
attribute float seed;
attribute vec4 assemblyTarget;
attribute vec4 logoTarget;
uniform float logoMix,galaxyTilt,filament;
uniform float assembly, assemblyFade, seedSource;
varying float assembling;
uniform float time, journey, pixelRatio, mobile, startup, viewAspect, handoff, fusion;
varying vec3 tint;
varying float lightness;
const float PI=3.14159265;
vec3 form(float state,vec2 uv){
 float u=uv.x,v=uv.y,a=u*PI*2.;
 float ripple=sin(a*5.+time*.25+v*12.)*.035+sin(a*9.-v*18.+time*.18)*.018;
 if(state<1.5){
  float phi=v*PI,r=mix(2.55,6.,step(.5,state))+ripple+sin(a*3.+v*8.+time*.15)*.07;
  return vec3(sin(phi)*cos(a)*r,cos(phi)*r,sin(phi)*sin(a)*r);
 }
 if(state<2.5){
  float y=(v-.5)*10.;float r=.18+1.13*pow(abs(sin(y*.83+time*.13)),1.5)+ripple*.5;
  a+=y*.65+time*.08;
  return vec3(cos(a)*r,y,sin(a)*r);
 }
 if(state<3.5){
  float x=(u-.5)*19.,z=(v-.5)*8.;
  float y=sin(x*.55+z*.5+time*.35)*.38+sin(x*.95-z*.7-time*.25)*.19;
  return vec3(x,y-2.05,z-1.);
 }
 float r=state<4.5?1.1+v*5.7:.08+pow(v,.8)*4.12;
 a+=v*5.5-time*.09;
 float w=sin(a*3.+r*2.-time*.4)*.06+sin(a*8.+r*4.)*.025;
 float y=sin(a)*r*.26+w;
 if(state<4.5)y-=1.25/(r*r);
 vec3 galaxy=vec3(cos(a)*r,y-.8,sin(a)*r*.78);
 float standing=galaxyTilt;
 // Wind the existing disc into a bowed ribbon, lift its centre first,
 // then unfurl the outer arms. Every particle keeps its original UV identity.
 float wind=smoothstep(0.,.34,standing)*(1.-smoothstep(.48,1.,standing));
 float lift=smoothstep(.16,.88,standing);
 float release=smoothstep(.56,1.,standing);
 float twist=wind*(.45+v*1.75);
 galaxy.xz=mat2(cos(twist),-sin(twist),sin(twist),cos(twist))*galaxy.xz;
 galaxy.xz*=1.-wind*.32;
 // Opposite arms rise and dip around a continuous central spine.
 galaxy.y+=wind*sin(a+v*2.4)*r*.48;
 float radialLift=lift+sin(lift*PI)*(.5-v)*.44;
 float tilt=radialLift*1.16;
 galaxy.yz=mat2(cos(tilt),-sin(tilt),sin(tilt),cos(tilt))*galaxy.yz;
 float bank=sin(standing*PI)*.42;
 galaxy.xy=mat2(cos(bank),-sin(bank),sin(bank),cos(bank))*galaxy.xy;
 // The final release settles into the tall, slowly rotating contact galaxy.
 galaxy.y*=1.+release*.17;
 galaxy.x-=lift*.65;
 galaxy.z-=lift*.6;
 float spin=sin(time*.08)*.1*release;
 galaxy.xy=mat2(cos(spin),-sin(spin),sin(spin),cos(spin))*galaxy.xy;
 return galaxy;
}
float stateAt(float p){if(p<.5)return 0.;if(p<1.5)return 1.;if(p<2.5)return 2.;if(p<4.5)return 3.;if(p<5.5)return 5.;return 6.;}
void main(){
 float chapter=min(6.,floor(journey));float transition=smoothstep(chapter>=4.?.12:.76,.999,fract(journey));
 float s0=stateAt(chapter),s1=stateAt(min(chapter+1.,6.));
 vec3 p=mix(form(s0,position.xy),form(s1,position.xy),transition);
 float organic=sin(seed*147.+time*.3)*.006;
 p+=vec3(organic,sin(seed*93.)*.015,cos(seed*71.)*.02);
 // A very slow turn gives depth without an unrelated orbit or mouse interaction.
 float turn=.08*sin(time*.12)*(1.-smoothstep(2.,3.,journey));
 p.xz=mat2(cos(turn),-sin(turn),sin(turn),cos(turn))*p.xz;
 p*=mix(1.,.6,mobile);
 float entry=smoothstep(.22,.97,journey);
 p+=vec3(mix(viewAspect*1.9,0.,mobile),mix(0.,-1.65,mobile),0.)*(1.-entry)*handoff;
 // Form a coherent orb first, then compress it to a small seed before the destination opens.
 float cohesion=smoothstep(0.,.65,fusion);
 float compression=mix(1.,.12,smoothstep(.3,1.,fusion));
 p=mix(p,form(0.,position.xy)*mix(1.,.6,mobile),cohesion)*compression;
 // Continuous gravitational assembly: the same particles become the finished surface.
 float azimuth=seed*743.;float elevation=acos(clamp(sin(seed*319.),-.999,.999));
 vec3 scattered=vec3(sin(elevation)*cos(azimuth),cos(elevation),sin(elevation)*sin(azimuth))*(5.+4.*fract(seed*197.));
 float assemble=smoothstep(.05,.78,startup);
 p=mix(scattered,p,assemble);
 p.xy=mat2(cos((1.-assemble)*1.4),-sin((1.-assemble)*1.4),sin((1.-assemble)*1.4),cos((1.-assemble)*1.4))*p.xy;
 p*=mix(.035,1.,smoothstep(0.,.24,startup));
 vec3 cyan=vec3(.28,.32,1.),blue=vec3(.22,.07,1.),pink=vec3(.72,.22,1.);
 float colour=mix(1.-position.y,position.x,smoothstep(2.4,3.,journey));
 tint=mix(cyan,blue,smoothstep(0.,.48,colour));
 tint=mix(tint,pink,smoothstep(.48,1.,colour));
 tint=mix(tint,mix(vec3(.8,.35,1.),vec3(.18,.12,1.),smoothstep(.05,.65,position.y)),smoothstep(4.8,6.,journey));
 float bands=pow(.5+.5*sin(position.x*PI*2.*18.+position.y*12.+time*.3),14.);
 float rim=pow(1.-abs(sin(position.x*PI*2.)),5.);
 float interior=smoothstep(.7,1.,journey)*(1.-smoothstep(1.3,1.9,journey));
 lightness=(.75+seed*.8+bands*.75+rim*1.5)*startup*mix(1.,.36,interior)*mix(1.,.11,fusion);
 lightness*=mix(1.,.14,smoothstep(2.8,3.,journey)*(1.-smoothstep(3.7,4.,journey)));
 lightness*=mix(1.,.6,smoothstep(4.6,5.2,journey))*mix(1.,.68,galaxyTilt);
 lightness*=mix(1.,mix(.18,1.,smoothstep(0.,.3,position.y)),smoothstep(4.6,5.2,journey));
 vec4 mv=modelViewMatrix*vec4(p,1.);
 float brand=logoTarget.w*logoMix;
 if(brand>.001){
  vec3 logoView=vec3(logoTarget.x*8./projectionMatrix[0][0],logoTarget.y*8./projectionMatrix[1][1],-8.);
  mv.xyz=mix(mv.xyz,logoView,brand);
  tint=mix(tint,mix(vec3(.93,.92,.96),vec3(.72,.32,1.),logoTarget.z),brand);
  lightness=mix(lightness,.68,brand);
 }
 assembling=assemblyTarget.w*step(.001,assembly)*(1.-filament);
 if(assembling>.5){
  float phase=clamp((assembly-assemblyTarget.z*.12)/.88,0.,1.);
  float t=phase*phase*phase*(phase*(phase*6.-15.)+10.);
  vec3 surface=mv.xyz;
  vec3 origin=surface;
  if(seedSource>.5)origin=vec3(form(0.,position.xy)*.12)+vec3(0.,0.,-10.);
  vec3 destination=vec3(assemblyTarget.x*8./projectionMatrix[0][0],assemblyTarget.y*8./projectionMatrix[1][1],-8.);
  // A shallow, shared depth arc decelerates into one fixed, camera-aligned destination.
  vec3 control=mix(origin,destination,.5);control.z+=.65;
  mv.xyz=(1.-t)*(1.-t)*origin+2.*(1.-t)*t*control+t*t*destination;
  // Return continuously to the live surface instead of resetting invisible
  // particles to full galaxy brightness in a single frame at cancellation.
  float returning=1.-assemblyFade;
  mv.xyz=mix(mv.xyz,surface,returning*returning*(3.-2.*returning));
  tint=mix(vec3(.63,.47,.83),tint,returning);
  lightness=mix(.85,lightness,returning);
 }
 gl_Position=projectionMatrix*mv;
 gl_PointSize=mix(clamp((1.5+pow(seed,12.)*2.2)*pixelRatio*8./-mv.z,1.,5.*pixelRatio),2.0*pixelRatio,max(assembling*assemblyFade,brand));
}`;
const fragment = `varying vec3 tint;varying float lightness;varying float assembling;uniform float filament,startup,assembly,assemblyFade,logoMix;
void main(){float alpha=1.;if(filament<.5){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;alpha=exp(-d*d*4.5);}
if(filament>.5){if(logoMix>.01)discard;if(assembly>.001)alpha*=1.-assemblyFade;}
gl_FragColor=vec4(tint*(1.4+lightness*.9),alpha*lightness*mix(.68,.025*smoothstep(.9,1.,startup),filament));}`;

export default function UniverseScene({journey,fusion,launched,onReady}:{journey:MutableRefObject<number>;fusion:MutableRefObject<number>;launched:MutableRefObject<boolean>;onReady:()=>void}) {
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const container=host.current;if(!container)return;
  let cancelled=false,cleanup=()=>{};
  Promise.all([import('three'),import('three/examples/jsm/postprocessing/EffectComposer.js'),import('three/examples/jsm/postprocessing/RenderPass.js'),import('three/examples/jsm/postprocessing/UnrealBloomPass.js')]).then(([T,{EffectComposer},{RenderPass},{UnrealBloomPass}])=>{
   if(cancelled)return;
   let renderer:InstanceType<typeof T.WebGLRenderer>;
   try{renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});}catch{container.dataset.fallback='true';onReady();return;}
   const small=innerWidth<760,dpr=Math.min(devicePixelRatio,small?1:1.1);
   renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight);renderer.setClearColor(0x000000);container.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,60);camera.position.set(0,0,10);
   const composer=new EffectComposer(renderer);composer.setPixelRatio(small?.65:.9);composer.addPass(new RenderPass(scene,camera));
   const bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),small?.65:1.15,.7,.3);composer.addPass(bloom);
   const uniforms={logoMix:{value:0},galaxyTilt:{value:0},assembly:{value:0},assemblyFade:{value:1},seedSource:{value:0},time:{value:0},journey:{value:0},pixelRatio:{value:dpr},mobile:{value:small?1:0},viewAspect:{value:innerWidth/innerHeight},startup:{value:0},handoff:{value:0},fusion:{value:0},filament:{value:0}};
   const material=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
   const cols=small?76:176,rows=small?76:176,count=cols*rows;
   const positions=new Float32Array(count*3),seeds=new Float32Array(count);
   for(let x=0;x<cols;x++)for(let y=0;y<rows;y++){const i=x*rows+y;positions[i*3]=x/cols;positions[i*3+1]=y/(rows-1);seeds[i]=(i*.61803398875)%1;}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('seed',new T.BufferAttribute(seeds,1));
   const targetData=new Float32Array(count*4),targetAttribute=new T.BufferAttribute(targetData,4);geometry.setAttribute('assemblyTarget',targetAttribute);
   const logoData=new Float32Array(count*4),logoAttribute=new T.BufferAttribute(logoData,4);geometry.setAttribute('logoTarget',logoAttribute);
   const loadLogo=new Promise<void>(resolve=>{
    const artwork=new Image();artwork.onload=()=>{
     if(cancelled){resolve();return;}
     const mask=document.createElement('canvas');mask.width=470;mask.height=380;const ink=mask.getContext('2d',{willReadFrequently:true});if(!ink){resolve();return;}
     ink.drawImage(artwork,290,322,470,380,0,0,470,380);const rgba=ink.getImageData(0,0,470,380).data,targets:number[][]=[];
     for(let y=0;y<380;y+=3)for(let x=0;x<470;x+=3){const k=(y*470+x)*4,r=rgba[k],g=rgba[k+1],b=rgba[k+2];if((r>220&&g>220&&b>220)||(r>140&&b>210&&g<170))targets.push([x,y,g<170?1:0]);}
     const amount=Math.min(targets.length,small?4000:7500),scale=Math.min(1,innerWidth/600)*.51;
     for(let n=0;n<amount;n++){const i=(n*7919)%count,t=targets[Math.floor(n*targets.length/amount)];logoData[i*4]=(t[0]-235)*scale/innerWidth*2;logoData[i*4+1]=-(t[1]-190)*scale/innerHeight*2;logoData[i*4+2]=t[2];logoData[i*4+3]=1;}
     logoAttribute.needsUpdate=true;resolve();
    };artwork.onerror=()=>resolve();artwork.src='/images/brand/digibuzz-approved.png';
   });
   const points=new T.Points(geometry,material);points.frustumCulled=false;scene.add(points);
   // Fine continuous meridians give the cloud the reference's woven light structure.
   const indices:number[]=[];for(let x=0;x<cols;x+=5)for(let y=0;y<rows-1;y++){indices.push(x*rows+y,x*rows+y+1);}
   for(let y=0;y<rows;y+=8)for(let x=0;x<cols-1;x++){indices.push(x*rows+y,(x+1)*rows+y);}
   const lineGeometry=geometry.clone();lineGeometry.setAttribute('assemblyTarget',targetAttribute);lineGeometry.setAttribute('logoTarget',logoAttribute);lineGeometry.setIndex(indices);
   const lineMaterial=new T.ShaderMaterial({uniforms:{...uniforms,filament:{value:1}},vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
   const threads=new T.LineSegments(lineGeometry,lineMaterial);threads.frustumCulled=false;scene.add(threads);
   const starCount=small?420:1900,stars=new Float32Array(starCount*3),sizes=new Float32Array(starCount);
   for(let i=0;i<starCount;i++){stars[i*3]=((i*.618034)%1-.5)*35;stars[i*3+1]=((i*.414214)%1-.5)*23;stars[i*3+2]=-3-(i*.754877%1)*15;sizes[i]=i*.56984%1;}
   const starGeometry=new T.BufferGeometry();starGeometry.setAttribute('position',new T.BufferAttribute(stars,3));starGeometry.setAttribute('seed',new T.BufferAttribute(sizes,1));
   const starMaterial=new T.ShaderMaterial({uniforms:{time:uniforms.time,pixelRatio:uniforms.pixelRatio},transparent:true,depthWrite:false,blending:T.AdditiveBlending,vertexShader:`attribute float seed;uniform float time,pixelRatio;varying float strength;void main(){vec3 p=position;p.x+=sin(time*.035+seed*13.)*.35;p.y+=cos(time*.025+seed*9.)*.2;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;strength=(.3+seed*.6)*(.75+.25*sin(time*.65+seed*30.));gl_PointSize=(.8+pow(seed,12.)*4.5)*pixelRatio;}`,fragmentShader:`varying float strength;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(.38,.5,1.,exp(-d*d*5.)*strength);}`});scene.add(new T.Points(starGeometry,starMaterial));
   let assemblyStart=-1;
   const assemble=(event:Event)=>{
    const {targets,width,height}=(event as CustomEvent<{targets:number[];width:number;height:number}>).detail;
    targetData.fill(0);const total=targets.length/2,used=Math.min(total,small?2400:15000);
    for(let n=0;n<used;n++){
     const i=(n*7919)%count,index=Math.floor(n*total/used)*2;
     targetData[i*4]=targets[index]/width*2-1;targetData[i*4+1]=1-targets[index+1]/height*2;
     targetData[i*4+2]=targets[index]/width;targetData[i*4+3]=1;
    }
    targetAttribute.needsUpdate=true;uniforms.seedSource.value=fusion.current>.5?1:0;assemblyStart=performance.now();
   };
   const cancelAssembly=()=>{assemblyStart=-1;uniforms.assembly.value=0;};
   window.addEventListener('digibuzz-assembly',assemble);window.addEventListener('digibuzz-assembly-cancel',cancelAssembly);
   const core=new T.Vector3();
   const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,elapsed=0,first=0,previous=-1,frames=0,cost=0,adapted=false,notified=false,launchTime=0,tiltProgress=0;
   const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(document.hidden)return;if(!first)first=now;
    if(now-last<13)return;const dt=Math.min(now-last,50);last=now;
    if(reduced.matches&&Math.abs(previous-journey.current)<.001&&uniforms.startup.value===1&&uniforms.handoff.value===1)return;
    if(!reduced.matches)elapsed+=dt*.001;
    if(launched.current&&!launchTime)launchTime=now;
    uniforms.handoff.value=launchTime?(reduced.matches?1:T.MathUtils.smootherstep(now-launchTime,0,1400)):0;
    uniforms.fusion.value=fusion.current;uniforms.time.value=elapsed;uniforms.journey.value=journey.current*uniforms.handoff.value;uniforms.startup.value=reduced.matches?1:T.MathUtils.smoothstep(now-first,0,3400);previous=journey.current;
    if(assemblyStart>=0){const age=now-assemblyStart;uniforms.assembly.value=Math.min(1,age/1050);uniforms.assemblyFade.value=1-T.MathUtils.smoothstep(age,1050,1550);if(age>1600)cancelAssembly();}
    uniforms.logoMix.value=T.MathUtils.smootherstep(now-first,1200,3200)*(1-uniforms.handoff.value);
    const tiltTarget=journey.current>=5.999?1:0;
    // A bounded timeline gives the winding and release equal time, without
    // an exponential snap at the beginning or a long settling tail.
    tiltProgress=reduced.matches?tiltTarget:T.MathUtils.clamp(tiltProgress+(tiltTarget?1:-1)*dt/2300,0,1);
    uniforms.galaxyTilt.value=T.MathUtils.smootherstep(tiltProgress,0,1);
    const progress=uniforms.journey.value;
    const entry=T.MathUtils.smoothstep(progress,.22,.97),release=T.MathUtils.smoothstep(progress,1.32,1.99);
    camera.position.z=T.MathUtils.lerp(10-9.6*entry*(1-release),10,fusion.current);
    camera.rotation.z=Math.sin(Math.min(1,progress)*Math.PI)*.075;
    camera.fov=48+entry*(1-release)*12;
    camera.updateProjectionMatrix();camera.updateMatrixWorld();
    const chapter=Math.floor(progress+.001);
    core.set(chapter===0?(small?0:innerWidth/innerHeight*1.9)*(1-entry)*uniforms.handoff.value:0,chapter===0&&small?-1.65*(1-entry)*uniforms.handoff.value:chapter===3||chapter===4?-2.05:chapter===6?-.8:0,0).multiplyScalar(1-fusion.current).project(camera);
    const parent=container.parentElement;
    if(parent){parent.style.setProperty('--core-x',`${Math.max(0,Math.min(innerWidth,(core.x*.5+.5)*innerWidth))}px`);parent.style.setProperty('--core-y',`${Math.max(0,Math.min(innerHeight,(-core.y*.5+.5)*innerHeight))}px`);}
    const started=performance.now();composer.render();cost+=Math.max(performance.now()-started,dt);frames++;
    if(frames===90&&!adapted&&cost/frames>27){renderer.setPixelRatio(1);composer.setPixelRatio(.7);uniforms.pixelRatio.value=1;adapted=true;}
    container.dataset.ready='true';if(!notified){notified=true;onReady();}
   };
   const resize=()=>{renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();uniforms.mobile.value=innerWidth<760?1:0;uniforms.viewAspect.value=innerWidth/innerHeight;};window.addEventListener('resize',resize);
   cleanup=()=>{window.removeEventListener('digibuzz-assembly',assemble);window.removeEventListener('digibuzz-assembly-cancel',cancelAssembly);cancelAnimationFrame(raf);window.removeEventListener('resize',resize);geometry.dispose();lineGeometry.dispose();starGeometry.dispose();material.dispose();lineMaterial.dispose();starMaterial.dispose();bloom.dispose();composer.dispose();renderer.dispose();renderer.domElement.remove();};
   loadLogo.then(()=>renderer.compileAsync(scene,camera)).then(()=>{if(!cancelled)raf=requestAnimationFrame(draw);}).catch(()=>{if(!cancelled)raf=requestAnimationFrame(draw);});
  }).catch(()=>{container.dataset.fallback='true';onReady();});
  return()=>{cancelled=true;cleanup();};
 },[journey,fusion,launched,onReady]);
 return <div ref={host} className="universe-scene" aria-hidden="true"><div className="universe-static-gate"/></div>;
}
