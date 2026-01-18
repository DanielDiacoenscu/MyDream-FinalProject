// src/types.ts - DEFINITIVE TYPE DEFINITIONS

export interface IProduct {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    images: {
      data: {
        id: number;
        attributes: {
          name: string;
          alternativeText: string | null;
          url: string;
          formats: {
            thumbnail: { url: string };
            small: { url: string };
            medium: { url: string };
            large: { url: string };
          };
        };
      }[];
    };
    category: {
        data: {
            id: number;
            attributes: {
                name: string;
                slug: string;
            }
        }
    }
  };
}

export interface IUser {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    wishlist?: any; // <--- The new wire that allows syncing
}
