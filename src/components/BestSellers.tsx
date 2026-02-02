'use client';

import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getBestsellerProducts } from '@/lib/api';
import styles from '@/styles/BestSellers.module.css';
import { useIsMobile } from '@/hooks/useIsMobile';

const NextArrow = (props: any) => {
  const { onClick } = props;
  return <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick}><ChevronRight size={24} /></button>;
};
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick}><ChevronLeft size={24} /></button>;
};

const BestSellers = () => {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const mobileSliderRef = useRef<HTMLDivElement>(null);

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

  const handleMobileScroll = (direction: 'left' | 'right') => {
    if (mobileSliderRef.current) {
      const scrollAmount = mobileSliderRef.current.clientWidth * 0.8;
      mobileSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const desktopSettings = {
    dots: false,
    infinite: bestsellers.length > 4,
    speed: 500,
    slidesToShow: Math.min(bestsellers.length, 4),
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(bestsellers.length, 3) } }
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
        {isMobile ? (
          <div className={styles.mobileSliderWrapper} style={{ position: 'relative', width: '100%' }}>
            {/* FORCED VISIBILITY ARROWS */}
            <button 
              className={`${styles.mobileArrow} ${styles.mobilePrevArrow}`} 
              onClick={() => handleMobileScroll('left')}
              style={{ zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className={styles.mobileSliderContainer} ref={mobileSliderRef} style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex' }}>
              {bestsellers.map((product) => (
                <div key={product.id} className={styles.mobileSlide} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <button 
              className={`${styles.mobileArrow} ${styles.mobileNextArrow}`} 
              onClick={() => handleMobileScroll('right')}
              style={{ zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <Slider {...desktopSettings}>
            {bestsellers.map((product) => (
              <div key={product.id} className={styles.slide}>
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
