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
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick} style={{ zIndex: 50, right: '10px' }}>
      <ChevronRight size={35} color="#000" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick} style={{ zIndex: 50, left: '10px' }}>
      <ChevronLeft size={35} color="#000" />
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
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // ONLY ONE CARD
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          centerMode: false,
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
              <div className="mobile-single-card-wrapper">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          /* FORCE ONE CARD TO FILL THE SCREEN */
          .slick-slide {
            width: 100vw !important;
            display: flex !important;
            justify-content: center !important;
            padding: 0 20px !important;
          }
          .mobile-single-card-wrapper {
            width: 100% !important;
            max-width: 400px; /* Keeps it from getting TOO wide on tablets */
            margin: 0 auto;
          }
          /* Make the card content larger */
          .mobile-single-card-wrapper > div {
            width: 100% !important;
            min-height: 500px;
          }
          /* Ensure arrows are visible over the large card */
          .${styles.arrow} {
            background: rgba(255, 255, 255, 0.7) !important;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .slick-dots {
            bottom: -35px;
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
