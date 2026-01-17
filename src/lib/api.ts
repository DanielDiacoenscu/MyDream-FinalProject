import { Product } from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

function mapProductData(item: any): Product | null {
  if (!item) return null;
  const data = item.attributes || item;
  const id = item.id;
  const imagesData = data.Images?.data || data.Images || [];

  return {
    id,
    name: data.name || 'Unnamed Product',
    slug: data.slug || '',
    price: data.price || 0,
    description: data.description || data.Description || '',
    images: imagesData.map((img: any) => {
      const imgData = img.attributes || img;
      let imageUrl = imgData.url || '/placeholder.jpg';
      if (!imageUrl.startsWith('http')) {
        imageUrl = `${STRAPI_URL}${imageUrl}`;
      }
      return { url: imageUrl, alternativeText: imgData.alternativeText || '' };
    }),
  };
}

async function fetchAPI(endpoint: string, query: string = '') {
  const requestUrl = `${STRAPI_URL}/api${endpoint}`;
  const fullUrl = query ? `${requestUrl}?${query.replace(/^\?/, '')}` : requestUrl;

  try {
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 10 }, // Refresh every 10 seconds, avoids DYNAMIC_SERVER_USAGE error
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

function processStrapiResponse(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

export async function getPageBySlug(slug: string) {
  const query = `filters[slug][$eq]=${slug}&populate[page_components][populate]=*`;
  const response = await fetchAPI('/pages', query);
  const pages = processStrapiResponse(response);
  return pages.length > 0 ? pages[0] : null;
}

export async function getNavigationLinks() {
  const response = await fetchAPI('/categories');
  return processStrapiResponse(response);
}

export async function getBestsellerProducts() {
  const response = await fetchAPI('/products', 'populate=Images&filters[bestseller][$eq]=true');
  return processStrapiResponse(response);
}

export async function getProductBySlug(slug: string) {
  const response = await fetchAPI('/products', `filters[slug][$eq]=${slug}&populate=*`);
  const products = processStrapiResponse(response);
  return products.length > 0 ? products[0] : null;
}

export async function getAllProducts() {
  return processStrapiResponse(await fetchAPI('/products', 'populate=*'));
}

export async function getCategories() {
  return processStrapiResponse(await fetchAPI('/categories', 'populate=*'));
}

export async function fetchAllCollections() {
  return processStrapiResponse(await fetchAPI('/collections', 'populate=*'));
}
