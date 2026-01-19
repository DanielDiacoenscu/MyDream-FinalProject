// src/app/wishlist/page.tsx
'use client';

import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/ShopPage.module.css'; // Reuse shop page styles

const WishlistPage = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Харесвани</h1>
      {wishlistItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Нямате харесани продукти.</p>
      ) : (
        <div className={styles.productGrid}>
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
