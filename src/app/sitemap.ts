import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
export default function sitemap():MetadataRoute.Sitemap{return ['', '/digital-marketing'].map(path=>({url:`${site.url}${path||'/'}`,changeFrequency:'monthly',priority:path?.8:1}));}
