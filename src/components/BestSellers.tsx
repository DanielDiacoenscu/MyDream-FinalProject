'use client';

import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getBestsellerProducts } from '@/lib/api';
import styles from '@/styles/BestSellers.module.css';

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick} style={{ zIndex: 10 }}>
      <ChevronRight size={32} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick} style={{ zIndex: 10 }}>
      <ChevronLeft size={32} />
    </button>
  );
};

const BestSellers = () => {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setIsLoading(true);
        const products = await getBestsellerProducts();
        if (products && products.length > 0) {
          setBestsellers(products);
        }
      } catch (error) {
        console.error("Failed to fetch bestsellers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestsellers();

    // Handle screen resize manually to avoid slick's buggy responsive settings
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1); // ONE CARD ON MOBILE
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(4); // FOUR ON DESKTOP
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: bestsellers.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
  };

  if (isLoading || bestsellers.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.introText}>РАЗГЛЕДАЙТЕ НАЙ-ПРОДАВАНИТЕ НИ ПРОДУКТИ</p>
        <div className={styles.divider}></div>
        <h2 className={styles.title}>BEST SELLERS</h2>
      </div>
      
      <div className={styles.carouselContainer}>
        <Slider {...settings}>
          {bestsellers.map((product) => (
            <div key={product.id} className={styles.slide}>
              <div className={styles.cardWrapper}>
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .slick-slide {
            padding: 0 20px !important;
          }
          .${styles.arrow} {
            display: flex !important;
            background: rgba(255, 255, 255, 0.8) !important;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .${styles.nextArrow} { right: 5px !important; }
          .${styles.prevArrow} { left: 5px !important; }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
