/**
 * Removes media that nothing references. The old site shipped generic stock
 * photography (sliders, banners, feature art) that the redesign deliberately
 * does not use — keeping it would bloat the repo for no benefit.
 */
import fs from 'node:fs';
import path from 'node:path';

const MEDIA = 'public/media';
const referenced = new Set();

const catalog = JSON.parse(fs.readFileSync('src/content/catalog.json', 'utf8'));
for (const p of catalog.products) {
  if (p.image) referenced.add(path.basename(p.image));
  for (const g of p.gallery) referenced.add(path.basename(g));
}
for (const c of catalog.categories) if (c.image) referenced.add(path.basename(c.image));

// anything hard-coded in source
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|css|json)$/.test(entry.name)) {
      const src = fs.readFileSync(full, 'utf8');
      for (const m of src.matchAll(/\/media\/([A-Za-z0-9._-]+)/g)) referenced.add(m[1]);
    }
  }
};
walk('src');

const files = fs.readdirSync(MEDIA);
const unused = files.filter((f) => !referenced.has(f));

// Archived rather than deleted: these are the client's original assets, so they
// stay available outside public/ instead of being shipped to every visitor.
const ARCHIVE = 'assets-archive/unused-original-media';
const apply = process.argv.includes('--apply');
if (apply) fs.mkdirSync(ARCHIVE, { recursive: true });

let freed = 0;
for (const f of unused) {
  const full = path.join(MEDIA, f);
  freed += fs.statSync(full).size;
  if (apply) fs.renameSync(full, path.join(ARCHIVE, f));
}

console.log(`referenced: ${referenced.size}`);
console.log(`present:    ${files.length}`);
console.log(`unused:     ${unused.length}  (${(freed / 1024 / 1024).toFixed(1)} MB)`);
console.log(apply ? `moved to ${ARCHIVE}` : '\ndry run — pass --apply to archive them');
