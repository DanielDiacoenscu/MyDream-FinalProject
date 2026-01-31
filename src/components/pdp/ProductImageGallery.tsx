'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/pdp/ProductImageGallery.module.css';

const ProductImageGallery = ({ images }: { images: any }) => {
  const [mainImage, setMainImage] = useState('');
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

  // MrRobotsGPT: Digging into the raw Strapi 'data' array
  const imageData = images?.data || (Array.isArray(images) ? images : []);
  
  const getFullUrl = (url: string) => {
    if (!url) return 'https://placehold.co/600x800';
    // If it's already a full URL, leave it. Otherwise, slap the Strapi URL on the front.
    if (url.startsWith('http')) return url;
    const base = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  useEffect(() => {
    if (imageData.length > 0) {
      const firstImg = imageData[0].attributes?.url || imageData[0].url;
      if (firstImg) {
        setMainImage(getFullUrl(firstImg));
      }
    } else {
      setMainImage('https://placehold.co/600x800');
    }
  }, [images, imageData]);

  if (!mainImage) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <Image 
          src={mainImage} 
          alt="Product Image" 
          fill 
          className={styles.mainImage}
          priority
          unoptimized={mainImage.includes('placehold.co')}
        />
      </div>
      {imageData.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {imageData.map((img: any, idx: number) => {
            const url = img.attributes?.url || img.url;
            if (!url) return null;
            const fullUrl = getFullUrl(url);
            return (
              <div 
                key={idx} 
                className={`${styles.thumbnailWrapper} ${mainImage === fullUrl ? styles.active : ''}`}
                onClick={() => setMainImage(fullUrl)}
              >
                <Image src={fullUrl} alt="" width={80} height={100} className={styles.thumb} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
