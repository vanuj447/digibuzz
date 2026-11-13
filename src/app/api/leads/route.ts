import { leadSchema } from '@/lib/validation';
export const runtime='nodejs';
export async function POST(req:Request){
 const origin=req.headers.get('origin');const allowed=new URL(process.env.SITE_URL||'https://digibuzzmarketing.in').origin;
 if(!origin||origin!==allowed)return Response.json({error:'This request origin is not permitted.'},{status:403});
 if(!req.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Expected JSON.'},{status:415});
 try{
 const reader=req.body?.getReader();if(!reader)return Response.json({error:'Missing enquiry.'},{status:400});let size=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();return Response.json({error:'Enquiry is too large.'},{status:413});}chunks.push(value);}const input=JSON.parse(Buffer.concat(chunks).toString('utf8'));
 const parsed=leadSchema.safeParse(input);if(!parsed.success)return Response.json({error:'Please check the form fields.',fields:parsed.error.flatten().fieldErrors},{status:400});const data=parsed.data;
 if(data.website)return Response.json({error:'The enquiry could not be accepted.'},{status:400});
 const secret=process.env.TURNSTILE_SECRET_KEY;
 if(process.env.NODE_ENV==='production'&&!secret)return Response.json({error:'Enquiries are not enabled yet. Please try again after the site launches.'},{status:503});
 if(secret){const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:data.turnstileToken}),signal:AbortSignal.timeout(10000)});const result=await verification.json();if(!verification.ok||!result.success||result.hostname!==new URL(allowed).hostname)return Response.json({error:'Please complete the security check and try again.'},{status:400});}
 const {website:_website,turnstileToken:_token,...lead}=data;void _website;void _token;
 const webhook=process.env.LEAD_WEBHOOK_URL;
 let delivered=false;
 if(webhook){if(new URL(webhook).protocol!=='https:')throw Error('Invalid webhook');const res=await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.LEAD_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({...lead,source:'digibuzz-website'}),signal:AbortSignal.timeout(10000)});if(!res.ok)throw Error('Delivery rejected');delivered=true;}
 else if(process.env.RESEND_API_KEY&&process.env.LEAD_FROM_EMAIL&&process.env.LEAD_TO_EMAIL){const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.LEAD_FROM_EMAIL,to:[process.env.LEAD_TO_EMAIL],reply_to:data.email,subject:`DigiBuzz enquiry: ${data.business}`,text:Object.entries(lead).map(([k,v])=>`${k}: ${v}`).join('\n\n')}),signal:AbortSignal.timeout(10000)});if(!res.ok)throw Error('Delivery rejected');delivered=true;}
 if(!delivered)return Response.json({error:'Lead delivery is not configured yet. No enquiry was sent. Please try again once the agency contact details are available.'},{status:503});
 return Response.json({ok:true});
 }catch(e){if(e instanceof SyntaxError)return Response.json({error:'Invalid request.'},{status:400});return Response.json({error:'We couldn’t deliver your enquiry. Please try again shortly.'},{status:502});}
}
