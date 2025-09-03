// src/app/collections/[slug]/CollectionClientPage.tsx - CORRECTED
'use client';

import ProductCard from '../../../components/ProductCard';

// Define the types for the data we receive
interface StrapiProduct {
  id: number;
  [key: string]: any;
}
interface StrapiCategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}
interface CollectionClientPageProps {
  category: StrapiCategory | null;
  products: StrapiProduct[];
}

export default function CollectionClientPage({ category, products }: CollectionClientPageProps) {
  
  // --- THIS IS THE FIX ---
  // This more robust check ensures both 'category' and 'category.attributes' exist before trying to use them.
  // This satisfies the TypeScript compiler and prevents potential runtime errors.
  if (!category || !category.attributes) {
    return <p style={{ textAlign: 'center', padding: '5rem' }}>This collection could not be found.</p>;
  }
  // --- END OF FIX ---

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '4rem', fontFamily: 'Bodoni Moda, serif', fontSize: '2.5rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {category.attributes.name}
      </h1>
      
      {products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem 2rem' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '2rem' }}>There are no products in this collection yet.</p>
      )}
    </div>
  );
}
