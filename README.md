# Mastana Mechanical Works

Rebuild of [mastanaintl.com](https://mastanaintl.com) as a premium industrial
site with an AI product advisor. Every fact and all 41 machines come from the
existing website — see [CONTENT-MAP.md](./CONTENT-MAP.md) for the full audit
trail.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** — design tokens in `src/app/globals.css`
- **Motion** (Framer Motion) + **Lenis** smooth scrolling, both reduced-motion aware
- **PostgreSQL + Prisma 7** (pg driver adapter)
- **OpenAI** for the assistant, with a working retrieval-only fallback

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The site runs with **no configuration at all**. Without `DATABASE_URL` it reads
the catalogue from `src/content/catalog.json` and appends form submissions to
`.data/*.jsonl`; without `OPENAI_API_KEY` the assistant answers from the
retrieval layer alone. Nothing is a dead end.

### With PostgreSQL

```bash
# set DATABASE_URL in .env first
npm run db:push
npm run db:seed     # loads 7 categories + 41 machines
```

The data layer (`src/lib/repository.ts`) prefers Postgres and falls back to the
versioned catalogue, so a database outage degrades instead of breaking.

## Architecture

```
src/
  app/            routes, API handlers, sitemap/robots, legacy .php redirects
  components/
    ai/           Mastana AI panel, machine finder, lead capture
    forms/        enquiry form
    home/         homepage sections
    layout/       navbar + mega menu, footer, floating actions
    product/      catalogue browser, cards, spec tables, compare
    ui/           buttons, reveal/motion primitives, page + section headers
  content/        company facts (with sources) + generated catalogue
  lib/            data access, retrieval, AI, machine finder, rate limiting
scripts/          content pipeline, raw crawl, verification, site audit
prisma/           schema + seed
```

UI, business logic, data access and AI are separate: components never touch
Prisma, and pages read through `lib/repository.ts`.

## Mastana AI

A retrieval-grounded assistant, not a generic chatbot.

- **Knowledge base** (`lib/knowledge.ts`) is built only from audited Mastana
  content — company pages, categories, machines and their specification tables.
- **Retrieval** (`lib/retrieval.ts`) is BM25 over that corpus, tuned to match
  model codes (`FX-3-72-SJ`, `18G`, `E22`) exactly. Deterministic and
  dependency-free.
- **Answering** (`lib/ai.ts`) sends only retrieved context to OpenAI under a
  strict system prompt. Below a confidence floor it refuses:
  > I don't have verified information about that specification. I can connect
  > you with the Mastana team for accurate technical details.
- **Commercial questions** (price, lead time, stock) short-circuit *before*
  retrieval — no context could ever justify quoting them.
- Prompt-injection text inside a user message is treated as untrusted.

Product pages register their machine as AI context, so "what are its gauges?"
resolves against the machine being viewed.

### Security

The OpenAI key is server-only and read exclusively inside API route handlers.
All input is validated with Zod, control characters are stripped, forms carry a
honeypot, and every endpoint is rate limited (`lib/rate-limit.ts`: 20 chat/min,
6 enquiries/min per IP). Errors are logged server-side and returned generically.

The in-memory limiter suits a single instance — move it to Redis or Postgres
before scaling horizontally.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:push` / `db:seed` / `db:studio` | Prisma |
| `node scripts/verify.mjs` | Catalogue integrity — images, specs, slugs, legacy coverage, stray U+00A0 in source |
| `node scripts/audit-site.mjs <url>` | Crawls a running site: headings, metadata, broken links, redirects, sitemap |
| `node scripts/prune-media.mjs` | Reports unreferenced media (`--apply` archives it) |
| `scripts/responsive-check.js` | Paste into DevTools, run `__check()` — flags clipped text, viewport escapes and small tap targets at the current width |

Run the site audit against a production server:

```bash
npm run build && npx next start -p 3200
node scripts/audit-site.mjs http://localhost:3200
```

## Accessibility & performance

Semantic landmarks, one `h1` per page, skip link, visible focus rings, ARIA on
the assistant and menus, and `prefers-reduced-motion` honoured throughout
(Lenis disables itself entirely). Images run through `next/image` with AVIF/WebP;
unused stock imagery was archived out of `public/`, cutting shipped media from
12.9 MB to 2.7 MB.

## Regenerating content

The crawl is committed, so the catalogue rebuilds offline:

```bash
node scripts/extract.mjs && node scripts/build-content.mjs
mv scripts/content.json src/content/catalog.json
node scripts/verify.mjs
```

Edit `scripts/overrides.json` to correct copy — never edit
`src/content/catalog.json` by hand, it is generated.

> **Note on the pipeline scripts:** they are kept ASCII-only (unicode escapes
> rather than literal `°`, `Ø`, `—`). They were corrupted once by a PowerShell
> `Get-Content | Set-Content` round-trip; `scripts/fix-encoding.mjs` repairs
> that class of damage if it recurs.

## Responsive coverage

Every page in the sitemap is checked for horizontal overflow, clipped headings
and a single `h1` at **320 / 360 / 390 / 414 / 768 / 1024 / 1280 / 1440** px
against a production build. Two things caused nearly all the failures found and
are worth knowing about:

- **A responsive grid needs an explicit `grid-cols-1`.** Without it the single
  implicit column sizes to its content's max-content width and drags the page
  sideways on a phone — most visibly with the spec matrix, which carries a
  `min-w-[36rem]`.
- **A `U+00A0` between the words of an animated heading serialises to `&nbsp;`**
  and the heading can then never wrap. `verify.mjs` now fails on any
  non-breaking space in `src/`.
