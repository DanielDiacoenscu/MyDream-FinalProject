import qs from 'qs';
import { Product } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN || '';

function mapProductData(item: any): any {
  if (!item) return null;
  const source = item.attributes ? item.attributes : item;
  const id = item.id;
  
  // Extract images correctly for your ProductCard
  const imagesData = source.Images?.data || source.Images || [];
  const mappedImages = imagesData.map((img: any) => {
    const imgSource = img.attributes ? img.attributes : img;
    return {
      url: imgSource.url,
      alternativeText: imgSource.alternativeText || ''
    };
  });

  return {
    id,
    ...source,
    Images: mappedImages, // Flattened images array
    images: mappedImages, // Backup for other components
  };
}

async function fetchAPI(endpoint: string, query: string = '') {
  const requestUrl = `${STRAPI_URL}/api${endpoint}`;
  const fullUrlWithQuery = query ? `${requestUrl}?${query.replace(/^\?/, '')}` : requestUrl;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

  try {
    const res = await fetch(fullUrlWithQuery, { method: 'GET', headers, next: { revalidate: 0 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) { return null; }
}

function processStrapiResponse(response: any): any[] {
  if (response && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

// FIXED: This now flattens the data so ProductCard can read it
export async function getBestsellerProducts() {
  const query = 'populate=Images&filters[bestseller][$eq]=true';
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.map(mapProductData).filter(Boolean);
}

export async function getProductBySlug(slug: string) {
  const query = `filters[slug][$eq]=${slug}&populate=*`;
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.length > 0 ? mapProductData(products[0]) : null;
}

export async function getAllProducts() {
  const query = 'populate=*&pagination[limit]=100';
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.map(mapProductData).filter(Boolean);
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `filters[categories][slug][$eq]=${categorySlug}&populate=*`;
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.map(mapProductData).filter(Boolean);
}

export async function getNavigationLinks() {
  const response = await fetchAPI('/categories');
  return processStrapiResponse(response);
}

export async function getCategories() {
  const query = 'populate=*';
  const response = await fetchAPI('/categories', query);
  return processStrapiResponse(response);
}

export async function getCategoryDetails(slug: string) {
  const response = await fetchAPI(`/categories?filters[slug][$eq]=${slug}`);
  return (response && response.data && response.data.length > 0) ? response.data[0] : null;
}

export async function fetchAllCollections() {
  const response = await fetchAPI('/collections', 'populate=*');
  return processStrapiResponse(response);
}

export async function createOrder(orderData: any) {
  const url = `${STRAPI_URL}/api/orders`;
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: orderData }) });
  return await response.json();
}

export async function updateUserWishlist(token: string, userId: number, productIds: number[]) {
  const url = `${STRAPI_URL}/api/users/${userId}`;
  const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ wishlist: productIds }) });
  return await response.json();
}
