/**
 * Verified company facts, transcribed from mastanaintl.com (audited Aug 2026).
 * Every value here appears on the existing website. Nothing is invented.
 * Source pages are noted so claims stay traceable.
 */

export const company = {
  legalName: 'Mastana Mechanical Works',
  shortName: 'Mastana',
  displayName: 'Mastana Mechanical Works',
  registered: 'Regd.',
  /** logo: "A Leading Manufacturer & Exporter" — assets/images/logo.png */
  descriptor: 'A Leading Manufacturer & Exporter',
  established: 1957,
  /** about.php */
  positioning:
    'One of the leading manufacturers, exporters and repairers of all kinds of hosiery knitting machines.',
  /** index.php hero */
  legacyTagline: 'We deal in all kinds of hosiery knitting machines',
  /** index.php */
  motto: 'Quality is Not Expensive',
  /** about.php */
  certification: 'ISO 9001:2008',
  certificationNote: 'The firm holds ISO 9001:2008 registration.',
} as const;

/** Verified statistics only. Each maps to a literal statement on the old site. */
export const stats = [
  {
    value: 1957,
    display: '1957',
    label: 'Established',
    note: 'Manufacturing hosiery knitting machines since 1957.',
    source: 'about.php',
  },
  {
    value: 50,
    display: '50+',
    suffix: '',
    label: 'Years of experience',
    note: 'More than 50 years of experience in this domain.',
    source: 'index.php',
  },
  {
    value: 6000,
    display: '6,000',
    suffix: ' sq ft',
    label: 'Infrastructure facility',
    note: 'State-of-the-art infrastructure facility spread over a 6000 sq. feet plot area.',
    source: 'index.php',
  },
  {
    value: 9001,
    display: 'ISO 9001',
    label: '2008 registered',
    note: 'The firm holds ISO 9001:2008 registration.',
    source: 'about.php',
  },
] as const;

/** contact.php + index.php footer */
export const contact = {
  phones: [
    { label: 'Office', number: '+91 161 2447130', tel: '+911612447130' },
    { label: 'Office', number: '+91 161 293 3689', tel: '+911612933689' },
    { label: 'Mobile', number: '+91 98 1401 1130', tel: '+919814011130' },
    { label: 'Mobile', number: '+91 98 1561 1130', tel: '+919815611130' },
    { label: 'Mobile', number: '+91 82 8384 8589', tel: '+918283848589' },
  ],
  /** WhatsApp uses the primary listed mobile number from the old site's header. */
  whatsapp: { number: '+91 98 1401 1130', e164: '919814011130' },
  emails: [
    { label: 'General', address: 'info@mastanaintl.com' },
    { label: 'Marketing', address: 'marketing@mastanaintl.com' },
  ],
  addresses: [
    {
      label: 'Head Office',
      lines: ['E-2/36/5, Street Number 1', 'Guru Vihar, Jodhewal', 'Ludhiana — 141007', 'Punjab, India'],
    },
    {
      label: 'Factory',
      lines: ['Phase VIII, Focal Point', 'Ludhiana — 141010', 'Punjab, India'],
    },
    {
      label: 'Additional Office',
      lines: ['Opp. Kailash Cinema', 'Civil Lines, Ludhiana — 141008', 'Punjab, India'],
    },
  ],
  /** contact.php: "Branches: Delhi, Tripur, Mumbai, Banglore, Kolkata" */
  branches: ['Delhi', 'Tirupur', 'Mumbai', 'Bangalore', 'Kolkata'],
  hours: [
    { days: 'Monday — Saturday', time: '9:30 AM — 8:30 PM' },
    { days: 'Sunday', time: '9:30 AM — 1:00 PM' },
  ],
  websites: ['www.mastanaintl.com', 'www.mastana.co.in', 'www.flatknittingmachines.com'],
} as const;

/**
 * Company narrative, rewritten into professional English from about.php and
 * infrastructure.php. Factual meaning is unchanged.
 */
export const about = {
  lead:
    'Mastana Mechanical Works is one of the leading manufacturers, exporters and repairers of all kinds of hosiery knitting machines.',
  paragraphs: [
    'Mastana Mechanical Works was established in 1957 and is engaged in the manufacture of a wide range of models in hosiery knitting machines. The firm holds ISO 9001:2008 registration.',
    'We believe quality is the lifeline of our business. We are committed to satisfying our customers by manufacturing and supplying quality products to their entire satisfaction — first time and every time — with continual upgradation in quality.',
    'Total quality of the products is the symbolic mark adopted as a goal, and it is our endeavour to pursue continuous quality improvement.',
    'The firm has its own Research and Development wing with a team of highly motivated, dedicated, conscientious and trained engineers. All products pass through rigorous and stringent quality control tests and workmanship checks in the R&D wing to ensure trouble-free operation.',
    'Mastana products meet international standards in respect of design, quality and finishing. We regularly undertake new design development of models with qualified engineers.',
    'Mastana owns a full-fledged infrastructure capable of adapting to every new technological advancement and innovation in the hosiery industry.',
  ],
} as const;

/** Timeline built strictly from statements on the existing website. */
export const timeline = [
  {
    year: '1957',
    title: 'Foundation',
    body: 'Mastana Mechanical Works is established, engaged in the manufacture of various models of hosiery knitting machines.',
    source: 'about.php',
  },
  {
    year: 'Growth',
    title: 'Manufacturer, exporter & repairer',
    body: 'The firm grows into one of the leading manufacturers, exporters and repairers of all kinds of hosiery knitting machines.',
    source: 'about.php',
  },
  {
    year: 'R&D',
    title: 'Engineering wing established',
    body: 'An in-house Research and Development wing is built around a team of highly motivated, dedicated and trained engineers, regularly undertaking new design development.',
    source: 'about.php',
  },
  {
    year: 'Quality',
    title: 'ISO 9001:2008 registration',
    body: 'The firm takes ISO 9001:2008 registration. Products meet international standards in design, quality and finishing.',
    source: 'about.php',
  },
  {
    year: '50+',
    title: 'Five decades of experience',
    body: 'More than 50 years of experience in this domain helps Mastana evolve into a multi-dimensional organisation serving clients across the hosiery industry.',
    source: 'index.php',
  },
  {
    year: 'Today',
    title: 'Advanced textile machinery',
    body: 'A full catalogue spanning flat knitting, embroidery, laser and fusing, mesh knitting, socks, gloves and cap, weaving and warping machines.',
    source: 'catalogue',
  },
] as const;

/** index.php — "Why Us?", "Our Manpower", "Our Infrastructure" */
export const strengths = [
  {
    title: 'Experience',
    body: 'More than 50 years of experience in this domain has helped us evolve into a multi-dimensional organisation engaged in serving clients.',
    source: 'index.php',
  },
  {
    title: 'Our manpower',
    body: 'A team of qualified and talented professionals is the backbone of the organisation and helps in achieving the objectives of the firm.',
    source: 'index.php',
  },
  {
    title: 'Our infrastructure',
    body: 'A state-of-the-art infrastructure facility spread over a 6,000 sq. ft plot area, well organised and armed with all the essential machinery and tools.',
    source: 'index.php',
  },
  {
    title: 'Research & development',
    body: 'An in-house R&D wing with trained engineers, regularly undertaking new design development of models with qualified engineers.',
    source: 'about.php',
  },
  {
    title: 'Quality control',
    body: 'All products pass through rigorous and stringent quality control tests and workmanship checks to ensure trouble-free operation.',
    source: 'about.php',
  },
  {
    title: 'International standards',
    body: 'Mastana products meet international standards in respect of design, quality and finishing.',
    source: 'about.php',
  },
] as const;

/** infrastructure.php + about.php */
export const infrastructure = [
  {
    title: 'Manufacturing',
    body: 'Manufacturing and supply of hosiery knitting machines and parts across a state-of-the-art facility spread over a 6,000 sq. ft plot area, well organised and equipped with the essential machinery and tools.',
  },
  {
    title: 'Research & development',
    body: 'A dedicated R&D wing staffed by highly motivated, dedicated, conscientious and trained engineers, regularly undertaking new design development of models.',
  },
  {
    title: 'Quality control',
    body: 'All products pass through rigorous and stringent quality control tests and workmanship checks in the R&D wing to ensure trouble-free operation of every machine.',
  },
  {
    title: 'Technological adaptability',
    body: 'A full-fledged infrastructure capable of adapting to all new technological advancement and innovation in the hosiery industry.',
  },
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mastanaintl.com';
