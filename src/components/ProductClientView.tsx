'use client';

import { useCart } from '@/context/CartContext';
import ProductImageGallery from '@/components/pdp/ProductImageGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ProductActions from '@/components/pdp/ProductActions';
import ProductDescriptionAccordion from '@/components/pdp/ProductDescriptionAccordion';
import styles from '@/styles/ProductPage.module.css';

export default function ProductClientView({ product }: { product: any }) {
  if (!product) return null;

  const data = product.attributes ? product.attributes : product;
  const { name, subtitle, price, price_bgn, Images, description, Rating } = data;
  
  // MrRobotsGPT: Parse Strapi Blocks JSON into readable text
  const parseDescription = (desc: any): string => {
    if (typeof desc === 'string') return desc;
    if (Array.isArray(desc)) {
      return desc
        .map((block: any) => {
          if (block.type === 'paragraph' || block.type === 'heading') {
            return block.children?.map((child: any) => child.text).join('') || '';
          }
          return '';
        })
        .join('\n');
    }
    return 'No description available.';
  };

  const descriptionText = parseDescription(description);

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
