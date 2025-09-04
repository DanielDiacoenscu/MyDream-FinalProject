// src/lib/api.ts - FINAL CORRECTED VERSION

import qs from 'qs';
import { Product } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

function mapProductData(item: any): Product | null {
  if (!item) return null;

  const source = item.attributes ? item.attributes : item;
  const id = item.id;
  const { name, slug, price, Description, description, Images } = source;
  const imagesData = Images?.data || Images || [];

  return {
    id,
    name: name || 'Unnamed Product',
    slug: slug || '',
    price: price || 0,
    description: description || Description || '',
    images: imagesData.map((img: any) => {
      const imageSource = img.attributes ? img.attributes : img;
      let imageUrl = '/placeholder.jpg';

      if (imageSource && typeof imageSource.url === 'string') {
        const path = imageSource.url;
        if (path.startsWith('http')) {
          imageUrl = path;
        } else {
          const strapiUrl = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL;
          const imagePath = path.startsWith('/') ? path : `/${path}`;
          imageUrl = `${strapiUrl}${imagePath}`;
        }
      }
      return {
        url: imageUrl,
        alternativeText: imageSource.alternativeText || '',
      };
    }),
  };
}

// --- THIS IS THE ONLY PART THAT HAS CHANGED ---
async function fetchAPI(endpoint: string, query: string = '') {
  // Server-side fetch needs a full, absolute URL.
  // We construct it directly from the environment variable.
  const requestUrl = `${STRAPI_URL}/api${endpoint}`;
  
  const fullUrlWithQuery = query ? `${requestUrl}?${query.replace(/^\?/, '')}` : requestUrl;

  console.log(`Fetching from URL: ${fullUrlWithQuery}`);

  try {
    const res = await fetch(fullUrlWithQuery, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // This cache option is better for production builds
      next: { revalidate: 60 }, // Revalidate the data every 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch API:', res.status, res.statusText, await res.text());
      throw new Error('Failed to fetch API');
    }
    return await res.json();
  } catch (error) {
    console.error('Error in fetchAPI:', error);
    return null;
  }
}
// --- END OF THE CHANGED SECTION ---

function processStrapiResponse(response: any): any[] {
  if (response && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

export async function getNavigationLinks() {
  const response = await fetchAPI('/categories');
  return processStrapiResponse(response);
}

export async function getBestsellerProducts() {
  const query = 'populate=Images&filters[bestseller][$eq]=true';
  const response = await fetchAPI('/products', query);
  return processStrapiResponse(response);
}

export async function getProductBySlug(slug: string) {
  const query = `filters[slug][$eq]=${slug}&populate=*`;
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.length > 0 ? products[0] : null;
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `filters[categories][slug][$eq]=${categorySlug}&populate=*`;
  const response = await fetchAPI('/products', query);
  return processStrapiResponse(response);
}

export async function getPageBySlug(slug: string) {
  const query = `filters[slug][$eq]=${slug}&populate=page_components`;
  const response = await fetchAPI('/pages', query);
  const pages = processStrapiResponse(response);
  return pages.length > 0 ? pages[0] : null;
}

export async function getAllProducts() {
  const query = 'populate=*';
  const response = await fetchAPI('/products', query);
  return processStrapiResponse(response);
}

export async function getCategories() {
  const query = 'populate=*';
  const response = await fetchAPI('/categories', query);
  return processStrapiResponse(response);
}

export async function getCategoryBySlug(slug: string) {
  const query = `filters[slug][$eq]=${slug}`;
  const response = await fetchAPI('/categories', query);
  const categories = processStrapiResponse(response);
  return categories.length > 0 ? categories[0] : null;
}

export async function getCategoryDetails(slug: string) {
  try {
    const response = await fetchAPI(`/categories?filters[slug][$eq]=${slug}`);
    return response.data[0];
  } catch (error) {
    console.error('Failed to fetch category details:', error);
    return null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) {
    return [];
  }

  const filters = `filters[name][$containsi]=${encodeURIComponent(query)}`;
  const populate = 'populate=*';
  const pagination = 'pagination[limit]=5';

  const querystring = [filters, populate, pagination].join('&');
  const endpoint = `/products`;

  try {
    const data = await fetchAPI(endpoint, querystring);

    if (!data || !Array.isArray(data.data)) {
        return [];
    }

    const products = data.data
      .map(mapProductData)
      .filter((p: Product | null): p is Product => p !== null);

    return products;
  } catch (error) {
    console.error("searchProducts API Error:", error);
    return [];
  }
}

export async function fetchAllCollections(): Promise<any[]> {
  const response = await fetchAPI('/collections', 'populate=*');
  return processStrapiResponse(response);
}
