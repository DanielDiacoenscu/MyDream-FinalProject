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
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick} aria-label="Next">
      <ChevronRight size={24} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick} aria-label="Previous">
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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // DESKTOP UNTOUCHED
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
          slidesToShow: 1, // FORCE ONE PRODUCT
          slidesToScroll: 1,
          arrows: true // FORCE ARROWS
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
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          /* FORCE IDENTICAL DESKTOP ARROWS ON MOBILE */
          .${styles.arrow} {
            display: flex !important;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white !important;
            border: 1px solid #eee !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
            z-index: 100;
            color: #333 !important;
          }
          
          .${styles.nextArrow} { 
            right: 5px !important; 
          }
          
          .${styles.prevArrow} { 
            left: 5px !important; 
          }

          /* Give the single card some breathing room */
          .slick-slide {
            padding: 0 15px !important;
          }
          
          .slick-list {
            margin: 0 -15px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
