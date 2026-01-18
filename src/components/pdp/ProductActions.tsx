// src/components/pdp/ProductActions.tsx - FULLY FUNCTIONAL
'use client';
import { Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from '@/styles/pdp/ProductActions.module.css';

const ProductActions = ({ product }: { product: any }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={styles.actions}>
      <button className={styles.discoverButton}>Discover Victoria's Technique</button>
      <div className={styles.addToBagWrapper}>
        <button className={styles.addToBagButton} onClick={() => addToCart(product)}>
          Добави
        </button>
        <button 
          className={styles.wishlistButton} 
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            size={20} 
            fill={isWishlisted ? "white" : "none"} 
            stroke="white"
          />
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
