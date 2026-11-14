# DigiBuzz search launch checklist

## Production deployment

1. Connect digibuzzmarketing.in in Netlify, enable HTTPS, select the non-www hostname as primary, and redirect alternate domains to it. Keep preview deploys out of search. Canonical metadata uses https://digibuzzmarketing.in.
2. Complete the privacy and terms drafts and confirm the contact details and service areas.
3. Set NEXT_PUBLIC_SITE_LIVE=true for the production deployment only, then rebuild/deploy. The default false deliberately blocks indexing. Leave branch previews false. Set SITE_URL=https://digibuzzmarketing.in for production form origin validation.
4. Open /robots.txt and confirm Allow: / and Disallow: /api/. Inspect homepage HTML for index,follow and the correct canonical. Check that Netlify does not add an X-Robots-Tag: noindex response header on the primary domain.
5. Open /sitemap.xml. It should contain the homepage and /digital-marketing, not redirected or draft pages.
6. Check the favicon in a fresh browser tab. The supplied arrow-and-dot PNG is embedded unchanged in /icon.svg and copied as the Apple touch icon. Browsers and Google can cache an earlier icon.
7. Test the contact form end to end against your own Google Sheet; check required fields, successful receipt, error handling and mobile scrolling.

## Search Console

1. Add a Domain property for digibuzzmarketing.in in Google Search Console.
2. Add Google's supplied TXT verification record at your DNS provider. Alternatively, use the URL-prefix verification token in GOOGLE_SITE_VERIFICATION and redeploy.
3. Submit https://digibuzzmarketing.in/sitemap.xml.
4. Inspect the homepage and /digital-marketing with URL Inspection, run the live test, and request indexing. Check rendered HTML, canonical and indexability.
5. Monitor Pages, Sitemaps and Core Web Vitals. Fix indexing exclusions before repeatedly requesting indexing.
6. Review branded queries (DigiBuzz, DigiBuzz Marketing) separately from service/location queries. Measure enquiry conversions as well as impressions and clicks.

## Local visibility

- If eligible for Google Business Profile through in-person customer contact, claim and verify the real business. Use the real business name, appropriate primary category, phone, domain, hours, services, genuine photos and accurate service area.
- Do not create fictional offices or a separate profile in every target city. A website service area does not establish a physical office. Online-only businesses may not be eligible.
- Keep DigiBuzz's business name, phone and website consistent across Instagram, client credits and reputable directories.
- Ask actual clients for honest reviews without incentives. Respond constructively and keep the profile current.
- Add substantial, approved case studies: client/industry, objective, creative work, dates, scope, and verified outcomes. Link related services and cities naturally.
- Create separate city pages only when there is enough distinct, useful local content (actual projects, logistics, local expertise and evidence). Avoid duplicating one page and replacing the city name.
- Earn relevant mentions and links through clients, partners and local organisations. Avoid purchased bulk links, fake reviews and keyword stuffing.

## Ongoing improvements

Use PageSpeed Insights and Search Console field data to evaluate mobile LCP, INP and CLS. Test lower-powered Android devices and real touch gestures; a successful build does not prove mobile performance. Review animation cost, image payloads and enquiry completion.

Ranking is not guaranteed. Local results depend on relevance, distance and prominence, and competitive city queries usually require sustained evidence and reputation. Google decides whether and when pages and favicons appear.

References:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://support.google.com/business/answer/7091
- https://support.google.com/business/answer/3038177
