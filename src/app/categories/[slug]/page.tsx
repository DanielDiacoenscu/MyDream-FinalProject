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

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        setIsLoading(true);
        
        // 1. Fetch products normally
        const fetchedProducts = await getProductsByCategory(slug);
        setProducts(fetchedProducts);

        // 2. Direct fetch for category name (The proven working method!)
        try {
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.mydreambeauty.net';
          const url = `${baseUrl}/api/categories?filters[slug][$eq]=${slug}`;
          
          const res = await fetch(url);
          const data = await res.json();
          
          if (data && data.data && data.data.length > 0) {
            const cat = data.data[0];
            const actualName = cat.name || cat.attributes?.name;
            setCategoryName(actualName || slug);
          } else {
            // Fallback to formatted slug if not found
            setCategoryName(slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
          }
        } catch (error) {
          // Fallback on error
          setCategoryName(slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
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
