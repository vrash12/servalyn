# Servalyn

Landing page for **Servalyn**, a digital studio for websites, custom software, mobile apps, automation, and AI.

Design direction: **bold editorial**. It uses warm paper, heavy condensed type, italic serif accents, one loud serval orange, and a serval spot print as the brand texture. Built with React 19, TypeScript, and Vite, with no UI or icon libraries.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev       # local dev server
npm run build     # type-check, build, pre-render HTML + SEO files into dist/
npm run preview   # serve the built site
```

## Page structure

| # | Section | Component | Notes |
| --- | --- | --- | --- |
| — | Header | `Header.tsx` | Sticky; full-screen orange menu on small screens |
| — | Hero | `Hero.tsx`, `HeroPreview.tsx` | "Software that pounces." The window in the headline cycles through small previews of what we build: website, dashboard, mobile app, automation flow, AI assistant, and integrations. It follows whichever service you hover in the index next to it. |
| — | Tapes | `Marquee.tsx` | Two crossing scrolling tapes |
| 01 | Why "Servalyn" | `Manifesto.tsx` | Statement that lights up word by word as you scroll, plus three field notes |
| 02 | Services | `Services.tsx` | Editorial numbered index; each row expands. "Discuss…" pre-fills the contact form |
| 03 | Selected work | `Work.tsx` | Live client projects: screenshot, what we delivered, stack, and a link to the live site. Edit `projects` in `src/content.ts`; screenshots live in `public/work/` |
| 04 | Approach | `Approach.tsx` | Listen → Map → Build → Launch → Stay, with a sticky heading |
| 05 | What we build | `Build.tsx` | Tappable chips; picks carry into the contact form |
| 06 | Standards | `Principles.tsx` | Four principles and the toolbox: 72 technologies in 11 groups, each with its logo |
| 07 | FAQ | `Faq.tsx` | Native `details` accordion |
| 08 | Contact | `Contact.tsx` | Form with validation, email-draft or endpoint mode |
| — | Footer | `Footer.tsx` | Full logo, links, and a giant spot-filled "Servalyn" |
| — | Dock & cursor | `Dock.tsx`, `Cursor.tsx` | Floating back-to-top/picks tray and pointer effects |

All copy lives in `src/content.ts`. Company details live in `src/config.ts`.

## Brand

- **Logo:** a front-facing serval, drawn as two shapes (ears and face) separated by a thin gap and filled with a warm orange gradient (`#9c3108` → `#f4511a` → `#ff9a3c`). It has big rounded ears with inner-ear cut-outs, almond cat eyes, the serval's tear stripes, a small nose, and three forehead spots. The lockup follows the Saola style: symbol, then "Servalyn", then "DIGITAL STUDIO" spread to the name's width, then the tagline "LISTEN · BUILD · LEAP" in the full version. In code it's `src/components/Logo.tsx`: `<Logo />` for the header, `<Logo variant="full" />` for the footer, and `<ServalMark />` for the symbol alone (`color`, `ink` or `cream`).
- **Logo files** (in `public/brand/`):
  - `servalyn-logo.svg`: full logo for light backgrounds
  - `servalyn-logo-dark.svg`: full logo for dark backgrounds
  - `servalyn-logo-compact.svg`: logo without the tagline
  - `servalyn-mark.svg`: the serval symbol alone
- **Favicon and share image:** the favicon is the serval symbol on ink (`favicon.svg`, `.ico`, `-96x96.png`, `apple-touch-icon.png`). `og-image.png` (1200×630) is the preview image shown when the link is shared on social media.
- **Spot print:** generated from a seed in `src/spots.ts`. `Spots.tsx` draws the print; with the `interactive` option, the spots scatter away from the pointer.
- **Type:** Bricolage Grotesque (display, body, logo), Instrument Serif Italic (accents), and JetBrains Mono (labels). All are self-hosted via Fontsource.
- **Colours** (`src/styles/tokens.css`):

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f2ede3` | Page background |
| `--paper-deep` | `#e7e0d2` | Alternate sections |
| `--ink` | `#141210` | Text, dark sections |
| `--orange` | `#ff5b1f` | Brand accent |
| `--orange-text` | `#e84a10` | Orange for large type on paper |
| `--orange-deep` | `#c2410c` | Small orange details, focus rings |

The logo gradient runs from `#a8360a` to `#ff5b1f` to `#ffa24a`.

## UX features

- **Smart header:** hides when you scroll down and comes back when you scroll up. An orange bar shows reading progress, and the nav highlights the section you're in.
- **Floating dock:** a back-to-top button with a progress ring. If the visitor has picked items in "What we build", a tray shows them with a "Continue" link. On phones it becomes a sticky "Start a project" bar. It hides on the hero, the contact form, and the footer.
- **Cursor spot:** on mouse and trackpad devices, a small orange spot follows the pointer. It shows labels like "Open", "Pick", and "Next", and main buttons pull slightly toward the pointer. The normal cursor stays visible.
- **Motion:** the hero window cycles through product previews (click it for the next one, or hover a service in the index), the marquee speeds up and reverses with your scrolling, headings wipe in, and the Approach section highlights the current stage as you scroll.
- **Contact form:** chips for "What do you need?" and timeline, a counter for the three required fields, a check mark on each valid field, removable picks, "Copied ✓" feedback, and the result is scrolled into view and focused.
- **Reduced motion:** with `prefers-reduced-motion`, all of the motion above is switched off and all content stays readable.

## SEO

- **Pre-rendered HTML:** `npm run build` renders the whole page to static HTML (`src/entry-server.tsx` + `scripts/prerender.mjs`). Search engines, social networks, and people without JavaScript see the full content immediately. The browser then "hydrates" it into the interactive site. In `npm run dev` the page renders client-side as usual.
- **Generated from `src/config.ts`:**
  - the title and meta description
  - the canonical URL
  - Open Graph and Twitter cards, using `og-image.png`
  - `robots` directives
  - `sitemap.xml` (with today's date) and `robots.txt`

  **Change `site.url` once there and rebuild, and every URL follows.**
- **Structured data (JSON-LD):** Organization (with the logo, contact email, the six services as an offer catalog, and the tools in `knowsAbout`), WebSite, WebPage, an ItemList of the selected work, and FAQPage. It's built from `src/content.ts`, so it always matches the visible page.
- **Performance:**
  - The main font is preloaded.
  - Toolbox logos are lazy-loaded images in `public/tech/`, not JavaScript.
  - The footer print is a cached SVG (`public/brand/spot-print.svg`).
- **Clean headings:** exactly one `<h1>` ("Software that pounces."). The hero preview's text is drawn with CSS, so it doesn't pollute the heading. Each section has an `<h2>`.
- **App manifest:** `site.webmanifest` with 192/512 icons, and `brand/servalyn-logo-512.png` for search-engine logos.
- **After launch:**
  - Verify the domain in Google Search Console and submit `https://<domain>/sitemap.xml`.
  - Test with Google's Rich Results Test and PageSpeed Insights.

## Company details

`src/config.ts` holds the name, domain, email, phone, social links, and legal links. Empty values are hidden on the page.

- `servalyn.com` and `info@servalyn.com` are **placeholders**. Confirm them before launch, and update `index.html`, `public/robots.txt`, and `public/sitemap.xml` if the domain changes.
- Phone, LinkedIn, Facebook, Instagram, Privacy, and Terms are empty until verified.

## Contact form

- **Default (no endpoint):** after validation, the form prepares an email draft to `site.email`, with an "Open email draft" button and a "Copy message" fallback. The page never claims anything was sent.
- **With an endpoint:** copy `.env.example` to `.env.local`, set `VITE_CONTACT_ENDPOINT`, and rebuild. The form POSTs JSON (`name, email, company, interest, timeline, budget, message, picks`). It only shows "received" when the server answers `{ "accepted": true }`. Errors and a 15-second timeout keep the visitor's details in the form. Handle validation, spam protection, and rate limiting on the server, and add a privacy policy before collecting data.

## Accessibility and motion

The page has a skip link, visible focus rings, a focus-trapped menu dialog that closes with Escape, labelled form errors that receive focus, and colour contrast checked against WCAG AA. With `prefers-reduced-motion`, the tapes stop, the reveal animations are off, and the manifesto is shown fully lit.

## Deploy

Static site. Run `npm ci && npm run build`, then publish `dist/`.

## Credits

Technology logos in the toolbox come from [Simple Icons](https://simpleicons.org) (CC0) and are saved as `public/tech/*.svg`. They are trademarks of their owners and are shown only to name the tools the studio uses. OpenAI, AWS, and Playwright aren't distributed by Simple Icons, so they show small text badges instead.

**To add a project to Selected work:**
1. Save a 1440×900 JPEG screenshot of the live site as `public/work/<id>.jpg`.
2. Add an entry to `projects` in `src/content.ts` (name, client, sector, category, year, URL, image, summary, delivered, stack).

**To add a tool:**
1. Add its name to the right group in `toolbox` in `src/content.ts`.
2. Save its SVG from simpleicons.org as `public/tech/<name>.svg`.
3. Map the name to the file in `src/techIcons.ts`.
