// src/components/StarRating.tsx
import { Star, StarHalf } from 'lucide-react';
import styles from '../styles/StarRating.module.css';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating = ({ rating, totalStars = 5 }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={styles.starContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={styles.star} fill="currentColor" />
      ))}
      {halfStar && <StarHalf key="half" className={styles.star} fill="currentColor" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={styles.star} />
      ))}
    </div>
  );
};

export default StarRating;
