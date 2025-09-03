// src/types/strapi.ts - NEW FILE

// This is the single, central definition for a product from Strapi.
export interface StrapiProduct {
  id: number;
  [key: string]: any; // Allows for flexible properties like 'name', 'Price', etc.
}
