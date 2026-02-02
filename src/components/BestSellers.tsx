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
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick} style={{ zIndex: 5 }}>
      <ChevronRight size={24} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick} style={{ zIndex: 5 }}>
      <ChevronLeft size={24} />
    </button>
  );
};

const BestSellers = () => {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const settings = {
    dots: true,
    infinite: bestsellers.length > 1,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // THIS FIXES THE TINY CARDS
          slidesToScroll: 1,
          arrows: true,
          dots: true,
        }
      }
    ],
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
              <div className={styles.mobileCardFix}>
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .slick-track {
            display: flex !important;
            align-items: stretch !important;
          }
          .slick-slide {
            height: inherit !important;
            padding: 0 15px !important; /* Gives the card space to breathe */
          }
          .${styles.carouselContainer} {
            padding: 0 30px !important; /* Keeps arrows from overlapping text */
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
