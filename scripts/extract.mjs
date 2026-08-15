import fs from 'node:fs';
import path from 'node:path';

const SP = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const RAW = path.join(SP, 'raw');

const read = (f) => fs.readFileSync(path.join(RAW, f), 'utf8');
const strip = (s) =>
  s.replace(/<script[\s\S]*?<\/script>/gi, '')
   .replace(/<style[\s\S]*?<\/style>/gi, '')
   .replace(/<!--[\s\S]*?-->/g, '');

const ents = (s) =>
  s.replace(/&nbsp;/g, ' ')
   .replace(/&amp;/g, '&')
   .replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"')
   .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
   .replace(/&ldquo;|&rdquo;/g, '"')
   .replace(/&deg;/g, '\u00b0')
   .replace(/&times;/g, '\u00d7')
   .replace(/&plusmn;/g, '\u00b1')
   .replace(/&mdash;/g, '\u2014')
   .replace(/&ndash;/g, '\u2013')
   .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

const text = (html) => ents(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- nav taxonomy
// Structure: catagory.php?id=C  >  product.php?id=P  >  product_description.php?id=M
function parseNav(html) {
  const nav = html.slice(html.indexOf('<ul class="navbar-nav">'), html.lastIndexOf('</nav>'));
  const tokens = [...nav.matchAll(
    /<a[^>]*href="(catagory\.php\?id=(\d+)|product\.php\?id=(\d+)|product_description\.php\?id=(\d+))"[^>]*>([\s\S]*?)<\/a>/g
  )];

  const cats = [];
  let curCat = null, curProd = null;
  for (const t of tokens) {
    const label = text(t[5]);
    if (t[2]) {
      curCat = { legacyId: +t[2], name: label, groups: [] };
      cats.push(curCat);
      curProd = null;
    } else if (t[3]) {
      if (!curCat) continue;
      curProd = { legacyId: +t[3], name: label, models: [] };
      curCat.groups.push(curProd);
    } else if (t[4]) {
      if (!curProd) continue;
      curProd.models.push({ legacyId: +t[4], navName: label });
    }
  }
  return cats;
}

// ------------------------------------------------- product.php listing (images + full titles)
function parseListing(html) {
  const body = strip(html);
  const start = body.lastIndexOf('</nav>');
  const end = body.indexOf('<footer');
  const region = body.slice(start, end > start ? end : body.length);
  const items = [...region.matchAll(
    /<a href="product_description\.php\?id=(\d+)">\s*<img src="([^"]+)"[\s\S]*?<h3 class='title'[^>]*>([\s\S]*?)<\/h3>/g
  )];
  const out = {};
  for (const m of items) {
    out[+m[1]] = { image: ents(m[2]).trim(), title: text(m[3]) };
  }
  return out;
}

// ------------------------------------------------------- product_description spec tables
// isolate the editable content region: after the last </nav>, before <footer
function contentRegion(html) {
  const body = strip(html);
  let start = body.lastIndexOf('</nav>');
  if (start < 0) start = body.indexOf('<body');
  let end = body.indexOf('<footer');
  if (end < start) end = body.length;
  return body.slice(start, end);
}

function parseSpec(html) {
  const clean = contentRegion(html);
  const rows = [];
  const paras = [];

  for (const tr of clean.matchAll(/<tr[\s\S]*?<\/tr>/g)) {
    const tds = [...tr[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => text(c[1]));
    if (tds.length >= 2) {
      const k = tds[0].replace(/\s+/g, ' ').trim();
      const v = tds.slice(1).map((x) => x.trim()).filter(Boolean).join(' | ').trim();
      if (k && v) rows.push([k, v]);
      else if (k && !v) paras.push(k);
    } else if (tds.length === 1 && tds[0]) {
      paras.push(tds[0]);
    }
  }

  // free text outside tables
  const noTables = clean.replace(/<table[\s\S]*?<\/table>/g, ' ');
  for (const p of noTables.matchAll(/<(p|li|h[1-6])[^>]*>([\s\S]*?)<\/\1>/g)) {
    const t = text(p[2]);
    if (t && t.length > 2) paras.push(t);
  }

  const imgs = [...clean.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map((m) => ents(m[1]).trim())
    .filter((s) => s && !/logo|cologo|banner/i.test(s));

  return { rows, paras: [...new Set(paras)], images: [...new Set(imgs)] };
}

// ------------------------------------------------------------------- run
const navHtml = read('product.php_id_190');
const categories = parseNav(navHtml);

// listing data across every product.php page
const listing = {};
for (const f of fs.readdirSync(RAW)) {
  if (!f.startsWith('product.php_id_')) continue;
  Object.assign(listing, parseListing(read(f)));
}

// spec data for every model
const specs = {};
for (const f of fs.readdirSync(RAW)) {
  const m = f.match(/^product_description\.php_id_(\d+)$/);
  if (!m) continue;
  specs[+m[1]] = parseSpec(read(f));
}

// merge
let modelCount = 0;
for (const c of categories) {
  for (const g of c.groups) {
    for (const md of g.models) {
      const l = listing[md.legacyId] || {};
      const s = specs[md.legacyId] || { rows: [], paras: [], images: [] };
      md.title = l.title || md.navName;
      md.image = l.image || null;
      md.specs = s.rows;
      md.paragraphs = s.paras;
      md.specImages = s.images;
      modelCount++;
    }
  }
}

fs.writeFileSync(path.join(SP, 'catalog.raw.json'), JSON.stringify(categories, null, 2));

// report
console.log('CATEGORIES:', categories.length);
for (const c of categories) {
  const n = c.groups.reduce((a, g) => a + g.models.length, 0);
  console.log(`  [${c.legacyId}] ${c.name} \u2014 ${c.groups.length} groups, ${n} models`);
  for (const g of c.groups) {
    console.log(`      [${g.legacyId}] ${g.name} (${g.models.length})`);
    for (const md of g.models) {
      console.log(`           #${md.legacyId} ${md.title} | img=${md.image} | specs=${md.specs.length} paras=${md.paragraphs.length}`);
    }
  }
}
console.log('TOTAL MODELS:', modelCount);
const missingSpec = [];
for (const c of categories) for (const g of c.groups) for (const md of g.models)
  if (md.specs.length === 0) missingSpec.push(`${md.legacyId} ${md.title}`);
console.log('MODELS WITH NO SPEC ROWS:', missingSpec.length, missingSpec);

console.log('\n===== CONTENT REGION SAMPLES =====');
for (const c of categories) for (const g of c.groups) for (const md of g.models) {
  if (md.specs.length === 0) {
    console.log(`\n--- #${md.legacyId} ${md.title}`);
    console.log('PARAS:', JSON.stringify(md.paragraphs, null, 1));
    console.log('IMGS:', md.specImages);
  }
}
