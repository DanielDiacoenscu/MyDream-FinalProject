const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.mydreambeauty.net';

export async function fetchAPI(endpoint: string, query: string = '') {
  const url = `${STRAPI_URL}/api${endpoint}${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch API: ${res.statusText}`);
  return res.json();
}

export function processStrapiResponse(response: any) {
  if (!response.data) return [];
  return Array.isArray(response.data) ? response.data : [response.data];
}

export function mapProductData(item: any) {
  const attrs = item.attributes || item;
  
  // Handle images safely - check both lowercase and uppercase
  const rawImages = attrs.images?.data || attrs.Images?.data || attrs.images || attrs.Images || [];
  
  const images = rawImages.map((img: any) => {
    const imgAttrs = img.attributes || img;
    return {
      id: img.id,
      url: imgAttrs.url,
      alternativeText: imgAttrs.alternativeText || '',
    };
  });

  return {
    id: item.id,
    name: attrs.name || attrs.Name,
    price: attrs.price || attrs.Price || 0,
    slug: attrs.slug,
    subtitle: attrs.subtitle || attrs.Subtitle || '',
    description: attrs.description || attrs.Description || '',
    tag: attrs.tag || attrs.Tag || '',
    rating: attrs.rating || attrs.Rating || 0,
    images: images, // Normalized to lowercase 'images'
    Images: images  // Keep uppercase for legacy components just in case
  };
}

export async function getProducts() {
  const response = await fetchAPI('/products', 'populate=*');
  const products = processStrapiResponse(response);
  return products.map(mapProductData);
}

export async function getProductBySlug(slug: string) {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
  const response = await fetchAPI('/products', query);
  const products = processStrapiResponse(response);
  const product = products.length > 0 ? products[0] : null;
  return product ? mapProductData(product) : null;
}

// Re-export other functions to prevent build errors
export async function getNavigationLinks() {
  const response = await fetchAPI('/categories');
  return processStrapiResponse(response);
}

export async function getBestsellerProducts() {
  const query = 'populate=Images&filters[bestseller][$eq]=true';
  const response = await fetchAPI('/products', query);
  return processStrapiResponse(response);
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}&populate=*`;
  const response = await fetchAPI('/products', query);
  const rawProducts = processStrapiResponse(response);
  return rawProducts.map(mapProductData);
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
  const rawProducts = processStrapiResponse(response);
  return rawProducts.map(mapProductData);
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

export async function searchProducts(query: string) {
  if (!query) return [];
  const filters = `filters[name][$containsi]=${encodeURIComponent(query)}`;
  const populate = 'populate=*';
  const pagination = 'pagination[limit]=5';
  const querystring = [filters, populate, pagination].join('&');
  const endpoint = '/products';
  try {
    const data = await fetchAPI(endpoint, querystring);
    if (!data || !Array.isArray(data.data)) return [];
    return data.data.map(mapProductData);
  } catch (error) {
    console.error('searchProducts API Error:', error);
    return [];
  }
}

export async function fetchAllCollections() {
  const response = await fetchAPI('/collections', 'populate=*');
  return processStrapiResponse(response);
}
