import React from 'react';
import Link from 'next/link';
import { getNavigationLinks } from '@/lib/api';

export default async function CategoriesPage() {
  const categories = await getNavigationLinks().catch(() => []);
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>Всички Категории</h1>
      {categories.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Все още няма добавени категории.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} style={{ display: 'block', padding: '30px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{cat.name}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
