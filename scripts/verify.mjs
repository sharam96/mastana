/** Sanity checks that catch silent content/link mismatches. */
import fs from 'node:fs';

const catalog = JSON.parse(fs.readFileSync('src/content/catalog.json', 'utf8'));
const slugs = new Set(catalog.products.map((p) => p.slug));
const catSlugs = new Set(catalog.categories.map((c) => c.slug));

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
};

/* ---- referenced slugs actually exist -------------------------------- */
const referenced = [];
for (const file of ['src/lib/catalog.ts', 'prisma/seed.mjs', 'src/lib/machine-finder.ts']) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+){2,})'/g)) {
    const s = m[1];
    if (/^[a-z0-9-]+$/.test(s) && (s.includes('machine') || s.includes('knitting') || s.includes('laser')))
      referenced.push([file, s]);
  }
}
console.log('\n[1] referenced product/category slugs resolve');
for (const [file, s] of referenced) {
  if (!slugs.has(s) && !catSlugs.has(s)) fail(`${file}: "${s}" matches no product or category`);
}
console.log(`  checked ${referenced.length} references`);

/* ---- every product is complete -------------------------------------- */
console.log('\n[2] product completeness');
for (const p of catalog.products) {
  if (!p.image) fail(`${p.slug}: no image`);
  if (!fs.existsSync(`public${p.image}`)) fail(`${p.slug}: image missing on disk (${p.image})`);
  if (!p.description || p.description.length < 40) fail(`${p.slug}: description too short`);
  if (!catSlugs.has(p.categorySlug)) fail(`${p.slug}: unknown category ${p.categorySlug}`);
  const hasData = p.specifications.length || p.specTable || p.features.length;
  if (!hasData) fail(`${p.slug}: no specifications, table or features`);
}
console.log(`  checked ${catalog.products.length} products`);

/* ---- unique slugs ---------------------------------------------------- */
console.log('\n[3] slug uniqueness');
if (slugs.size !== catalog.products.length) fail('duplicate product slugs');
console.log(`  ${slugs.size} unique slugs`);

/* ---- no mojibake / placeholder text ---------------------------------- */
console.log('\n[4] text quality');
const blob = JSON.stringify(catalog);
const mojibake = (blob.match(/[ÂÃâ][-¿]/g) || []).length;
if (mojibake) fail(`${mojibake} mojibake sequences`);
if (/lorem ipsum/i.test(blob)) fail('placeholder lorem ipsum found');
if (/undefined|\[object Object\]/.test(blob)) fail('undefined / [object Object] in content');
console.log('  encoding and placeholder checks done');

/* ---- legacy coverage -------------------------------------------------- */
console.log('\n[5] legacy URL coverage');
const legacyIds = new Set(catalog.products.map((p) => p.legacyId));
const sitemapIds = [
  ...fs.readFileSync('scripts/urls_all.txt', 'utf8').matchAll(/product_description\.php\?id=(\d+)/g),
].map((m) => Number(m[1]));
const missing = sitemapIds.filter((id) => !legacyIds.has(id));
if (missing.length) fail(`legacy product ids not migrated: ${missing.join(', ')}`);
console.log(`  ${sitemapIds.length} legacy machine URLs, ${missing.length} unmapped`);

console.log(failures === 0 ? '\nALL CHECKS PASSED\n' : `\n${failures} FAILURE(S)\n`);
process.exitCode = failures ? 1 : 0;
