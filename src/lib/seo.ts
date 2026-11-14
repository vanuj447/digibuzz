import { site } from '@/data/site';
import { services } from '@/data/services';
export const businessSchema={
 '@context':'https://schema.org','@graph':[
  {'@type':'Organization','@id':`${site.url}/#organization`,name:site.name,alternateName:'DigiBuzz',url:site.url,logo:`${site.url}/images/brand/digibuzz-symbol.png`,description:site.description,email:site.email,telephone:site.phone,sameAs:[site.socials.instagram],areaServed:['Karnal','Chandigarh','Delhi','Gurugram'].map(name=>({'@type':'City',name})),hasOfferCatalog:{'@type':'OfferCatalog',name:'Digital marketing services',itemListElement:services.map(service=>({'@type':'Offer',itemOffered:{'@type':'Service',name:service.name,description:service.description,provider:{'@id':`${site.url}/#organization`}}}))}},
  {'@type':'WebSite','@id':`${site.url}/#website`,url:site.url,name:site.name,alternateName:'DigiBuzz',publisher:{'@id':`${site.url}/#organization`},inLanguage:'en-IN'}
 ]
};
