// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductClientView from '@/components/ProductClientView';
import { getProductBySlug } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const transformedProduct = {
    ...product,
    Images: product.images?.data?.map((img: any) => ({
      id: img.id,
      url: img.attributes.url,
      alternativeText: img.attributes.alternativeText || ''
    })) || [],
    Rating: 5,
    price_bgn: product.price_bgn // <--- ENSURE THIS IS PASSED
  };

  return <ProductClientView product={transformedProduct} />;
}
