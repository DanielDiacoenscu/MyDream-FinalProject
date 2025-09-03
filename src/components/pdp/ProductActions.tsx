// src/components/pdp/ProductActions.tsx
'use client';
import { useContext } from 'react';
import { Heart } from 'lucide-react';
import { CartContext } from '@/context/CartContext';
import styles from '@/styles/pdp/ProductActions.module.css';

const ProductActions = ({ product }: { product: any }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className={styles.actions}>
      <button className={styles.discoverButton}>Discover Victoria's Technique</button>
      <div className={styles.addToBagWrapper}>
        <button className={styles.addToBagButton} onClick={() => addToCart(product)}>
          Добави
        </button>
        <button className={styles.wishlistButton} aria-label="Add to Wishlist">
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
