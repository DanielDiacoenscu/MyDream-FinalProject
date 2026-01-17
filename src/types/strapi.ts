export interface StrapiProduct {
  id: number;
  name: string;
  price: number;
  slug: string;
  Images: {
    id: number;
    url: string;
    alternativeText: string;
  }[];
  tag?: string;
  subtitle?: string;
  Rating?: number;
}
