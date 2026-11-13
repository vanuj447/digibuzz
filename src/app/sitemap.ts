import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
export default function sitemap():MetadataRoute.Sitemap{return [''].map(path=>({url:`${site.url}/${path}`,changeFrequency:'monthly',priority:path?.7:1}));}
