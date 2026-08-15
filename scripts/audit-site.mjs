/**
 * Crawls the running site and checks structure, links, metadata and a11y
 * basics from the served HTML. Run against a production server:
 *   npx next build && npx next start -p 3200
 *   node scripts/audit-site.mjs http://localhost:3200
 */
const BASE = process.argv[2] ?? 'http://localhost:3200';

const catalog = JSON.parse(
  await (await import('node:fs')).promises.readFile('src/content/catalog.json', 'utf8')
);

const pages = [
  '/', '/machines', '/company', '/technology', '/infrastructure', '/why-mastana',
  '/machine-finder', '/compare', '/contact', '/request-quote', '/this-page-does-not-exist',
  ...catalog.categories.map((c) => `/machines/category/${c.slug}`),
  ...catalog.products.map((p) => `/machines/${p.slug}`),
];

let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL ${msg}`); };
const warn = (msg) => console.log(`  warn ${msg}`);

const seenLinks = new Set();
const results = [];

for (const path of pages) {
  const res = await fetch(BASE + path, { redirect: 'follow' });
  const html = await res.text();
  const expect404 = path === '/this-page-does-not-exist';

  if (expect404) {
    if (res.status !== 404) fail(`${path}: expected 404, got ${res.status}`);
    continue;
  }
  if (!res.ok) { fail(`${path}: HTTP ${res.status}`); continue; }

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt=/.test(t));

  if (h1s.length !== 1) fail(`${path}: ${h1s.length} <h1> (expected 1)`);
  if (!title) fail(`${path}: no <title>`);
  if (title.length > 70) warn(`${path}: title ${title.length} chars`);
  if (!desc) fail(`${path}: no meta description`);
  if (desc.length > 175) warn(`${path}: description ${desc.length} chars`);
  if (!canonical) warn(`${path}: no canonical`);
  if (noAlt.length) fail(`${path}: ${noAlt.length} <img> without alt`);
  // \bNaN\b case-sensitive: a loose /nan/i matches "mainte(nan)ce".
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');
  if (/\bundefined\b|\bNaN\b|\[object Object\]|lorem ipsum/.test(visible) || /lorem ipsum/i.test(visible))
    fail(`${path}: placeholder or undefined text in markup`);

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) seenLinks.add(m[1]);

  results.push({ path, title: title.slice(0, 60), imgs: imgs.length });
}

console.log(`\n[pages] crawled ${results.length}`);

/* ---- internal links all resolve ------------------------------------- */
console.log('\n[links] checking internal links');
const linkList = [...seenLinks].filter((l) => !l.startsWith('/_next') && !l.startsWith('/api'));
let broken = 0;
for (const link of linkList) {
  const res = await fetch(BASE + link, { method: 'GET', redirect: 'follow' });
  if (!res.ok) { fail(`broken link ${link} → ${res.status}`); broken++; }
}
console.log(`  ${linkList.length} distinct internal links, ${broken} broken`);

/* ---- legacy redirects ------------------------------------------------ */
console.log('\n[legacy] redirect coverage');
const legacy = [
  ['/about.php', '/company'],
  ['/contact.php', '/contact'],
  ['/enquiry.php', '/request-quote'],
  ['/infrastructure.php', '/infrastructure'],
  ['/index.php', '/'],
  ['/catagory.php?id=189', '/machines/category/flat-knitting-machines'],
  ['/product_description.php?id=358', '/machines/fx-72s3-computerized-intarsia-flat-knitting-machine'],
  ['/product.php?id=239', '/machines/'],
];
for (const [from, to] of legacy) {
  const res = await fetch(BASE + from, { redirect: 'manual' });
  const loc = res.headers.get('location') ?? '';
  const ok = (res.status === 301 || res.status === 308) && loc.includes(to.replace(/\/$/, ''));
  if (!ok) fail(`${from} → ${res.status} ${loc} (expected redirect to ${to})`);
}
console.log(`  ${legacy.length} legacy routes checked`);

/* ---- sitemap & robots ------------------------------------------------ */
console.log('\n[seo] sitemap and robots');
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urlCount = (sitemap.match(/<url>/g) || []).length;
const expected = 10 + catalog.categories.length + catalog.products.length;
if (urlCount !== expected) fail(`sitemap has ${urlCount} urls, expected ${expected}`);
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
if (!/Sitemap:/i.test(robots)) fail('robots.txt has no Sitemap directive');
console.log(`  sitemap ${urlCount} urls, robots ok`);

console.log(failures === 0 ? '\nSITE AUDIT PASSED\n' : `\n${failures} FAILURE(S)\n`);
process.exitCode = failures ? 1 : 0;
