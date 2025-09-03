// src/app/collections/[slug]/page.tsx - THE FINAL, ROBUST VERSION

import { Metadata } from 'next';
import { getCategoryBySlug } from '../../../lib/api';
import CollectionClientPage from './CollectionClientPage';

// This function now includes a guard clause to ensure the slug is valid.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;

  // --- GUARD CLAUSE ---
  if (!slug || typeof slug !== 'string') {
    return { title: 'Invalid Collection URL' };
  }

  const category = await getCategoryBySlug(slug);

  if (!category || !category.attributes) {
    return {
      title: 'Collection Not Found',
      description: 'The collection you are looking for does not exist.'
    };
  }

  return {
    title: `${category.attributes.name} | MyDreamBeauty`,
    description: `Shop the ${category.attributes.name} collection.`,
  };
}

async function fetchProductsDirectly(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const productUrl = `${apiUrl}/api/products?filters[categories][slug][$eq]=${slug}&populate=*`;
    
    console.log(`Executing direct, guaranteed fetch for products from: ${productUrl}`);

    try {
        const productRes = await fetch(productUrl, { cache: 'no-store' });
        if (!productRes.ok) {
            console.error(`Direct product fetch failed: ${productRes.status} ${productRes.statusText}`);
            return [];
        }
        const productData = await productRes.json();
        return (productData && Array.isArray(productData.data)) ? productData.data : [];
    } catch (error) {
        console.error('Critical error during direct product fetch:', error);
        return [];
    }
}

// This main component also includes a guard clause for maximum safety.
export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // --- GUARD CLAUSE ---
  // This check guarantees 'slug' is a valid string before we use it.
  // This resolves the TypeScript error permanently.
  if (!slug || typeof slug !== 'string') {
      // If the slug is invalid, we render the page with no data.
      // The client component already knows how to display a "not found" message.
      return <CollectionClientPage category={null} products={[]} />;
  }

  // This code will now only run if the slug is a valid string.
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    fetchProductsDirectly(slug)
  ]);

  return <CollectionClientPage category={category} products={products} />;
}
