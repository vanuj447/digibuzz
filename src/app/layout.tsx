import type { Metadata, Viewport } from 'next';
import { Navigation, Footer } from '@/components/Shell';
import { site } from '@/data/site';
import '@fontsource-variable/space-grotesk';
import './globals.css';
import './universe.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:'DigiBuzz Marketing — Impossible to Ignore',template:'%s | DigiBuzz Marketing'},description:site.description,alternates:{canonical:'/'},openGraph:{type:'website',siteName:site.name,title:'DigiBuzz Marketing — Impossible to Ignore',description:site.description,images:['/opengraph-image']},twitter:{card:'summary_large_image'},robots:process.env.NEXT_PUBLIC_SITE_LIVE==='true'?{index:true,follow:true}:{index:false,follow:false}};
export const viewport:Viewport={themeColor:'#08070d'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Navigation/><main id="main">{children}</main><Footer/></body></html>}
