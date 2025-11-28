SEO Quick Notes
================

What I added
- A reusable `Seo` component at `src/components/Seo/Seo.tsx` using `react-helmet-async` for per-page meta tags and social tags.
- A `JsonLd` helper at `src/components/Seo/JsonLd.tsx` for injecting schema.org JSON-LD.
- Wrapped the app with `HelmetProvider` in `src/App.tsx`.
- Added `public/sitemap.xml` and `public/robots.txt` (update the domain placeholder before deploy).

How to use
- Import `Seo` and `JsonLd` in any page and render near the top of the page component.

Example
```
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';

<Seo title="Page title" description="Short description" image={imageUrl} />
<JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "name": "Page" }} />
```

Notes & next steps
- Install the runtime dependency: `npm install react-helmet-async`.
- Update `public/sitemap.xml` domain entries to your production domain.
- Consider adding a build step to auto-generate sitemap.xml from dynamic routes or server-side data.
- Audit images to ensure each `<img>` has an `alt` attribute and add `loading="lazy"` for non-critical images.
