'use client';

import { useState } from 'react';
import ProductImageGallery from '@/components/pdp/ProductImageGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ProductActions from '@/components/pdp/ProductActions';
import ProductDescriptionAccordion from '@/components/pdp/ProductDescriptionAccordion';
import styles from '@/styles/ProductPage.module.css';
import { StrapiProduct } from '@/types/strapi';

interface ProductClientViewProps {
  product: StrapiProduct;
}

const ProductClientView = ({ product }: ProductClientViewProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = product.Images?.map(img => ({
    id: img.id,
    url: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${img.url}`,
    alt: img.alternativeText || product.name
  })) || [];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.galleryColumn}>
          <ProductImageGallery 
            images={images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </div>
        
        <div className={styles.infoColumn}>
          <ProductInfo 
            title={product.name}
            subtitle={product.subtitle || 'Luxury Collection'}
            price={product.price}
            price_bgn={product.price_bgn} // <--- PASSING IT HERE
            rating={product.Rating || 5}
          />
          
          <ProductActions product={product} />
          
          <ProductDescriptionAccordion 
            description={product.description || ''}
            ingredients="Aqua, Glycerin, ..."
            usage="Apply daily..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProductClientView;
