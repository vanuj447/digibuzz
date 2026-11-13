import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
export default function robots():MetadataRoute.Robots {return {rules:{userAgent:'*',...(process.env.NEXT_PUBLIC_SITE_LIVE==='true'?{allow:'/',disallow:'/api/'}:{disallow:'/'})},sitemap:`${site.url}/sitemap.xml`};}
