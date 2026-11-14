import UniverseHome from '@/components/UniverseHome';
import { businessSchema } from '@/lib/seo';
export default function Home(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(businessSchema).replace(/</g,'\\u003c')}}/><UniverseHome/></>}
