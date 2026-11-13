import { ImageResponse } from 'next/og';
export const alt='DigiBuzz Marketing — The future of growth starts here';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{width:'100%',height:'100%',background:'radial-gradient(ellipse at 85% 80%, #56108c, #08070d 65%)',color:'#f8f7ff',display:'flex',flexDirection:'column',padding:70,justifyContent:'space-between',fontFamily:'sans-serif'}}><div style={{fontSize:32,display:'flex'}}>digibuzz ↗</div><div style={{fontSize:86,fontWeight:800,lineHeight:.95,display:'flex',flexDirection:'column'}}><span>THE FUTURE OF</span><span style={{color:'#c56bff'}}>GROWTH STARTS HERE.</span></div><div style={{display:'flex',fontSize:18,letterSpacing:5}}>STRATEGY / CREATIVITY / PERFORMANCE</div></div>,size);}
