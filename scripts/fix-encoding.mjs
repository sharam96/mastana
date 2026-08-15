/**
 * Repairs mojibake introduced when a UTF-8 file is read as CP1252 and written
 * back as UTF-8 (PowerShell's Get-Content | Set-Content does this).
 *
 * Replacements are targeted rather than a whole-file re-decode, because these
 * files mix corrupted sequences with characters that survived intact.
 */
import fs from 'node:fs';

// Longest sequences first so three-byte forms win over two-byte prefixes.
const MAP = [
  ['â€™', '’'], // ’
  ['â€œ', '“'], // “
  ['â€', '”'], // ”
  ['â€“', '–'], // –
  ['â€”', '—'], // —
  ['â€¦', '…'], // …
  ['â€¢', '•'], // •
  ['â„¢', '™'], // ™
  ['Ã˜', 'Ø'], // Ø
  ['Ã¸', 'ø'], // ø
  ['Ã—', '×'], // ×
  ['Â°', '°'], // °
  ['Â±', '±'], // ±
  ['Âµ', 'µ'], // µ
  ['Â½', '½'], // ½
  ['Â®', '®'], // ®
  ['Â©', '©'], // ©
  ['Â ', ' '], // nbsp
];

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node scripts/fix-encoding.mjs <file...>');
  process.exit(1);
}

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [bad, good] of MAP) after = after.split(bad).join(good);

  if (after === before) {
    console.log(`clean    ${file}`);
    continue;
  }
  fs.writeFileSync(file, after, 'utf8');
  console.log(`repaired ${file}`);
}
