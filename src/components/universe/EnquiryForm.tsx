'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import { services } from '@/data/services';
import { site } from '@/data/site';
export default function EnquiryForm(){
 const [prepared,setPrepared]=useState(false);
 function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);const message=`Hi DigiBuzz! I'd like to discuss a project.\n\nName: ${data.get('name')}\nBusiness: ${data.get('business')}\nService: ${data.get('service')}\nProject: ${data.get('message')}`;window.open(`https://wa.me/${site.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');setPrepared(true);}
 return <form className="enquiry-form" onSubmit={submit}><div className="enquiry-heading"><MessageCircle size={20}/><span>TELL US WHAT YOU HAVE IN MIND</span></div><div className="enquiry-fields"><label>Your name<input name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={100}/></label><label>Business / brand<input name="business" autoComplete="organization" placeholder="Your brand name" required maxLength={120}/></label></div><label>What can we help with?<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(s=><option key={s.slug}>{s.name}</option>)}<option>A mix of services</option></select></label><label>A little about your project<textarea name="message" rows={3} maxLength={2000} required placeholder="Your idea, goals, or what you’d like to change…"/></label><button type="submit">Continue on WhatsApp <ArrowUpRight size={17}/></button><p className="enquiry-note">Opens WhatsApp with your enquiry ready to send.</p>{prepared&&<p role="status" className="enquiry-status"><Check size={15}/> Your message is prepared. Send it in WhatsApp to reach our team.</p>}</form>;
}
