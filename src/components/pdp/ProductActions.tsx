// src/components/pdp/ProductActions.tsx - PATCHED FOR BUILD
'use client';
import { Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // <-- NECESSARY CHANGE: Import the safe hook
import styles from '@/styles/pdp/ProductActions.module.css';

const ProductActions = ({ product }: { product: any }) => {
  const { addToCart } = useCart(); // <-- NECESSARY CHANGE: Use the safe hook

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
