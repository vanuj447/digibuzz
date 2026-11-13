# DigiBuzz Marketing

A Next.js website built as a seven-chapter spatial story. Real client reels, supplied Instagram accounts, inline service details, and a WhatsApp enquiry form. No CMS or invented campaign metrics.

## Run locally

```sh
npm ci
npm run dev
```

For the production preview:

```sh
npm run build
npm start
```

Open http://127.0.0.1:3000. The optional enquiry API uses the configuration documented in `.env.example`; the current homepage form prepares a WhatsApp message.

## Current experience

- `src/components/UniverseHome.tsx`: native scroll position, chapter navigation, synchronized transitions, and startup readiness.
- `src/components/universe/StoryChapters.tsx`: entirely new hero, studio assembly, inline service expansion, autonomous six-step process and reel reveal, curved reel gallery, client Instagram profiles, and enquiry form.
- `src/components/UniverseScene.tsx`: GPU particle surface, filaments, bloom, and the camera crossing through the opening sphere. One particle population persists through the studio interior, stream, terrain, vortex, and galaxy.
- `src/app/universe.css`: spatial layouts, perspective transforms, continuous ambient motion, responsive compositions, and reduced-motion alternatives.
- `src/components/universe/Startup.tsx`: a branded burst that waits for the scene’s first frame.
- `src/components/universe/EnquiryForm.tsx`: validated fields that open a prepared WhatsApp message. The visitor sends it there; the form does not report an email or CRM delivery.

The WebGL renderer caps resolution, reduces particle counts on mobile, lowers resolution on expensive renders, and pauses hidden tabs. Reduced motion removes camera interpolation and ambient animation. Only the current chapter is mounted and interactive. The How we work reel unfolds inline and loads Instagram only when requested. Standalone service URLs redirect to the current services section.

The retired laptop, tunnel, studio-home, generic section components, model assets, decoder files, unused animation packages, and their CSS have been removed. Legacy about/work/reels/contact URLs redirect into the current story. Draft blog and project pages redirect rather than displaying obsolete layouts.

## Content

Edit `src/data/site.ts` for contact details, client accounts, and reels; edit `src/data/services.ts` for service copy. Reel covers are the real public Instagram covers saved in `public/images/reels`, with source records alongside them. Refresh them using `scripts/fetch_reel_thumbnails.py` when needed. No view counts or performance claims are inferred from those covers.

The approved logo is in `public/images/brand/digibuzz-approved.png` and rendered by `src/components/Shell.tsx`. The supplied reference video is used for visual direction, not presented as DigiBuzz client work. Legal pages remain owner-review drafts.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Deploy on Netlify

Import this GitHub repository into Netlify and select the `main` branch. `netlify.toml` configures Node 22, `npm run build`, and the `.next` publish directory. Netlify automatically installs its Next.js adapter; do not choose static export or add an SPA catch-all redirect. The lockfile pins dependencies for reproducible installs.

The homepage and WhatsApp enquiry form need no environment secrets. When the final domain and legal copy are ready, set `NEXT_PUBLIC_SITE_LIVE=true` in Netlify and redeploy to enable search indexing. Canonical URLs use `https://digibuzzmarketing.in` in `src/data/site.ts`; change that value if your final domain differs. Preview deployments should keep indexing disabled.

The optional `/api/leads` route is separate from the WhatsApp form. To enable it, configure Turnstile and an email or webhook delivery provider using `.env.example`, with `SITE_URL` set to the deployed origin. Store secrets only in Netlify environment variables. Never commit `.env` files or GitHub tokens.

After deployment, check startup, section navigation, reel links, and the WhatsApp enquiry flow on desktop and mobile.
