'use client';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import StarRating from './StarRating';
import styles from '@/styles/ProductCard.module.css';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { StrapiProduct } from '@/types/strapi';

interface ProductCardProps { 
  product: StrapiProduct; 
}

const ProductCard = ({ product }: ProductCardProps) => {
  if (!product) {
    return null; 
  }

  const { addToCart, formatDualPrice } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const primaryImage = product.Images?.[0];
  const imageUrl = primaryImage 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${primaryImage.url}` 
    : 'https://placehold.co/400x500';
  const imageAltText = primaryImage?.alternativeText || product.name || 'Product image';

  const handleAddToCart = (e: React.MouseEvent) => { 
    e.preventDefault();
    addToCart(product); 
  };
  
  const isWishlisted = isInWishlist(product.id);
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) { 
      removeFromWishlist(product.id); 
    } else { 
      addToWishlist(product); 
    }
  };

  return (
    <div className={styles.productTile}>
      <div className={styles.productTileInfo}>
        <div className={styles.productTileNamePrice}>
          <a href={`/products/${product.slug || product.id}`} className={styles.productTileName}>
            <span>{product.name}</span>
          </a>
          <span className={styles.price}>
            <span className={styles.sales}>
              <span className={styles.value}>
                {formatDualPrice(product.price, product.price_bgn)}
              </span>
            </span>
          </span>
        </div>
        {product.Rating && (
          <div className={styles.ratings}>
            <StarRating rating={product.Rating} />
          </div>
        )}
        {product.tag && (
          <div className={styles.productTileInfoBadge}>{product.tag}</div>
        )}
      </div>
      <a href={`/products/${product.slug || product.id}`} className={styles.productTileImageLink}>
        <div className={styles.productTileImageContainer}>
          <Image 
            src={imageUrl} 
            alt={imageAltText} 
            width={400} 
            height={500} 
            className={styles.productTileImage}
            unoptimized={imageUrl.includes('placehold.co')}
          />
        </div>
      </a>
      <div className={styles.productTileVariantsAndCta}>
        <div className={styles.productTileCta}>
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Добави
          </button>
          <button className={styles.wishlistBtn} onClick={handleWishlistToggle}>
            <Heart size={18} fill={isWishlisted ? 'black' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
