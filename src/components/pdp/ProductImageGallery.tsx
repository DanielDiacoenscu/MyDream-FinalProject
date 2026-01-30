// src/components/pdp/ProductImageGallery.tsx - FIXED PROPS
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/pdp/ProductImageGallery.module.css';

interface ProductImageGalleryProps {
  images: {
    id: number;
    url: string;
    alt: string;
  }[];
  selectedImage?: number; // Made optional to be safe
  onImageSelect?: (index: number) => void; // Made optional to be safe
}

const ProductImageGallery = ({ images, selectedImage = 0, onImageSelect }: ProductImageGalleryProps) => {
  // If parent controls state, use it; otherwise use local state
  const [localSelected, setLocalSelected] = useState(0);
  
  const activeIndex = onImageSelect ? selectedImage : localSelected;
  const handleSelect = (index: number) => {
    if (onImageSelect) {
      onImageSelect(index);
    } else {
      setLocalSelected(index);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.mainImageWrapper}>
          <Image 
            src="/placeholder.jpg" 
            alt="No image available" 
            fill 
            className={styles.mainImage}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainImageWrapper}>
        <Image 
          src={images[activeIndex]?.url || '/placeholder.jpg'} 
          alt={images[activeIndex]?.alt || 'Product Image'} 
          fill 
          className={styles.mainImage}
          priority
        />
      </div>
      
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, index) => (
            <button
              key={img.id}
              className={`${styles.thumbnail} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => handleSelect(index)}
            >
              <Image 
                src={img.url} 
                alt={img.alt} 
                fill 
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
