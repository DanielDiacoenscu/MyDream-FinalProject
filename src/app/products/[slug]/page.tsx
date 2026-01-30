// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductClientView from '@/components/ProductClientView';
import { getProductBySlug } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const rawProduct = await getProductBySlug(params.slug);

  if (!rawProduct) {
    notFound();
  }

  // Handle Strapi v4 structure (id + attributes)
  const attributes = rawProduct.attributes || rawProduct;
  const id = rawProduct.id;

  const transformedProduct = {
    id: id,
    name: attributes.name,
    slug: attributes.slug,
    price: attributes.price,
    price_bgn: attributes.price_bgn,
    description: attributes.description || attributes.Description || '',
    subtitle: attributes.subtitle,
    tag: attributes.tag,
    Rating: attributes.Rating || 5,
    Images: attributes.Images?.data?.map((img: any) => ({
      id: img.id,
      url: img.attributes.url,
      alternativeText: img.attributes.alternativeText || ''
    })) || []
  };

  return <ProductClientView product={transformedProduct} />;
}
