'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/pdp/ProductImageGallery.module.css';

const ProductImageGallery = ({ images }: { images: any }) => {
  const [mainImage, setMainImage] = useState('');
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';

  // Dig into Strapi's nested data structure
  const imageData = images?.data || [];
  
  const getFullUrl = (url: string) => {
    if (!url) return 'https://placehold.co/600x800';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  };

  useEffect(() => {
    if (imageData.length > 0) {
      const firstImg = imageData[0].attributes?.url || imageData[0].url;
      setMainImage(getFullUrl(firstImg));
    }
  }, [images, imageData]);

  if (!mainImage) return <div className={styles.placeholder}>No Image</div>;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <Image src={mainImage} alt="Product" fill className={styles.mainImage} priority />
      </div>
      {imageData.length > 1 && (
        <div className={styles.thumbnailGrid}>
          {imageData.map((img: any, idx: number) => {
            const url = img.attributes?.url || img.url;
            const fullUrl = getFullUrl(url);
            return (
              <div key={idx} className={styles.thumbnailWrapper} onClick={() => setMainImage(fullUrl)}>
                <Image src={fullUrl} alt="" width={80} height={100} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
