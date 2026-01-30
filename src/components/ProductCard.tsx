'use client';
import Image from 'next/image';
import Link from 'next/link';
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
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const imageUrl = product.Images && product.Images.length > 0 
    ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.Images[0].url}`
    : '/placeholder.jpg';

  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {product.tag && <span className={styles.tag}>{product.tag}</span>}
        <button 
          className={`${styles.wishlistButton} ${isInWishlist(product.id) ? styles.active : ''}`}
          onClick={handleWishlistClick}
        >
          <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </button>
        <Image 
          src={imageUrl} 
          alt={product.name} 
          fill 
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.subtitle}>{product.subtitle || 'Luxury Skincare'}</p>
        <div className={styles.ratingContainer}>
           <StarRating rating={product.Rating || 5} />
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>
            {formatDualPrice(product.price, product.price_bgn)}
          </span>
          <button className={styles.addButton} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
