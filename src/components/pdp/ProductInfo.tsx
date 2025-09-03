// src/components/pdp/ProductInfo.tsx - UPGRADED WITH DYNAMIC RATING
import { Star } from 'lucide-react';
import styles from '@/styles/pdp/ProductInfo.module.css';

interface ProductInfoProps {
  title: string;
  subtitle: string;
  price: number;
  rating: number; // <-- ADDITION: The component now accepts a rating prop
}

const ProductInfo = ({ title, subtitle, price, rating }: ProductInfoProps) => {
  
  // Helper function to render the correct stars
  const renderStars = () => {
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        // Render a filled star if 'i' is less than or equal to the rating
        stars.push(<Star key={i} size={16} fill="black" stroke="none" />);
      } else {
        // Render an empty (outlined) star otherwise
        stars.push(<Star key={i} size={16} fill="none" stroke="currentColor" />);
      }
    }
    return stars;
  };

  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.reviews}>
        {/* --- MODIFIED: The hardcoded stars are replaced with our dynamic function --- */}
        {renderStars()}
        <span className={styles.reviewCount}>168 Reviews</span>
      </div>
      <p className={styles.price}>{price.toFixed(2)} лв.</p>
    </div>
  );
};

export default ProductInfo;
