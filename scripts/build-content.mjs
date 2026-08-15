import fs from 'node:fs';
import path from 'node:path';

const SP = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const raw = JSON.parse(fs.readFileSync(path.join(SP, 'catalog.raw.json'), 'utf8'));
const OVERRIDES = JSON.parse(fs.readFileSync(path.join(SP, 'overrides.json'), 'utf8'));

/* ------------------------------------------------------------------ helpers */
// Escapes, not literals: this file has been corrupted once by a CP1252 round-trip.
const ENT = {
  Oslash: '\u00d8', oslash: '\u00f8', deg: '\u00b0', times: '\u00d7',
  plusmn: '\u00b1', micro: '\u00b5', frac12: '\u00bd', hellip: '\u2026',
  reg: '\u00ae', trade: '\u2122', copy: '\u00a9', bull: '\u2022',
};
const decode = (s) =>
  s.replace(/&([A-Za-z]+);/g, (m, n) => ENT[n] ?? m)
   .replace(/\?{1,2}(?=\s*\))/g, '')       // stray ? from lost glyphs before )
   .replace(/\s+/g, ' ')
   .trim();

// Orthographic corrections only \u2014 factual meaning unchanged.
const SPELL = [
  [/\bEmbrodiery\b/gi, 'Embroidery'], [/\bEmbridoery\b/gi, 'Embroidery'],
  [/\bKniting\b/gi, 'Knitting'], [/\bKNITTIG\b/g, 'KNITTING'],
  [/\bLasser\b/gi, 'Laser'], [/\bLazer\b/gi, 'Laser'],
  [/\bFussing\b/gi, 'Fusing'],
  [/\bJaiquard\b/gi, 'Jacquard'], [/\bJaquard\b/gi, 'Jacquard'],
  [/\bHighi\b/gi, 'High'], [/\bHIGHI\b/g, 'HIGH'],
  [/\bComputrer\b/gi, 'Computer'],
  [/\bReapier\b/gi, 'Rapier'],
  [/\bChinle\b/gi, 'Chenille'],
  [/\bBeming\b/gi, 'Beaming'],
  [/\bWARING\b/g, 'WARPING'],
  [/\bAirmash\b/gi, 'Air Mesh'],
  [/\bMODLE\b/g, 'MODEL'],
  [/\bGerment\b/gi, 'Garment'],
  [/\bSpacr\b/gi, 'Spacer'],
  [/\bCollor\b/gi, 'Collar'], [/\bColler\b/gi, 'Collar'],
  [/\bUpeer\b/gi, 'Upper'],
  [/\bSami\b/gi, 'Semi'],
];
const fixSpelling = (s) => SPELL.reduce((a, [re, to]) => a.replace(re, to), s);

const SMALL = new Set(['and','or','the','a','an','of','for','with','to','in','on','at','by','from']);
const ACRO = /^(CNC|CO2|AC|DC|LCD|OLED|3D|LOGO|USB|MPL|EN|KAMCOS|ISO|RPM|KW|MM|CM|HZ)$/i;
const titleCase = (s) =>
  s.split(/\s+/).map((w, i) => {
    const bare = w.replace(/[^A-Za-z0-9]/g, '');
    if (ACRO.test(bare)) return w.toUpperCase();
    if (/^[A-Z]{2,}[-0-9]/.test(w) || /^[A-Z]+-[A-Z0-9-]+$/.test(w)) return w; // model codes
    const lw = w.toLowerCase();
    if (i > 0 && SMALL.has(lw)) return lw;
    return lw.charAt(0).toUpperCase() + lw.slice(1);
  }).join(' ');

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

/* ---------------------------------------------------------- image filenames */
const manifest = new Map(
  fs.readFileSync(path.join(SP, 'image_manifest.txt'), 'utf8')
    .split('\n').filter(Boolean)
    .map((l) => { const [src, file] = l.split('|'); return [src.trim(), file.trim()]; })
);
// public path uses a flattened, url-safe name
const publicName = (src) => {
  if (!src) return null;
  const key = src.replace(/^\.\//, '');
  const file = manifest.get(key) || manifest.get(src);
  if (!file) return null;
  return '/media/' + file.replace(/[^A-Za-z0-9._-]+/g, '-').toLowerCase();
};

/* ------------------------------------------------------------- taxonomy map */
const CATEGORY_META = {
  189: {
    name: 'Flat Knitting Machines',
    tagline: 'Computerized and semi-computerized flat knitting',
    description:
      'Mastana\u2019s flat knitting range covers fully computerized, semi-computerized, collar and whole-garment machines for sweaters, collars, T-shirts and flyknit shoe uppers.',
  },
  215: {
    name: 'Embroidery Machines',
    tagline: 'High-speed multi-head embroidery systems',
    description:
      'High-speed embroidery machines including chenille, sequin, beads and chain-stitch configurations for garments, logos, curtains, handbags and lace fabrics.',
  },
  234: {
    name: 'Laser & Fusing Machines',
    tagline: 'Laser cutting, engraving and heat-press fusing',
    description:
      'CO2 laser cutting and engraving machines together with heat-press fusing and calendering equipment for shoe uppers, garments and composite materials.',
  },
  238: {
    name: 'Mesh Knitting Machines',
    tagline: 'Double-bar raschel machines for spacer textiles',
    description:
      'Flexible double-bar raschel warp knitting machines for producing spacer fabrics and air-mesh materials used in shoe uppers.',
  },
  240: {
    name: 'Socks, Gloves & Cap Machines',
    tagline: 'Dedicated hosiery knitting machines',
    description:
      'Purpose-built knitting machines for socks, gloves and caps, including computerized glove knitting systems.',
  },
  245: {
    name: 'Weaving Machines',
    tagline: 'Electronic jacquard shoe-upper weaving',
    description:
      'Electronic jacquard weaving machines engineered for shoe-upper and technical fabric production.',
  },
  256: {
    name: 'Warp Machines & Parts',
    tagline: 'Warping, warp knitting and lamination equipment',
    description:
      'Warping, warp knitting, beaming and composite lamination equipment, including CNC-controlled high-speed copy warping and sectional warping machines.',
  },
};

const SERIES_META = { 190: 'Fully Computerized', 196: 'Semi Computerized', 248: 'Collar', 269: 'Whole Garment' };

/* ------------------------------------------------------- model title parsing */
function parseTitle(rawTitle) {
  let t = decode(fixSpelling(rawTitle));
  t = t.replace(/^MODEL\s*NO\s*[-\u2013:]?\s*/i, 'MODEL NO-');
  const m = t.match(/^MODEL\s*NO\s*[-\u2013:]?\s*([A-Za-z0-9][A-Za-z0-9\-\.]*(?:\s*3D)?)\s*(.*)$/i);
  if (m) {
    let code = m[1].trim().replace(/[.,]$/, '');
    let rest = m[2].trim();
    // "FX-2-52-SZLFully Jacquard..." \u2014 code glued to words
    const glue = code.match(/^([A-Z0-9\-]*[0-9A-Z])([A-Z][a-z].*)$/);
    if (glue) { code = glue[1]; rest = (glue[2] + ' ' + rest).trim(); }
    return { model: code.toUpperCase(), name: titleCase(rest || code) };
  }
  return { model: null, name: titleCase(t) };
}

/* ----------------------------------------------------- paragraph classifying */
const NOISE = /^(products|our products|home|specifications?|technical (data|parameters|index)|characteristics?|features?|configuration|description|sizes available|product feature)\s*:?\s*$/i;

function classify(paras, title) {
  const kept = paras
    .map((p) => decode(fixSpelling(p)))
    .filter((p) => p && !NOISE.test(p) && p.toLowerCase() !== decode(fixSpelling(title)).toLowerCase());

  const features = [];
  const applications = [];
  const descriptionParts = [];
  const extraSpecs = [];

  for (let p of kept) {
    // strip a leading heading word that got merged in
    const appMatch = p.match(/^(?:applicable industry|applicable material|applicable materials|scope of application|usage\/application)\s*:?\s*(.+)$/i);
    if (appMatch) { applications.push(appMatch[1].trim()); continue; }

    const numbered = p.match(/^\d+\s*[\.\)]\s*(.+)$/);
    if (numbered) p = numbered[1].trim();

    // "Key : value" one-liners are really spec rows
    const kv = p.match(/^([A-Za-z][A-Za-z0-9 \/&\-\(\)\.\u00b0"]{2,45}?)\s*[:\uff1a]\s*(.{2,})$/);
    if (kv && !/\.\s/.test(kv[1])) { extraSpecs.push([kv[1].trim(), kv[2].trim()]); continue; }

    if (numbered) { features.push(p); continue; }

    // headings merged with body, e.g. "SPECIFICATIONS High-speed flat embroidery ..."
    p = p.replace(/^(SPECIFICATIONS?|FEATURES?|CHARACTERISTICS?|Technical Data|Description|Features)\s+/i, '');
    if (p.length > 60) descriptionParts.push(p);
    else if (p.length > 3) features.push(p);
  }
  return { features, applications, descriptionParts, extraSpecs };
}

/* --------------------------------------------------------------------- build */
const categories = [];
const products = [];
const seenSlug = new Map();

for (const c of raw) {
  const meta = CATEGORY_META[c.legacyId];
  if (!meta) { console.warn('UNMAPPED CATEGORY', c.legacyId, c.name); continue; }
  const catSlug = slugify(meta.name);

  const catImages = [];
  for (const g of c.groups) for (const m of g.models) { const im = publicName(m.image); if (im) catImages.push(im); }

  categories.push({
    legacyId: c.legacyId,
    legacyName: c.name,
    name: meta.name,
    slug: catSlug,
    tagline: meta.tagline,
    description: meta.description,
    image: catImages[0] ?? null,
    legacyUrl: `/catagory.php?id=${c.legacyId}`,
  });

  for (const g of c.groups) {
    const series = SERIES_META[g.legacyId] && c.legacyId === 189 ? SERIES_META[g.legacyId] : null;

    for (const m of g.models) {
      const { model, name } = parseTitle(m.title);
      const { features, applications, descriptionParts, extraSpecs } = classify(m.paragraphs, m.title);

      const specs = [
        ...m.specs.map(([k, v]) => [decode(fixSpelling(k)).replace(/\s*:$/, ''), decode(fixSpelling(v))]),
        ...extraSpecs.map(([k, v]) => [decode(fixSpelling(k)), decode(fixSpelling(v))]),
      ].filter(([k, v]) => k && v && k.length < 60);

      // dedupe spec keys
      const specMap = [];
      const specSeen = new Set();
      for (const [k, v] of specs) {
        const key = k.toLowerCase();
        if (specSeen.has(key)) continue;
        specSeen.add(key);
        specMap.push({ label: k, value: v });
      }

      // spec rows can also reveal applications
      const usage = specMap.find((s) => /usage|application/i.test(s.label));
      if (usage && !applications.length) applications.push(usage.value);

      // A pipe in the first row means this is a matrix table, not key/value pairs.
      let specTable = null;
      let specList = specMap;
      const collapse = (v) => {
        const parts = v.split(' | ').map((x) => x.trim());
        return parts.every((x) => x === parts[0]) ? parts[0] : v;
      };
      const collapsed = specMap.map((s) => ({ label: s.label, value: collapse(s.value) }));
      if (collapsed.length > 1 && collapsed[0].value.includes(' | ')) {
        const header = [collapsed[0].label, ...collapsed[0].value.split(' | ').map((x) => x.trim())];
        const rows = collapsed.slice(1).map((s) => {
          const cells = s.value.split(' | ').map((x) => x.trim());
          while (cells.length < header.length - 1) cells.push('\u2014');
          return [s.label, ...cells.slice(0, header.length - 1)];
        });
        specTable = { header, rows };
        specList = [];
      } else {
        specList = collapsed;
      }

      let description = descriptionParts.join(' ').trim();
      if (!description) {
        description = `${name}${model ? ` (model ${model})` : ''} from Mastana's ${meta.name.toLowerCase()} range.`;
      }

      let base = slugify([model, name].filter(Boolean).join(' '));
      let slug = base;
      let n = 2;
      while (seenSlug.has(slug)) slug = `${base}-${n++}`;
      seenSlug.set(slug, true);

      const image = publicName(m.image);
      const gallery = [...new Set((m.specImages || []).map(publicName).filter((x) => x && x !== image))];

      const ov = OVERRIDES[String(m.legacyId)] ?? {};

      // features that are really stray table fragments or headings add no value
      const cleanFeatures = features
        .map((f) => f.replace(/\s*[;,.]\s*$/, '').trim())
        .filter((f) => f.length > 12 && !/^(product (feature|usage)|characteristics|the main specification|application (industry|materials?)|specifications?|technical data)\b/i.test(f))
        .filter((f) => !/^[A-Za-z ]{3,30}\s*:\s*[<>\d]/.test(f));

      const finalName = ov.name ?? name;
      const finalModel = ov.model ?? model;
      // don't repeat the model code when the name already leads with it
      const slugSeed =
        finalModel && !finalName.toLowerCase().startsWith(finalModel.toLowerCase())
          ? `${finalModel} ${finalName}`
          : finalName;
      const b = slugify(slugSeed);
      let finalSlug = b, k = 2;
      seenSlug.delete(slug);
      while (seenSlug.has(finalSlug)) finalSlug = `${b}-${k++}`;
      seenSlug.set(finalSlug, true);

      if (ov.specifications) {
        specList = ov.specifications.map(([label, value]) => ({ label, value }));
        specTable = null;
      }

      products.push({
        legacyId: m.legacyId,
        legacyUrl: `/product_description.php?id=${m.legacyId}`,
        slug: finalSlug,
        name: finalName,
        model: finalModel,
        series,
        categorySlug: catSlug,
        categoryName: meta.name,
        description: ov.description ?? description,
        features: ov.features ?? cleanFeatures,
        applications: ov.applications ?? applications,
        specifications: specList,
        specTable,
        image,
        gallery,
      });
    }
  }
}

const out = { categories, products };
fs.writeFileSync(path.join(SP, 'content.json'), JSON.stringify(out, null, 2));

/* -------------------------------------------------------------------- report */
console.log('CATEGORIES:', categories.length, '| PRODUCTS:', products.length);
console.log('\nno image      :', products.filter((p) => !p.image).map((p) => p.slug));
console.log('no specs      :', products.filter((p) => !p.specifications.length).map((p) => p.slug));
console.log('no features   :', products.filter((p) => !p.features.length).length);
console.log('generic descr :', products.filter((p) => p.description.includes("from Mastana's")).map((p) => p.slug));
const unusedOverrides = Object.keys(OVERRIDES).filter((k) => !products.some((p) => String(p.legacyId) === k));
console.log('unused overrides:', unusedOverrides);
console.log('\n--- all products ---');
for (const c of categories) {
  console.log(`\n## ${c.name} (${c.slug})`);
  for (const p of products.filter((x) => x.categorySlug === c.slug))
    console.log(
      `   ${(p.model ?? '\u2014').padEnd(14)} | ${p.name.padEnd(58)} | spec=${String(p.specifications.length).padStart(2)} tbl=${p.specTable ? p.specTable.rows.length : 0} feat=${String(p.features.length).padStart(2)} app=${p.applications.length}`
    );
}
