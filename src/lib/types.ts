// src/lib/types.ts - FINAL VERSION

export interface ProductImage {
  url: string;
  alternativeText?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: ProductImage[];
}
