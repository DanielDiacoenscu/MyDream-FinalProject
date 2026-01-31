'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/pdp/ProductImageGallery.module.css';

const ProductImageGallery = ({ images }: { images: any }) => {
  const [mainImage, setMainImage] = useState('');
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

  const imageData = images?.data || (Array.isArray(images) ? images : []);
  
  const getFullUrl = (url: string) => {
    if (!url) return 'https://placehold.co/600x800';
    if (url.startsWith('http')) return url;
    const base = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  useEffect(() => {
    if (imageData.length > 0) {
      const firstImg = imageData[0].attributes?.url || imageData[0].url;
      if (firstImg) setMainImage(getFullUrl(firstImg));
    } else {
      setMainImage('https://placehold.co/600x800');
    }
  }, [images, imageData]);

  if (!mainImage) return null;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper} style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
        <Image 
          src={mainImage} 
          alt="Product Image" 
          width={800} 
          height={1000}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          priority
          unoptimized
        />
      </div>
      {imageData.length > 1 && (
        <div className={styles.thumbnailGrid} style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
          {imageData.map((img: any, idx: number) => {
            const url = img.attributes?.url || img.url;
            if (!url) return null;
            const fullUrl = getFullUrl(url);
            return (
              <div 
                key={idx} 
                style={{ cursor: 'pointer', border: mainImage === fullUrl ? '2px solid black' : '1px solid #ddd', flexShrink: 0 }}
                onClick={() => setMainImage(fullUrl)}
              >
                <Image src={fullUrl} alt="" width={80} height={100} style={{ objectFit: 'cover' }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
