// src/components/ProductImageGallery.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface Image {
  attributes: {
    url: string;
    alternativeText?: string;
  };
}

interface ProductImageGalleryProps {
  images: Image[];
  apiBaseUrl: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, apiBaseUrl }) => {
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(`${apiBaseUrl}${images[0].attributes.url}`);
    }
  }, [images, apiBaseUrl]);

  if (!images || images.length === 0) {
    return <div className="w-full aspect-w-4 aspect-h-5 bg-gray-200 animate-pulse"></div>;
  }

  const imageUrls = images.map(img => `${apiBaseUrl}${img.attributes.url}`);

  return (
    <div className="w-full">
      <div className="relative aspect-w-4 aspect-h-5 mb-4">
        <img src={mainImage} alt="Main product" className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {imageUrls.map((url, index) => (
          <div 
            key={index} 
            className={`cursor-pointer border-2 ${mainImage === url ? 'border-black' : 'border-transparent'}`}
            onClick={() => setMainImage(url)}
          >
            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
