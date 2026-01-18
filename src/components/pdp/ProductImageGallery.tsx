'use client';
import React, { useState } from 'react';
import styles from '@/styles/pdp/ProductImageGallery.module.css';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.mydreambeauty.net';

export default function ProductImageGallery({ images }: { images: any[] }) {
  const [activeImage, setActiveImage] = useState(0);

  const displayImages = images || [];

  if (displayImages.length === 0) {
    return <div className={styles.galleryContainer}>No images available</div>;
  }

  // Helper to ensure we have a valid full URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${STRAPI_URL}${url}`;
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <img 
          src={getImageUrl(displayImages[activeImage].url)} 
          alt={displayImages[activeImage].alternativeText || 'Product image'} 
          className={styles.mainImage}
        />
      </div>
      {displayImages.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {displayImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`${styles.thumbnailWrapper} ${idx === activeImage ? styles.activeThumb : ''}`}
              onClick={() => setActiveImage(idx)}
            >
              <img 
                src={getImageUrl(img.url)} 
                alt="" 
                className={styles.thumbnail} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
