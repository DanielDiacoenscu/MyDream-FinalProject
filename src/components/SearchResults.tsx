// src/components/SearchResults.tsx - SIMPLIFIED
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../lib/types';
import styles from '../styles/SearchResults.module.css'; // We will create this file next

interface SearchResultsProps {
  isOpen: boolean;
  results: Product[];
  isLoading: boolean;
}

export default function SearchResults({ isOpen, results, isLoading }: SearchResultsProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.resultsPanel}>
      <div className={styles.resultsContent}>
        {isLoading && <p className={styles.message}>Searching...</p>}
        {!isLoading && results.length === 0 && (
          <p className={styles.message}>No products found.</p>
        )}
        {results.length > 0 && (
          <ul className={styles.resultsList}>
            {results.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`} className={styles.resultItem}>
                  <div className={styles.resultImage}>
                    <Image
                      src={product.images[0]?.url || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <span className={styles.resultName}>{product.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
