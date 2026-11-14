import type { Metadata } from 'next';
import { Capabilities } from '@/components/universe/StoryChapters';
import { site } from '@/data/site';
import { businessSchema } from '@/lib/seo';
import './services.css';
export const metadata:Metadata={title:'Digital Marketing Services in Karnal, Chandigarh & Delhi NCR',description:'Explore DigiBuzz’s social media, advertising, content production, branding and AI & CGI services for businesses in Karnal, Chandigarh, Delhi and Gurugram.',alternates:{canonical:'/digital-marketing'},openGraph:{title:'DigiBuzz Digital Marketing Services',description:site.description,url:`${site.url}/digital-marketing`,images:['/opengraph-image']}};
export default function ServicesPage(){return <div className="services-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(businessSchema).replace(/</g,'\\u003c')}}/><Capabilities standalone/></div>}
