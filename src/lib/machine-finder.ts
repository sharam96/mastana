import { getProducts } from '@/lib/catalog';
import type { Product } from '@/types/catalog';

export type FinderOption = { value: string; label: string; hint?: string };

export type FinderStep = {
  id: 'product' | 'process' | 'scale' | 'control';
  question: string;
  options: FinderOption[];
};

/**
 * The finder maps answers onto machines that actually exist in the catalogue.
 * Each rule references product slugs from src/content/catalog.json — nothing
 * is recommended that Mastana does not list.
 */
export const FINDER_STEPS: FinderStep[] = [
  {
    id: 'product',
    question: 'What are you manufacturing?',
    options: [
      { value: 'sweaters', label: 'Sweaters & knitwear' },
      { value: 'collars', label: 'Collars & cuffs' },
      { value: 'shoe-uppers', label: 'Shoe uppers & vamps' },
      { value: 'socks', label: 'Socks' },
      { value: 'gloves', label: 'Gloves' },
      { value: 'caps', label: 'Caps' },
      { value: 'embroidery', label: 'Embroidery' },
      { value: 'tshirts', label: 'T-shirts & garment panels' },
      { value: 'mesh', label: 'Mesh & spacer fabrics' },
      { value: 'woven', label: 'Woven fabrics' },
      { value: 'warping', label: 'Warping & beam preparation' },
      { value: 'cutting', label: 'Cutting, laser or fusing' },
    ],
  },
  {
    id: 'process',
    question: 'Which stage of production is this for?',
    options: [
      { value: 'knitting', label: 'Knitting', hint: 'Forming the fabric or panel' },
      { value: 'decoration', label: 'Decoration', hint: 'Embroidery, sequins, chenille' },
      { value: 'finishing', label: 'Cutting & finishing', hint: 'Laser cutting, fusing, lamination' },
      { value: 'preparation', label: 'Yarn preparation', hint: 'Warping and beaming' },
    ],
  },
  {
    id: 'scale',
    question: 'What is your approximate production scale?',
    options: [
      { value: 'starting', label: 'Starting out', hint: 'First machines, small unit' },
      { value: 'growing', label: 'Growing unit', hint: 'Expanding an existing line' },
      { value: 'industrial', label: 'Industrial volume', hint: 'High-output factory floor' },
    ],
  },
  {
    id: 'control',
    question: 'Which machine type do you prefer?',
    options: [
      { value: 'fully', label: 'Fully computerized' },
      { value: 'semi', label: 'Semi computerized' },
      { value: 'any', label: 'No preference' },
    ],
  },
];

type Rule = {
  /** Terms matched against the product's searchable text. */
  keywords: string[];
  categories?: string[];
  /** Slugs pinned to the top when they exist. */
  preferred?: string[];
};

const PRODUCT_RULES: Record<string, Rule> = {
  sweaters: {
    keywords: ['sweater', 'knitwear', 'garment'],
    categories: ['flat-knitting-machines'],
    preferred: [
      'fx-3-72-sj-computerized-sweater-flat-knitting-machine',
      'fx-2-52-sw-computerized-sweater-flat-knitting-machine-with-comb',
      'km-1122-semi-computerized-sweater-flat-knitting-machine',
    ],
  },
  collars: {
    keywords: ['collar', 'jacquard', 'transfer'],
    categories: ['flat-knitting-machines'],
    preferred: [
      'km-1122-dj-fully-computerized-dj-collar-flat-knitting-machine',
      'fx-3-72-szl-full-fashion-collar-flat-knitting-machine',
      'km-1122-semi-computerized-collar-flat-knitting-machine',
    ],
  },
  'shoe-uppers': {
    keywords: ['shoe', 'upper', 'vamp', 'flyknit', 'fly knit'],
    categories: ['flat-knitting-machines', 'mesh-knitting-machines', 'weaving-machines'],
  },
  socks: { keywords: ['sock', 'hosiery'], categories: ['socks-gloves-cap-machines'] },
  gloves: { keywords: ['glove'], categories: ['socks-gloves-cap-machines'] },
  caps: { keywords: ['cap', 'hat'], categories: ['socks-gloves-cap-machines'] },
  embroidery: { keywords: ['embroidery', 'chenille', 'sequin', 'bead', 'chain stitch'], categories: ['embroidery-machines'] },
  tshirts: { keywords: ['t-shirt', 'tshirt', 'garment', 'panel'], categories: ['flat-knitting-machines'] },
  mesh: { keywords: ['mesh', 'spacer', 'raschel', 'air mesh'], categories: ['mesh-knitting-machines', 'warp-machines-parts'] },
  woven: { keywords: ['weaving', 'woven', 'rapier', 'jacquard'], categories: ['weaving-machines', 'warp-machines-parts'] },
  warping: { keywords: ['warping', 'beaming', 'warp', 'beam'], categories: ['warp-machines-parts'] },
  cutting: { keywords: ['laser', 'cutting', 'fusing', 'lamination', 'calender'], categories: ['laser-fusing-machines'] },
};

const PROCESS_CATEGORIES: Record<string, string[]> = {
  knitting: ['flat-knitting-machines', 'mesh-knitting-machines', 'socks-gloves-cap-machines'],
  decoration: ['embroidery-machines'],
  finishing: ['laser-fusing-machines'],
  preparation: ['warp-machines-parts', 'weaving-machines'],
};

export type Answers = Partial<Record<FinderStep['id'], string>>;

export type Recommendation = {
  product: Product;
  score: number;
  reason: string;
};

/**
 * Category is scored separately, so it is deliberately excluded here —
 * otherwise a cap machine matches "glove" purely via the shared category
 * label "Socks, Gloves & Cap Machines".
 */
function searchText(p: Product): string {
  return [p.name, p.model ?? '', p.series ?? '', p.description, p.applications.join(' ')]
    .join(' ')
    .toLowerCase();
}

/**
 * Scores the catalogue against the finder answers and explains each match in
 * terms of the machine's own listed data.
 */
export function recommendMachines(answers: Answers, limit = 3): Recommendation[] {
  const products = getProducts();
  const rule = answers.product ? PRODUCT_RULES[answers.product] : undefined;
  const processCats = answers.process ? PROCESS_CATEGORIES[answers.process] : undefined;

  const scored = products.map((product) => {
    const text = searchText(product);
    let score = 0;
    const reasons: string[] = [];

    if (rule) {
      const hits = rule.keywords.filter((k) => text.includes(k));
      if (hits.length) {
        score += hits.length * 3;
        reasons.push(`matches ${hits[0]}`);
      }
      if (rule.categories?.includes(product.categorySlug)) score += 4;
      const pinned = rule.preferred?.indexOf(product.slug) ?? -1;
      if (pinned >= 0) score += 8 - pinned;
    }

    if (processCats?.includes(product.categorySlug)) score += 3;

    if (answers.control === 'fully' && /fully computerized|computerized/i.test(product.name)) score += 2;
    if (answers.control === 'fully' && product.series === 'Fully Computerized') score += 3;
    if (answers.control === 'semi' && /semi computerized/i.test(product.name)) score += 4;
    if (answers.control === 'semi' && product.series === 'Semi Computerized') score += 3;

    // Scale is a soft signal: richer spec sheets tend to be the larger machines.
    if (answers.scale === 'industrial' && product.specifications.length >= 12) score += 1;
    if (answers.scale === 'starting' && /semi computerized/i.test(product.name)) score += 1;

    return { product, score, reasons };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map(({ product, score }) => ({
      product,
      score,
      reason: buildReason(product, answers),
    }));
}

function buildReason(product: Product, answers: Answers): string {
  const bits: string[] = [];

  if (product.applications.length) {
    bits.push(`Listed for ${product.applications.slice(0, 2).join(' and ').toLowerCase()}`);
  } else {
    bits.push(`From Mastana's ${product.categoryName.toLowerCase()} range`);
  }

  const gauge = product.specifications.find((s) => /^gauge/i.test(s.label));
  const width = product.specifications.find((s) => /knitting width|reed width|work(ing)? width/i.test(s.label));
  const speed = product.specifications.find((s) => /speed/i.test(s.label));

  const detail = [gauge && `gauge ${gauge.value}`, width && `width ${width.value}`, speed && `speed ${speed.value}`]
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');

  if (detail) bits.push(detail);
  if (answers.control === 'semi' && product.series === 'Semi Computerized') bits.push('semi-computerized as preferred');
  if (answers.control === 'fully' && product.series === 'Fully Computerized') bits.push('fully computerized as preferred');

  return `${bits.join('. ')}.`;
}
