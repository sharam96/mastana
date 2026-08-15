import 'server-only';

import { buildKnowledgeBase, type Chunk } from '@/lib/knowledge';

export type Retrieved = Chunk & { score: number };

const STOP = new Set([
  'a','an','the','and','or','of','for','to','in','on','at','is','are','was','were','be','been','it','its','this','that',
  'with','by','from','as','can','do','does','you','your','me','my','i','we','our','us','what','which','who','how','tell',
  'about','please','would','like','want','need','have','has','give','show','there','their','them','if','so','but','not',
]);

/** Light stemming: enough to match plural/verb forms without a full stemmer. */
function stem(token: string): string {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith('ing')) return token.slice(0, -3);
  if (token.length > 3 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      // keep model codes intact: fx-3-72-sj, km-1122, e22, 18g
      .match(/[a-z0-9][a-z0-9./-]*/g) ?? []
  )
    .flatMap((t) => {
      const parts = [t];
      // also index the un-hyphenated form so "fx372sj" and "fx-3-72-sj" both hit
      if (t.includes('-')) parts.push(t.replace(/-/g, ''));
      return parts;
    })
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

type Index = {
  chunks: Chunk[];
  docs: string[][];
  df: Map<string, number>;
  avgLen: number;
};

let index: Index | null = null;

function getIndex(): Index {
  if (index) return index;
  const chunks = buildKnowledgeBase();
  const docs = chunks.map((c) => tokenize(`${c.title} ${c.text}`));
  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const term of new Set(doc)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const avgLen = docs.reduce((a, d) => a + d.length, 0) / Math.max(docs.length, 1);
  index = { chunks, docs, df, avgLen };
  return index;
}

/**
 * BM25 ranking over the Mastana knowledge base. Deterministic, dependency-free
 * and effective for spec lookups where exact model codes matter.
 */
export function retrieve(
  query: string,
  opts: { limit?: number; boostProductSlug?: string | null; boostCategorySlug?: string | null } = {}
): Retrieved[] {
  const { limit = 6, boostProductSlug = null, boostCategorySlug = null } = opts;
  const { chunks, docs, df, avgLen } = getIndex();
  const terms = tokenize(query);
  if (!terms.length) return [];

  const N = docs.length;
  const k1 = 1.5;
  const b = 0.75;

  const scored: Retrieved[] = chunks.map((chunk, i) => {
    const doc = docs[i];
    const len = doc.length || 1;
    const tf = new Map<string, number>();
    for (const t of doc) tf.set(t, (tf.get(t) ?? 0) + 1);

    let score = 0;
    for (const term of terms) {
      const f = tf.get(term);
      if (!f) continue;
      const n = df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * len) / avgLen)));
    }

    // The machine the user is currently looking at is the likely subject.
    if (boostProductSlug && chunk.productSlug === boostProductSlug) score *= 2.4;
    else if (boostCategorySlug && chunk.categorySlug === boostCategorySlug) score *= 1.25;

    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, limit);
}

/**
 * Retrieval confidence. Below the floor the assistant must decline rather than
 * guess — this is what stops it inventing specifications.
 */
export function isConfident(results: Retrieved[]): boolean {
  return results.length > 0 && results[0].score >= 2.2;
}

export function buildContext(results: Retrieved[], maxChars = 6000): string {
  const parts: string[] = [];
  let used = 0;
  for (const r of results) {
    const block = `### ${r.title}${r.url ? ` (page: ${r.url})` : ''}\n${r.text}`;
    if (used + block.length > maxChars) break;
    parts.push(block);
    used += block.length;
  }
  return parts.join('\n\n');
}
