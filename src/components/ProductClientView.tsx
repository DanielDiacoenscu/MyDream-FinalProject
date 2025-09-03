// src/components/ProductClientView.tsx - CORRECTED
'use client';

import { useCart } from '@/context/CartContext'; // <-- The necessary import
import ProductImageGallery from '@/components/pdp/ProductImageGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ProductActions from '@/components/pdp/ProductActions';
import ProductDescriptionAccordion from '@/components/pdp/ProductDescriptionAccordion';
import styles from '@/styles/ProductPage.module.css';

export default function ProductClientView({ product }: { product: any }) {
  const { addToCart } = useCart(); // <-- The necessary change: use the safe hook

  if (!product) {
    return null;
  }

  const { name, Subtitle, Price, Images, Description, Rating } = product;
  
  // Ensure 'Description' is treated as a string, with a fallback.
  const descriptionText = Description || 'No description available.';

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainGrid}>
      
        <div className={styles.galleryColumn}>
          <ProductImageGallery images={Images} />
        </div>

        <div className={styles.detailsColumn}>
          <ProductInfo 
            title={name}
            subtitle={Subtitle || ''}
            price={Price}
            rating={Rating || 0}
          />
          <ProductActions product={product} />

          <ProductDescriptionAccordion description={descriptionText} />

        </div>

      </main>
    </div>
  );
}
