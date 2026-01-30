// src/components/pdp/ProductInfo.tsx - DUAL CURRENCY
import { Star } from 'lucide-react';
import styles from '@/styles/pdp/ProductInfo.module.css';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
  title: string;
  subtitle: string;
  price: number;
  price_bgn?: number; // <--- ADDED
  rating: number;
}

const ProductInfo = ({ title, subtitle, price, price_bgn, rating }: ProductInfoProps) => {
  const { formatDualPrice } = useCart();

  const renderStars = () => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={16} fill="#1a1a1a" stroke="#1a1a1a" />);
      } else {
        stars.push(<Star key={i} size={16} stroke="#e5e5e5" fill="none" />);
      }
    }
    return stars;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.rating}>
          {renderStars()}
          <span className={styles.reviewCount}>(12 Reviews)</span>
        </div>
      </div>
      
      <p className={styles.subtitle}>{subtitle}</p>
      
      <div className={styles.price}>
        {formatDualPrice(price, price_bgn)}
      </div>
      
      <div className={styles.divider} />
    </div>
  );
};

export default ProductInfo;
