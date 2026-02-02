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
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick} style={{ zIndex: 10, right: '5px' }}>
      <ChevronRight size={30} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick} style={{ zIndex: 10, left: '5px' }}>
      <ChevronLeft size={30} />
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
    slidesToShow: 4, // Desktop default
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // FORCE ONE LARGE CARD
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          centerMode: false
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
              <div className="mobile-card-wrapper">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .slick-slide > div {
            display: block !important;
            width: 100% !important;
          }
          .mobile-card-wrapper {
            width: 100% !important;
            padding: 0 10px;
            box-sizing: border-box;
          }
          /* Force the ProductCard to take full width */
          .mobile-card-wrapper > div {
            width: 100% !important;
            max-width: 100% !important;
          }
          .slick-list {
            margin: 0 -10px;
          }
          .slick-dots {
            bottom: -30px;
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
