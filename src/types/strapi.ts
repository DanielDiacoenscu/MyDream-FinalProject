export interface StrapiProduct {
  id: number;
  name: string;
  price: number;
  price_bgn?: number;
  slug: string;
  description?: string; // <--- ADDED THIS
  Images: {
    id: number;
    url: string;
    alternativeText: string;
  }[];
  tag?: string;
  subtitle?: string;
  Rating?: number;
}
