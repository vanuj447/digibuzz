import { z } from 'zod';
import { services } from '@/data/services';
export const leadSchema=z.object({name:z.string().trim().min(2,'Please enter your name.').max(100),business:z.string().trim().min(2,'Please enter your business name.').max(160),email:z.email('Enter a valid email address.').max(254),phone:z.string().trim().regex(/^[+\d\s().-]{7,25}$/,'Enter a valid phone or WhatsApp number.'),service:z.string().refine(v=>services.some(s=>s.name===v),'Choose a service.'),budget:z.string().max(80),message:z.string().trim().min(20,'Tell us a little more (at least 20 characters).').max(4000),consent:z.literal(true,{error:'Please agree to the privacy notice.'}),website:z.string().max(200),turnstileToken:z.string().max(2048)});
export type LeadInput=z.infer<typeof leadSchema>;
