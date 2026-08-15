# Content migration map

Every page and machine from `mastanaintl.com` and where it now lives. Nothing
from the old site was dropped; nothing was invented.

## Source of truth

The old site was crawled in full (86 URLs from its `sitemap.html`). The raw HTML
is committed under `scripts/raw/` so every claim on the new site is traceable.

The pipeline is reproducible:

```bash
node scripts/extract.mjs        # parse raw HTML -> scripts/catalog.raw.json
node scripts/build-content.mjs  # normalise + apply overrides -> content.json
node scripts/verify.mjs         # completeness / integrity checks
```

`scripts/overrides.json` holds the hand-authored descriptions and corrections.
Each one is derived from that machine's own extracted specification text — it
never adds a fact that isn't in the source.

## Page mapping

| Old URL | New URL | Notes |
| --- | --- | --- |
| `/index.php` | `/` | Rebuilt homepage |
| `/about.php` | `/company` | Profile + history timeline |
| `/infrastructure.php` | `/infrastructure` | Facility, R&D, quality |
| `/enquiry.php` | `/request-quote` | Enquiry form, saved to DB |
| `/contact.php` | `/contact` | Full contact details + form |
| `/sitemap.html` | `/sitemap.xml` | Generated |
| `/catagory.php?id=N` | `/machines/category/<slug>` | 301 via route handler |
| `/product.php?id=N` | category or machine page | 301; single-model groups go straight to the machine |
| `/product_description.php?id=N` | `/machines/<slug>` | 301 for all 41 machines |

All redirects are verified by `scripts/audit-site.mjs`.

## Category mapping

The old category labels were inconsistent and contained typos. Display names
were cleaned; the meaning is unchanged.

| Old label (`catagory.php`) | New name | Slug | Machines |
| --- | --- | --- | --- |
| All flat knitting machine | Flat Knitting Machines | `flat-knitting-machines` | 15 |
| Embridoery machines | Embroidery Machines | `embroidery-machines` | 7 |
| Laser and Fusing Machine | Laser & Fusing Machines | `laser-fusing-machines` | 4 |
| Mesh knitting Machines | Mesh Knitting Machines | `mesh-knitting-machines` | 1 |
| Socks and gloves And Cap Machines | Socks, Gloves & Cap Machines | `socks-gloves-cap-machines` | 4 |
| Weaving machines | Weaving Machines | `weaving-machines` | 1 |
| Warp Machine Part | Warp Machines & Parts | `warp-machines-parts` | 9 |

**Total: 7 categories, 41 machines — the complete original catalogue.**

Within flat knitting, the old sub-groups are preserved as a `series` field:
Fully Computerized, Semi Computerized, Collar, Whole Garment.

## Text corrections applied

Spelling only. Factual meaning is unchanged in every case.

`Embrodiery`/`Embridoery` → Embroidery · `Kniting` → Knitting ·
`Lasser`/`Lazer` → Laser · `Fussing` → Fusing · `Jaiquard` → Jacquard ·
`Highi` → High · `Computrer` → Computer · `Reapier` → Rapier ·
`Chinle` → Chenille · `Beming` → Beaming · `WARING` → WARPING ·
`Airmash` → Air Mesh · `MODLE` → MODEL · `Spacr` → Spacer ·
`Coller`/`Collor` → Collar · `Upeer` → Upper · `Sami` → Semi ·
`Tripur` → Tirupur · `Banglore` → Bangalore

The `Airmash ... Wrap Knitting` machine is titled *Air Mesh Jacquard **Warp**
Knitting* — warp knitting is the actual process described in its own
specification text.

## Facts carried over verbatim

Held in `src/content/company.ts`, each with its source page noted:

- Established **1957** (`about.php`)
- **ISO 9001:2008** registration (`about.php`)
- **More than 50 years** of experience (`index.php`)
- **6,000 sq ft** infrastructure facility (`index.php`)
- Motto: *"Quality is Not Expensive"* (`index.php`)
- In-house R&D wing with trained engineers (`about.php`)
- All phone numbers, emails, head office / factory / additional addresses (`contact.php`)
- Branches: Delhi, Tirupur, Mumbai, Bangalore, Kolkata (`contact.php`)
- Opening hours and the three listed websites (`contact.php`)

## Deliberately not carried over

- **Social media links.** The old site's Facebook/Twitter/Instagram icons all
  pointed at `#` — there were no real profiles to link, so the new footer has no
  social section rather than dead links.
- **Stock photography.** The old sliders, banners and "feature" images were
  generic stock (businessmen, abstract networks) unrelated to Mastana. The
  `resource/infra*.jpg` images were stock CNC machines, not Mastana's facility,
  so they are not presented as such. All 42 unused files are preserved in
  `assets-archive/unused-original-media/`.
- **"Our Process" / buyer-marketplace copy.** The old homepage carried
  boilerplate about "connecting with thousands of top buyers" that does not
  describe Mastana's business.

## What is *not* claimed anywhere on the new site

No production capacity, revenue, employee count, client names, export
countries, awards, certifications beyond ISO 9001:2008, testimonials or
partnerships — none of these appear on the source site, so none appear here.
Mastana AI is instructed to refuse rather than guess on all of them.
