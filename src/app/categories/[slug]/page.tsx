'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// --- NECESSARY ADDITION: Import the new API function ---
import { getProductsByCategory, getCategoryDetails } from '../../../lib/api';
import ProductCard from '@/components/ProductCard';

// This uses the flexible interface that we now know is required.
interface StrapiProduct {
  id: number;
  [key: string]: any;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<StrapiProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (slug) {
      // This line is now handled inside fetchData as a fallback
      // const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      // setCategoryName(formattedName);
      const fetchData = async () => {
        setIsLoading(true);
        
        // --- NECESSARY ADDITION: Fetch products and category details simultaneously ---
        const [fetchedProducts, categoryDetails] = await Promise.all([
          getProductsByCategory(slug),
          getCategoryDetails(slug)
        ]);

        setProducts(fetchedProducts);

        // --- NECESSARY ADDITION: Use the real name from Strapi, or fall back to the old method ---
        if (categoryDetails && categoryDetails.name) {
          setCategoryName(categoryDetails.name);
        } else {
          const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          setCategoryName(formattedName);
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>There are no products in this category yet.</p>
      )}
    </div>
  );
}
