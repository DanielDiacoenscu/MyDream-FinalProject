// src/app/products/[slug]/page.tsx - DEFINITIVE FIX
import { getProductBySlug } from '../../../lib/api';
import { notFound } from 'next/navigation';
import ProductClientView from '@/components/ProductClientView';

// The type definition remains the same
type ProductPageParams = { params: { slug: string; } }

// --- THIS IS THE FIX ---
// Instead of taking 'params' as an argument, we deconstruct it immediately
// in the function signature to get 'slug' directly.
export default async function ProductPage({ params: { slug } }: ProductPageParams) {
  
  // Now we can use 'slug' directly, and the Next.js engine will be satisfied.
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClientView product={product} />;
}
