import qs from 'qs';
import { Product } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN || '';

function mapProductData(item: any): Product | null {
  if (!item) return null;
  const source = item.attributes ? item.attributes : item;
  const id = item.id;
  const { name, slug, price, price_bgn, Description, description, Images } = source;
  const imagesData = Images?.data || Images || [];

  return {
    id,
    name: name || 'Unnamed Product',
    slug: slug || '',
    price: price || 0,
    price_bgn: price_bgn,
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
      return { url: imageUrl, alternativeText: imageSource.alternativeText || '' };
    }),
  };
}

async function fetchAPI(endpoint: string, query: string = '') {
  const requestUrl = `${STRAPI_URL}/api${endpoint}`;
  const fullUrlWithQuery = query ? `${requestUrl}?${query.replace(/^\?/, '')}` : requestUrl;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

  try {
    const res = await fetch(fullUrlWithQuery, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
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
  return processStrapiResponse(response); // Returns ARRAY
}

export async function getProductBySlug(slug: string) {
  const query = `filters[slug][$eq]=${slug}&populate=*`;
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.length > 0 ? products[0] : null;
}

// This one returns the FULL response for the Shop page (to get meta.pagination)
export async function getProductsPaginated(page: number = 1, pageSize: number = 24) {
  const query = qs.stringify({ populate: '*', pagination: { page, pageSize } });
  return await fetchAPI('/products', query);
}

// Keep this returning an ARRAY so it doesn't break existing components
export async function getAllProducts() {
  const query = 'populate=*&pagination[limit]=100';
  const response = await fetchAPI('/products', query);
  return processStrapiResponse(response);
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `filters[categories][slug][$eq]=${categorySlug}&populate=*`;
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

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return [];
  const filters = `filters[name][$containsi]=${encodeURIComponent(query)}&populate=*&pagination[limit]=5`;
  const data = await fetchAPI('/products', filters);
  if (!data || !Array.isArray(data.data)) return [];
  return data.data.map(mapProductData).filter((p: any): p is Product => p !== null);
}

export async function fetchAllCollections() {
  const response = await fetchAPI('/collections', 'populate=*');
  return processStrapiResponse(response);
}

export async function createOrder(orderData: any) {
  const url = `${STRAPI_URL}/api/orders`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: orderData }),
  });
  return await response.json();
}

export async function updateUserWishlist(token: string, userId: number, productIds: number[]) {
  const url = `${STRAPI_URL}/api/users/${userId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ wishlist: productIds }),
  });
  return await response.json();
}
