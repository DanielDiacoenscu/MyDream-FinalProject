// src/lib/api.ts
import { Product } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

function normalizeStrapiItem<T = any>(item: any): T {
  if (!item) return item;
  return (item.attributes ?? item) as T;
}

function normalizeImageUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return '/placeholder.jpg';
  if (pathOrUrl.startsWith('http')) return pathOrUrl;

  const base = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

function mapProductData(item: any): Product | null {
  if (!item) return null;

  const data: any = normalizeStrapiItem(item);
  const id = item.id;

  const { name, slug, price, Description, description, Images } = data;
  const imagesData = Images?.data ?? Images ?? [];

  return {
    id,
    name: name || 'Unnamed Product',
    slug: slug || '',
    price: price || 0,
    description: description || Description || '',
    images: (Array.isArray(imagesData) ? imagesData : [])
      .map((img: any) => {
        const imgData: any = normalizeStrapiItem(img);
        const url = normalizeImageUrl(imgData?.url);
        return {
          url,
          alternativeText: imgData?.alternativeText || '',
        };
      }),
  };
}

async function fetchAPI(endpoint: string, query: string = '') {
  if (!STRAPI_URL) {
    console.error('STRAPI_URL is empty. Set NEXT_PUBLIC_STRAPI_API_URL in Vercel env vars.');
    return null;
  }

  const requestUrl = `${STRAPI_URL}/api${endpoint}`;
  const fullUrlWithQuery = query ? `${requestUrl}?${query.replace(/^\?/, '')}` : requestUrl;

  // Helpful for debugging in Vercel logs
  console.log(`Fetching from URL: ${fullUrlWithQuery}`);

  try {
    const res = await fetch(fullUrlWithQuery, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // IMPORTANT: no "no-store" here (causes DYNAMIC_SERVER_USAGE in Next builds)
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Failed to fetch API:', res.status, res.statusText, body);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error in fetchAPI:', error);
    return null;
  }
}

function processStrapiResponse(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
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
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  return products.length > 0 ? products[0] : null;
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}&populate=*`;
  const response = await fetchAPI('/products', query);
  return processStrapiResponse(response);
}

export async function getPageBySlug(slug: string) {
  const safeSlug = encodeURIComponent(slug);
  const query = `filters[slug][$eq]=${safeSlug}&populate[content][populate]=*`;
  const response = await fetchAPI('/pages', query);
  const pages = processStrapiResponse(response);
  return pages.length > 0 ? pages[0] : null;
}

export async function getAllProducts() {
  const response = await fetchAPI('/products', 'populate=*');
  return processStrapiResponse(response);
}

export async function getCategories() {
  const response = await fetchAPI('/categories', 'populate=*');
  return processStrapiResponse(response);
}

export async function getCategoryBySlug(slug: string) {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}`;
  const response = await fetchAPI('/categories', query);
  const categories = processStrapiResponse(response);
  return categories.length > 0 ? categories[0] : null;
}

export async function getCategoryDetails(slug: string) {
  try {
    const response = await fetchAPI(
      '/categories',
      `filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    const categories = processStrapiResponse(response);
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error('Failed to fetch category details:', error);
    return null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) return [];

  const filters = `filters[name][$containsi]=${encodeURIComponent(query)}`;
  const populate = 'populate=*';
  const pagination = 'pagination[limit]=5';

  const querystring = [filters, populate, pagination].join('&');
  const endpoint = '/products';

  try {
    const data = await fetchAPI(endpoint, querystring);

    if (!data || !Array.isArray(data.data)) return [];

    return data.data
      .map(mapProductData)
      .filter((p: Product | null): p is Product => p !== null);
  } catch (error) {
    console.error('searchProducts API Error:', error);
    return [];
  }
}

export async function fetchAllCollections(): Promise<any[]> {
  const response = await fetchAPI('/collections', 'populate=*');
  return processStrapiResponse(response);
}
