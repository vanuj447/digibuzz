'use client';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowLeft, Check, LoaderCircle } from 'lucide-react';
import { enquiryServices, objectives, budgets, timelines, enquirySchema } from '@/lib/enquiry';
const steps=['Personal & business details','Business information','Services required','Marketing requirements','Budget & expectations'];
const sections=[['name','business','phone','email','websiteUrl','instagram','location'],['industry','offering','businessAge','audience'],['services'],['objective','runningAds','marketingTeam','challenges'],['budget','timeline','details','consent']];
function Field({name,label,optional=false,type='text',area=false,options,autoComplete}:{name:string;label:string;optional?:boolean;type?:string;area?:boolean;options?:readonly string[];autoComplete?:string}){return <label>{label}{optional&&<small>Optional</small>}{options?<select name={name} required={!optional} defaultValue=""><option value="" disabled>Select an option</option>{options.map(v=><option key={v}>{v}</option>)}</select>:area?<textarea name={name} required={!optional} rows={3} maxLength={name==='details'?3000:1500}/>:<input name={name} type={type} required={!optional} maxLength={type==='email'?254:160} autoComplete={autoComplete}/>}</label>}
export default function EnquiryForm(){
 const [step,setStep]=useState(0),[busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState('');
 const form=useRef<HTMLFormElement>(null),requestId=useRef('');
 function move(next:number){setError('');setStep(next);requestAnimationFrame(()=>{const box=form.current?.querySelector<HTMLElement>('.enquiry-step:not([hidden])');box?.focus();form.current?.querySelector('.enquiry-body')?.scrollTo({top:0});});}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;const node=event.currentTarget;
  for(const input of Array.from(node.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>(`.enquiry-step:not([hidden]) input,.enquiry-step:not([hidden]) select,.enquiry-step:not([hidden]) textarea`)))if(!input.reportValidity())return;
  const data=new FormData(node);if(step===2&&!data.getAll('services').length){setError('Select at least one service.');return;}
  if(step<4){move(step+1);return;}
  if(!requestId.current)requestId.current=crypto.randomUUID();
  const values={...Object.fromEntries(data),services:data.getAll('services'),consent:data.get('consent')==='on',requestId:requestId.current};
  const parsed=enquirySchema.safeParse(values);
  if(!parsed.success){const field=String(parsed.error.issues[0].path[0]);const index=sections.findIndex(s=>s.includes(field));if(index>=0)move(index);setError(parsed.error.issues[0].message);return;}
  setBusy(true);setError('');
  try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data),signal:AbortSignal.timeout(25000)});const result=await response.json();if(!response.ok||!result.ok)throw Error(result.error||'Your enquiry could not be sent.');setSent(true);}
  catch(reason){setError(reason instanceof Error?reason.message:'Connection interrupted. Please try again.');}finally{setBusy(false);}
 }
 if(sent)return <div className="enquiry-form enquiry-success" role="status"><Check size={40}/><h3>Enquiry received.</h3><p>Thank you. Your business brief has been saved and our team will be in touch.</p></div>;
 return <form ref={form} className="enquiry-form enquiry-wizard" onSubmit={submit} noValidate aria-label="DigiBuzz client enquiry form">
 <div className="enquiry-heading"><span>CLIENT ENQUIRY</span><span>{step+1} / 5</span></div><div className="enquiry-progress" aria-label={`Step ${step+1} of 5`}>{steps.map((title,i)=><span key={title} className={i<=step?'is-complete':''}/>)}</div>
 <div className="enquiry-body">
 <fieldset className="enquiry-step" hidden={step!==0} tabIndex={-1}><legend>{steps[0]}</legend><div className="enquiry-fields"><Field name="name" label="Full name" autoComplete="name"/><Field name="business" label="Business / brand name" autoComplete="organization"/><Field name="phone" label="Contact number (WhatsApp)" type="tel" autoComplete="tel"/><Field name="email" label="Business email address" type="email" autoComplete="email"/><Field name="websiteUrl" label="Website URL" type="url" optional/><Field name="instagram" label="Instagram handle" optional/></div><Field name="location" label="Business location" autoComplete="address-level2"/></fieldset>
 <fieldset className="enquiry-step" hidden={step!==1} tabIndex={-1}><legend>{steps[1]}</legend><Field name="industry" label="Which industry does your business belong to?"/><Field name="offering" label="What products or services do you offer?" area/><Field name="businessAge" label="How long has your business been operating?" options={['Pre-launch','Less than 1 year','1–3 years','3–5 years','More than 5 years']}/><Field name="audience" label="Who is your target audience?" area/></fieldset>
 <fieldset className="enquiry-step" hidden={step!==2} tabIndex={-1}><legend>{steps[2]}</legend><p>Select every service you’re interested in.</p><div className="enquiry-choices">{enquiryServices.map(service=><label key={service}><input type="checkbox" name="services" value={service}/><span>{service}</span></label>)}</div></fieldset>
 <fieldset className="enquiry-step" hidden={step!==3} tabIndex={-1}><legend>{steps[3]}</legend><Field name="objective" label="Your primary marketing objective" options={objectives}/><div className="enquiry-fields"><Field name="runningAds" label="Currently running advertisements?" options={['Yes','No']}/><Field name="marketingTeam" label="Existing marketing team or agency?" options={['In-house team','Agency','Both','Neither']}/></div><Field name="challenges" label="What marketing challenges are you facing?" area/></fieldset>
 <fieldset className="enquiry-step" hidden={step!==4} tabIndex={-1}><legend>{steps[4]}</legend><Field name="budget" label="Expected monthly marketing budget" options={budgets}/><Field name="timeline" label="When are you planning to start?" options={timelines}/><Field name="details" label="Additional requirements / project details" optional area/><label className="enquiry-consent"><input type="checkbox" name="consent" required/><span>I agree to be contacted about this enquiry and have read the <a href="/privacy" target="_blank" rel="noreferrer">privacy notice</a>.</span></label></fieldset>
 <div hidden aria-hidden="true"><input name="companyFax" tabIndex={-1} autoComplete="off"/></div>
 </div>{error&&<p role="alert" className="enquiry-error">{error}</p>}
 <div className="enquiry-actions">{step>0&&<button type="button" disabled={busy} onClick={()=>move(step-1)}><ArrowLeft size={16}/> Back</button>}<button type="submit" disabled={busy}>{busy?<><LoaderCircle size={16} className="spin"/> Sending…</>:step===4?<>Submit enquiry <ArrowRight size={16}/></>:<>Continue <ArrowRight size={16}/></>}</button></div><p className="enquiry-note">{step===4?'Your enquiry goes directly to our team.':'Your answers stay here as you move between steps.'}</p>
 </form>;
}
