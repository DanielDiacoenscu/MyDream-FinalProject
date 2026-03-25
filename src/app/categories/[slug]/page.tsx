'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductsByCategory, getCategoryBySlug } from '../../../lib/api';
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
        
        const [fetchedProducts, categoryDetails] = await Promise.all([
          getProductsByCategory(slug),
          getCategoryBySlug(slug)
        ]);

        setProducts(fetchedProducts);

        console.log("Category Details fetched:", categoryDetails);

        // EXACT MATCH TO YOUR COLLECTIONS LOGIC
        if (categoryDetails) {
          const data = categoryDetails.attributes || categoryDetails;
          
          if (data.name) {
            setCategoryName(data.name);
          } else {
            // Fallback if name is somehow empty
            setCategoryName(slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
          }
        } else {
          // Fallback if categoryDetails is null
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
  if (!products) {
    return <p>Could not load products for this category.</p>;
  }
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'serif', fontSize: '2.5rem', fontWeight: 400 }}>
        {categoryName}
      </h1>
      {products.length > 0 ? (
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
