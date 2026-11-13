import { enquirySchema } from '@/lib/enquiry';
export const runtime='nodejs';
export async function POST(req:Request){
 const origin=req.headers.get('origin');
 const allowed=[process.env.SITE_URL,process.env.URL,process.env.DEPLOY_PRIME_URL,'https://digibuzzmarketing.in',...(process.env.NODE_ENV!=='production'?['http://localhost:3000','http://127.0.0.1:3000']:[])].filter(Boolean);
 if(!origin||!allowed.some(url=>{try{return new URL(url!).origin===origin}catch{return false}}))return Response.json({error:'This request origin is not permitted.'},{status:403});
 if(!req.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Expected JSON.'},{status:415});
 try{
  const reader=req.body?.getReader();if(!reader)return Response.json({error:'Missing enquiry.'},{status:400});
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>24000){await reader.cancel();return Response.json({error:'Your enquiry is too long.'},{status:413});}chunks.push(value);}
  const parsed=enquirySchema.safeParse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  if(!parsed.success)return Response.json({error:'Please check the highlighted fields.',fields:parsed.error.flatten().fieldErrors},{status:400});
  if(parsed.data.companyFax)return Response.json({error:'Your enquiry could not be accepted.'},{status:400});
  const endpoint=process.env.GOOGLE_SHEETS_WEB_APP_URL,token=process.env.GOOGLE_SHEETS_SHARED_SECRET;
  if(!endpoint||!token)return Response.json({error:'Online enquiries are temporarily unavailable. Please contact us using the separate WhatsApp link.'},{status:503});
  const target=new URL(endpoint);if(target.protocol!=='https:'||target.hostname!=='script.google.com'||!target.pathname.endsWith('/exec'))throw Error('Invalid receiver');
  const {companyFax,...enquiry}=parsed.data;void companyFax;
  const result=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,enquiry}),signal:AbortSignal.timeout(20000),cache:'no-store'});
  const receipt=await result.json();
  if(!result.ok||receipt.ok!==true||receipt.requestId!==enquiry.requestId)throw Error('Enquiry was not acknowledged');
  return Response.json({ok:true,requestId:enquiry.requestId});
 }catch(error){return Response.json({error:error instanceof SyntaxError?'Invalid enquiry.':'We couldn’t confirm your submission. Please try again; your answers are still here.'},{status:error instanceof SyntaxError?400:502});}
}
