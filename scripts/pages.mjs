import fs from 'node:fs';
import path from 'node:path';

const SP = 'C:/Users/VISHAL~1/AppData/Local/Temp/claude/D--mastanaintl/20659356-4e4b-47c6-a204-4f672256c002/scratchpad';
const RAW = path.join(SP, 'raw');
const read = (f) => fs.readFileSync(path.join(RAW, f), 'utf8');
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
const ents = (s) => s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&rsquo;|&lsquo;/g,"'").replace(/&ldquo;|&rdquo;/g,'"').replace(/&#(\d+);/g,(_,d)=>String.fromCharCode(+d));
const text = (h) => ents(h.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();

function region(html) {
  const b = strip(html);
  let s = b.lastIndexOf('</nav>'); if (s < 0) s = 0;
  let e = b.indexOf('<footer'); if (e < s) e = b.length;
  return b.slice(s, e);
}

for (const f of ['index.html', 'about.php', 'infrastructure.php', 'enquiry.php', 'contact.php', 'catagory.php_id_189']) {
  const html = read(f);
  const r = region(html);
  console.log('\n\n############################ ' + f + ' ############################');
  const blocks = [];
  for (const m of r.matchAll(/<(h[1-6]|p|li|span|td|div)[^>]*>([\s\S]*?)<\/\1>/g)) {
    const t = text(m[2]);
    if (t && t.length > 1 && !blocks.includes(t)) blocks.push((m[1].startsWith('h') ? `[${m[1].toUpperCase()}] ` : '') + t);
  }
  console.log(blocks.filter(b => b.length < 1200).join('\n---\n'));
  const imgs = [...r.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => ents(m[1]));
  const bgs = [...r.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)].map(m => ents(m[1]));
  console.log('\n>> IMAGES:', JSON.stringify([...new Set([...imgs, ...bgs])], null, 1));
}

// all images across the whole site
const allImgs = new Set();
for (const f of fs.readdirSync(RAW)) {
  const h = read(f);
  for (const m of h.matchAll(/<img[^>]+src="([^"]+)"/g)) allImgs.add(ents(m[1]).trim());
  for (const m of h.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) allImgs.add(ents(m[1]).trim());
}
const list = [...allImgs].filter(s => s && !s.startsWith('blob:') && !s.startsWith('data:') && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(s));
fs.writeFileSync(path.join(SP, 'images.txt'), list.join('\n'));
console.log('\n\n>>>> TOTAL DISTINCT IMAGES:', list.length);
