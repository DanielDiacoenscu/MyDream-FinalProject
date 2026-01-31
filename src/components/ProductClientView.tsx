'use client';

import { useCart } from '@/context/CartContext';
import ProductImageGallery from '@/components/pdp/ProductImageGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ProductActions from '@/components/pdp/ProductActions';
import ProductDescriptionAccordion from '@/components/pdp/ProductDescriptionAccordion';
import styles from '@/styles/ProductPage.module.css';

export default function ProductClientView({ product }: { product: any }) {
  if (!product) return null;

  // Handle raw Strapi nesting
  const data = product.attributes ? product.attributes : product;
  const { name, subtitle, price, price_bgn, Images, description, Rating } = data;
  
  // MrRobotsGPT: FIX FOR ERROR #31
  // If description is a Strapi Blocks object, we need to extract the text or stringify it
  let descriptionText = 'No description available.';
  if (typeof description === 'string') {
    descriptionText = description;
  } else if (description && typeof description === 'object') {
    // Try to extract text from Strapi Blocks or just stringify as a fallback
    try {
      descriptionText = JSON.stringify(description);
    } catch (e) {
      descriptionText = 'Error rendering description object.';
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainGrid}>
        <div className={styles.galleryColumn}>
          <ProductImageGallery images={Images} />
        </div>

        <div className={styles.detailsColumn}>
          <ProductInfo 
            title={name || 'Unnamed'}
            subtitle={subtitle || ''}
            price={price || 0}
            price_bgn={price_bgn}
            rating={Rating || 0}
          />
          <ProductActions product={product} />
          <ProductDescriptionAccordion description={descriptionText} />
        </div>
      </main>
    </div>
  );
}
