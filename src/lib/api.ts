// src/lib/api.ts - FIXED: Added Auth Header & Corrected Populate

import qs from 'qs';
import { Product } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN || '';

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

async function fetchAPI(endpoint: string, query: string = '') {
  const requestUrl = `${STRAPI_URL}/api${endpoint}`;
  const fullUrlWithQuery = query ? `${requestUrl}?${query.replace(/^\?/, '')}` : requestUrl;

  console.log(`Fetching from URL: ${fullUrlWithQuery}`);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // FIX: Add Authorization Header if Token Exists
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  try {
    const res = await fetch(fullUrlWithQuery, {
      method: 'GET',
      headers,
      next: { revalidate: 0 }, // FIX: Disable cache to force fresh data
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
  // FIX: Changed 'page_components' to '*' to catch 'content' dynamic zone
  const query = `filters[slug][$eq]=${slug}&populate=*`;
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

// --- ORDER FUNCTION ---
export async function createOrder(orderData: any) {
  const url = `${STRAPI_URL}/api/orders`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: orderData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Order submission failed:', response.status, errorText);
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
}

// --- WISHLIST FUNCTION ---
export async function updateUserWishlist(token: string, userId: number, productIds: number[]) {
  const url = `${STRAPI_URL}/api/users/${userId}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ wishlist: productIds }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi Error Details:', errorText);
      throw new Error(`Failed to update wishlist: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
}
