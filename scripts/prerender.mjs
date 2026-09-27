// Build step 3/3: pre-render the React app to static HTML and generate SEO files.
//  - Injects the rendered page into dist/index.html (crawlers and link previews
//    see real content without running JavaScript; the browser hydrates it).
//  - Writes <head> SEO tags and JSON-LD structured data from src/config.ts and
//    src/content.ts, so they always match what's on the page.
//  - Generates dist/sitemap.xml and dist/robots.txt for the configured site URL.
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");
const ssr = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);
const { site, services, faqs, toolbox, projects } = ssr;

const url = site.url.replace(/\/$/, "");
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const today = new Date().toISOString().slice(0, 10);

// Preload the main display font so the headline renders without a late swap.
const assets = readdirSync(resolve(dist, "assets"));
const mainFont = assets.find((f) => f.startsWith("bricolage-grotesque") && f.endsWith(".woff2"));

const sameAs = [site.linkedin, site.facebook, site.instagram].filter(Boolean);
const shareImage = `${url}/og-image.png`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: site.name,
      url: `${url}/`,
      logo: { "@type": "ImageObject", url: `${url}/brand/servalyn-logo-512.png`, width: 512, height: 512 },
      image: shareImage,
      description: site.seo.description,
      ...(site.email ? { email: site.email } : {}),
      ...(site.phone ? { telephone: site.phone } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      knowsAbout: toolbox.flatMap((row) => row.tools),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.summary,
            provider: { "@id": `${url}/#organization` },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url: `${url}/`,
      name: site.name,
      inLanguage: "en",
      publisher: { "@id": `${url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}/#webpage`,
      url: `${url}/`,
      name: site.seo.title,
      description: site.seo.description,
      inLanguage: "en",
      isPartOf: { "@id": `${url}/#website` },
      about: { "@id": `${url}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: shareImage, width: 1200, height: 630 },
      dateModified: today,
    },
    {
      "@type": "ItemList",
      "@id": `${url}/#work`,
      name: "Selected work",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "WebSite",
          name: p.name,
          url: p.url,
          description: p.summary,
          image: `${url}${p.image.src}`,
          creator: { "@id": `${url}/#organization` },
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const head = [
  `<title>${esc(site.seo.title)}</title>`,
  `<meta name="description" content="${esc(site.seo.description)}" />`,
  `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
  `<meta name="author" content="${esc(site.name)}" />`,
  `<link rel="canonical" href="${url}/" />`,
  `<meta property="og:type" content="website" />`,
  `<meta property="og:site_name" content="${esc(site.name)}" />`,
  `<meta property="og:locale" content="${esc(site.seo.locale)}" />`,
  `<meta property="og:url" content="${url}/" />`,
  `<meta property="og:title" content="${esc(site.seo.shareTitle)}" />`,
  `<meta property="og:description" content="${esc(site.seo.shareDescription)}" />`,
  `<meta property="og:image" content="${shareImage}" />`,
  `<meta property="og:image:width" content="1200" />`,
  `<meta property="og:image:height" content="630" />`,
  `<meta property="og:image:alt" content="Servalyn — Software that pounces. Websites, software, automation and AI." />`,
  `<meta name="twitter:card" content="summary_large_image" />`,
  `<meta name="twitter:title" content="${esc(site.seo.shareTitle)}" />`,
  `<meta name="twitter:description" content="${esc(site.seo.shareDescription)}" />`,
  `<meta name="twitter:image" content="${shareImage}" />`,
  mainFont ? `<link rel="preload" href="/assets/${mainFont}" as="font" type="font/woff2" crossorigin />` : "",
  `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
]
  .filter(Boolean)
  .map((line) => `    ${line}`)
  .join("\n");

let html = readFileSync(resolve(dist, "index.html"), "utf8");
html = html
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace("<!--app-head-->", head.trimStart())
  .replace('<div id="root"></div>', `<div id="root">${ssr.render()}</div>`);
writeFileSync(resolve(dist, "index.html"), html);

writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`✓ Pre-rendered dist/index.html (${(html.length / 1024).toFixed(1)} kB) + sitemap.xml + robots.txt for ${url}`);
