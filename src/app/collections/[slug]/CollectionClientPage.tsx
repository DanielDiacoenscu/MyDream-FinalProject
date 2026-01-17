'use client';

import ProductCard from '../../../components/ProductCard';
import { Product } from '@/lib/types';

interface StrapiCategory {
  id: number;
  attributes?: {
    name: string;
    slug: string;
  };
  name?: string;
  slug?: string;
}

interface CollectionClientPageProps {
  category: StrapiCategory | null;
  products: Product[];
}

export default function CollectionClientPage({ category, products }: CollectionClientPageProps) {
  
  // Strapi 5 compatibility fix
  const categoryData = category?.attributes || category;

  if (!categoryData) {
    return <p style={{ textAlign: 'center', padding: '5rem' }}>This collection could not be found.</p>;
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '4rem', fontFamily: 'Bodoni Moda, serif', fontSize: '2.5rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {categoryData.name}
      </h1>
      
      {products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem 2rem' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '2rem' }}>There are no products in this collection yet.</p>
      )}
    </div>
  );
}
