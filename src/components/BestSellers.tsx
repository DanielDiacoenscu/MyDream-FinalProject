'use client';

import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getBestsellerProducts } from '@/lib/api';
import styles from '@/styles/BestSellers.module.css';

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick}>
      <ChevronRight size={24} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick}>
      <ChevronLeft size={24} />
    </button>
  );
};

const BestSellers = () => {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setIsLoading(true);
        const products = await getBestsellerProducts();
        if (products) setBestsellers(products);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (isLoading || bestsellers.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.introText}>РАЗГЛЕДАЙТЕ НАЙ-ПРОДАВАНИТЕ НИ ПРОДУКТИ</p>
        <div className={styles.divider}></div>
        <h2 className={styles.title}>BEST SELLERS</h2>
      </div>
      
      {/* DESKTOP SLIDER (Uses react-slick) */}
      <div className={styles.carouselContainer}>
        <div className="desktop-only">
          <Slider {...settings}>
            {bestsellers.map((product) => (
              <div key={product.id} className={styles.slide}>
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>

        {/* MOBILE SLIDER (Uses your EXACT CSS classes) */}
        <div className="mobile-only">
          <div className={styles.mobileSliderWrapper}>
            <button 
              className={`${styles.mobileArrow} ${styles.mobilePrevArrow}`} 
              onClick={() => scroll('left')}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className={styles.mobileSliderContainer} ref={scrollRef}>
              {bestsellers.map((product) => (
                <div key={product.id} className={styles.mobileSlide}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <button 
              className={`${styles.mobileArrow} ${styles.mobileNextArrow}`} 
              onClick={() => scroll('right')}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 769px) {
          .mobile-only { display: none; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          /* Force arrows to look like desktop on mobile */
          :global(.${styles.mobileArrow}) {
            background: white !important;
            border: 1px solid #eee !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
