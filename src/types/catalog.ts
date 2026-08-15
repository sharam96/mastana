export type Spec = { label: string; value: string };

export type SpecTable = { header: string[]; rows: string[][] };

export type Product = {
  legacyId: number;
  legacyUrl: string;
  slug: string;
  name: string;
  model: string | null;
  series: string | null;
  categorySlug: string;
  categoryName: string;
  description: string;
  features: string[];
  applications: string[];
  specifications: Spec[];
  specTable: SpecTable | null;
  image: string;
  gallery: string[];
};

export type Category = {
  legacyId: number;
  legacyName: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string | null;
  legacyUrl: string;
};

export type Catalog = { categories: Category[]; products: Product[] };
