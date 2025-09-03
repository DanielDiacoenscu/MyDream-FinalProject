// src/components/pdp/ProductImageGallery.tsx - CORRECTED FOR FLAT DATA
import Image from 'next/image';
import styles from '@/styles/pdp/ProductImageGallery.module.css';

const ProductImageGallery = ({ images }: { images: any[] }) => {
  if (!images || images.length === 0) {
    return <div className={styles.gallery}>No images available.</div>;
  }

  return (
    <div className={styles.gallery}>
      {images.map((image: any) => (
        <div key={image.id} className={styles.imageWrapper}>
          <Image
            // --- CORRECTED: Reads from image.url directly ---
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${image.url}`}
            alt={image.alternativeText || 'Product Image'}
            width={image.width}
            height={image.height}
            className={styles.image}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductImageGallery;
