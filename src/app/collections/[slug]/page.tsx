'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductsByCategory } from '../../../lib/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

// Hardcoded collection titles
const COLLECTION_TITLES: { [key: string]: string } = {
  'colour-wash': 'Колекция "Изграждане с акрил"',
  'fragrance': 'Колекция "Изграждане с гел"',
  'portofino-97': 'Златните четки на Татяна Гюмишева'
};

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    if (slug) {
      // Look up the title in our hardcoded dictionary
      const title = COLLECTION_TITLES[slug];
      
      if (title) {
        setCollectionName(title);
      } else {
        const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setCollectionName(formattedName);
      }

      // Fetch products
      const fetchProducts = async () => {
        setIsLoading(true);
        const fetchedProducts = await getProductsByCategory(slug);
        setProducts(fetchedProducts);
        setIsLoading(false);
      };
      fetchProducts();
    }
  }, [slug]);

  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem' }}>Loading Collection...</p>;
  }

  if (!products) {
    return <p style={{ textAlign: 'center', padding: '5rem' }}>Could not load this collection.</p>;
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '4rem', fontFamily: 'JHATimesNow, TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif', fontSize: '2.5rem', fontWeight: 400, textTransform: 'uppercase' }}>
        {collectionName}
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
