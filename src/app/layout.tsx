import type { Metadata, Viewport } from 'next';
import { Navigation, Footer } from '@/components/Shell';
import { site } from '@/data/site';
import '@fontsource-variable/space-grotesk';
import './globals.css';
import './universe.css';
export const metadata:Metadata={
 metadataBase:new URL(site.url),
 title:{default:'DigiBuzz Marketing | Digital Marketing in Karnal & Chandigarh',template:'%s | DigiBuzz Marketing'},
 description:site.description,alternates:{canonical:'/'},
 applicationName:site.name,category:'Digital marketing',
 openGraph:{type:'website',locale:'en_IN',url:site.url,siteName:site.name,title:'DigiBuzz Marketing | Digital Marketing & Creative Agency',description:site.description,images:[{url:'/opengraph-image',width:1200,height:630,alt:'DigiBuzz Marketing — Strategy, creativity and performance'}]},
 twitter:{card:'summary_large_image',title:site.name,description:site.description,images:['/opengraph-image']},
 icons:{shortcut:'/images/brand/digibuzz-symbol.png'},
 verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined},
 robots:process.env.NEXT_PUBLIC_SITE_LIVE==='true'?{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}}:{index:false,follow:false}
};
export const viewport:Viewport={themeColor:'#08070d'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Navigation/><main id="main">{children}</main><Footer/></body></html>}
