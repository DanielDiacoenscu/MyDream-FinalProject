'use client';

import { useCart } from '@/context/CartContext';
import ProductImageGallery from '@/components/pdp/ProductImageGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ProductActions from '@/components/pdp/ProductActions';
import ProductDescriptionAccordion from '@/components/pdp/ProductDescriptionAccordion';
import styles from '@/styles/ProductPage.module.css';

export default function ProductClientView({ product }: { product: any }) {
  const { addToCart } = useCart();

  if (!product) return null;

  // MrRobotsGPT: Since your getProductBySlug returns the RAW Strapi object,
  // we HAVE to look inside 'attributes'.
  const data = product.attributes ? product.attributes : product;
  
  // Now we destructure from the correct level
  const { name, subtitle, price, price_bgn, Images, description, Rating } = data;
  
  const descriptionText = description || 'No description available.';

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainGrid}>
        <div className={styles.galleryColumn}>
          {/* ProductImageGallery needs to handle the raw Images.data array */}
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
          {/* Pass the raw product so Actions can find the ID and attributes */}
          <ProductActions product={product} />
          <ProductDescriptionAccordion description={descriptionText} />
        </div>
      </main>
    </div>
  );
}
