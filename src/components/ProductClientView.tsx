'use client';

import { useCart } from '@/context/CartContext';
import ProductImageGallery from '@/components/pdp/ProductImageGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ProductActions from '@/components/pdp/ProductActions';
import ProductDescriptionAccordion from '@/components/pdp/ProductDescriptionAccordion';
import styles from '@/styles/ProductPage.module.css';

export default function ProductClientView({ product }: { product: any }) {
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const { name, subtitle, price, Images, description, rating } = product;
  
  // Ensure 'description' is treated as a string, with a fallback.
  const descriptionText = description || 'No description available.';

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainGrid}>
      
        <div className={styles.galleryColumn}>
          <ProductImageGallery images={Images} />
        </div>

        <div className={styles.detailsColumn}>
          <ProductInfo 
            title={name}
            subtitle={subtitle || ''}
            price={price}
            rating={rating || 0}
          />
          <ProductActions product={product} />

          <ProductDescriptionAccordion description={descriptionText} />

        </div>

      </main>
    </div>
  );
}
