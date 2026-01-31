// src/app/products/[slug]/page.tsx - DEFINITIVE FIX
import { getProductBySlug } from '../../../lib/api';
import { notFound } from 'next/navigation';
import ProductClientView from '@/components/ProductClientView';

type ProductPageParams = { params: { slug: string; } }

export default async function ProductPage({ params: { slug } }: ProductPageParams) {
  
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Ensure price_bgn is passed through if it exists in attributes
  // (The api.ts update handles the mapping, so 'product' here is already the clean object)

  return <ProductClientView product={product} />;
}
