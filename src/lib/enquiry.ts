import { z } from 'zod';
export const enquiryServices=['Social Media Management','Performance Marketing (Meta & Google Ads)','Content Creation & Professional Shoots','AI Videos & CGI Advertisements','AI Influencer Marketing','Influencer Marketing','Branding & Creative Strategy','Complete Digital Marketing Solutions'] as const;
export const objectives=['Brand Awareness','Lead Generation','Sales & Conversions','Social Media Growth','Brand Positioning','Product Launch'] as const;
export const budgets=['Below ₹50,000','₹50,000 – ₹1,00,000','₹1,00,000 – ₹2,00,000','Above ₹2,00,000'] as const;
export const timelines=['Immediately','Within 15 Days','Within 30 Days','Just Exploring'] as const;
const text=(max=300)=>z.string().trim().min(2,'Please complete this field.').max(max);
export const enquirySchema=z.object({
 name:text(100),business:text(160),phone:z.string().trim().regex(/^[+\d\s().-]{7,25}$/,'Enter a valid WhatsApp number.'),email:z.email('Enter a valid email address.').max(254),
 websiteUrl:z.union([z.literal(''),z.url().refine(v=>/^https?:\/\//.test(v),'Use an https:// website URL.')]).default(''),instagram:z.string().trim().max(200).default(''),location:text(200),
 industry:text(160),offering:text(1500),businessAge:text(100),audience:text(1000),services:z.array(z.enum(enquiryServices)).min(1,'Select at least one service.').max(8),
 objective:z.enum(objectives),runningAds:z.enum(['Yes','No']),marketingTeam:z.enum(['In-house team','Agency','Both','Neither']),challenges:text(2000),budget:z.enum(budgets),timeline:z.enum(timelines),details:z.string().trim().max(3000).default(''),consent:z.literal(true),companyFax:z.string().max(200).default(''),requestId:z.uuid()
});
export type Enquiry=z.infer<typeof enquirySchema>;
