// src/types/strapi.ts - Strict type definitions

export interface StrapiImage {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;  // lowercase to match api.ts mapping
  description?: string;
  Images?: StrapiImage[];
  Rating?: number;
  Tag?: string;
  bestseller?: boolean;
  categories?: any[];
}
