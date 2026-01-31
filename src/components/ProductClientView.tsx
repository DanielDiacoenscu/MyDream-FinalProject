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

  const { name, subtitle, price, price_bgn, Images, description, rating } = product; // <--- ADDED price_bgn
  
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
            price_bgn={price_bgn} // <--- PASSED
            rating={rating || 0}
          />
          <ProductActions product={product} />

          <ProductDescriptionAccordion description={descriptionText} />

        </div>

      </main>
    </div>
  );
}
