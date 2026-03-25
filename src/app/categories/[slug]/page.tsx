'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductsByCategory } from '../../../lib/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        setIsLoading(true);
        
        // 1. Fetch products normally
        const fetchedProducts = await getProductsByCategory(slug);
        setProducts(fetchedProducts);

        // 2. Direct, ultra-simple fetch to Strapi to see exactly what it says
        try {
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.mydreambeauty.net';
          const url = `${baseUrl}/api/categories?filters[slug][$eq]=${slug}`;
          
          const res = await fetch(url);
          const data = await res.json();
          
          // Save the exact response so we can see it on the screen
          setDebugInfo({ requestedUrl: url, strapiResponse: data });

          if (data && data.data && data.data.length > 0) {
            const cat = data.data[0];
            const actualName = cat.name || cat.attributes?.name;
            setCategoryName(actualName || slug);
          } else {
            setCategoryName(`${slug} (Not Found in DB)`);
          }
        } catch (error: any) {
          setDebugInfo({ error: error.message });
          setCategoryName(`${slug} (Fetch Error)`);
        }

        setIsLoading(false);
      };
      fetchData();
    }
  }, [slug]);

  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '5rem' }}>Loading products...</p>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem' }}>
      
      {/* --- DEBUG BOX: We will remove this once we see the problem --- */}
      <div style={{ background: '#111', color: '#0f0', padding: '1rem', marginBottom: '2rem', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', fontFamily: 'monospace' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff' }}>POLYCODE DEBUGGER:</p>
        <pre style={{ margin: 0 }}>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>
      {/* ------------------------------------------------------------- */}

      <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'serif', fontSize: '2.5rem', fontWeight: 400 }}>
        {categoryName}
      </h1>
      
      {products && products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem 1.5rem' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>There are no products in this category yet.</p>
      )}
    </div>
  );
}
