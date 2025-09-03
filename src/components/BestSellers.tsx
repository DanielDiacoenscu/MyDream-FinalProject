// src/components/BestSellers.tsx - THE DEFINITIVE VERSION WITH ARROWS
'use client';

import { useState, useEffect, useRef } from 'react'; // <-- Import useRef
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { StrapiProduct } from './ProductCard';
import { getBestsellerProducts } from '../lib/api';
import styles from '../styles/BestSellers.module.css';
import { useIsMobile } from '../hooks/useIsMobile';

// Desktop-only arrows
const NextArrow = (props: any) => {
  const { onClick } = props;
  return <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick}><ChevronRight size={24} /></button>;
};
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick}><ChevronLeft size={24} /></button>;
};

const BestSellers = () => {
  const [bestsellers, setBestsellers] = useState<StrapiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const mobileSliderRef = useRef<HTMLDivElement>(null); // <-- Ref for the mobile slider

  useEffect(() => {
    const fetchBestsellers = async () => {
      setIsLoading(true);
      const products = await getBestsellerProducts();
      if (products) setBestsellers(products);
      setIsLoading(false);
    };
    fetchBestsellers();
  }, []);

  // --- LOGIC FOR MOBILE SCROLLING ---
  const handleMobileScroll = (direction: 'left' | 'right') => {
    if (mobileSliderRef.current) {
      const scrollAmount = mobileSliderRef.current.clientWidth * 0.8; // Scroll by 80% of the container width
      const newScrollLeft = direction === 'left' 
        ? mobileSliderRef.current.scrollLeft - scrollAmount
        : mobileSliderRef.current.scrollLeft + scrollAmount;
      
      mobileSliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const desktopSettings = {
    dots: false,
    infinite: bestsellers.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [{ breakpoint: 1024, settings: { slidesToShow: 3 } }],
  };

  const MobileSlider = () => (
    // The container now has the ref and the arrow buttons
    <div className={styles.mobileSliderWrapper}>
      <button 
        className={`${styles.mobileArrow} ${styles.mobilePrevArrow}`} 
        onClick={() => handleMobileScroll('left')}
        aria-label="Previous Bestsellers"
      >
        <ChevronLeft size={24} />
      </button>
      <div className={styles.mobileSliderContainer} ref={mobileSliderRef}>
        {bestsellers.map((product) => (
          <div key={product.id} className={styles.mobileSlide}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <button 
        className={`${styles.mobileArrow} ${styles.mobileNextArrow}`} 
        onClick={() => handleMobileScroll('right')}
        aria-label="Next Bestsellers"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );

  const DesktopSlider = () => (
    <Slider {...desktopSettings}>
      {bestsellers.map((product) => (
        <div key={product.id} className={styles.slide}>
          <ProductCard product={product} />
        </div>
      ))}
    </Slider>
  );

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.introText}>РАЗГЛЕДАЙТЕ НАЙ-ПРОДАВАНИТЕ НИ ПРОДУКТИ</p>
        <div className={styles.divider}></div>
        <h2 className={styles.title}>BEST SELLERS</h2>
      </div>
      <div className={styles.carouselContainer}>
        {isLoading ? <p>Loading...</p> : (isMobile ? <MobileSlider /> : <DesktopSlider />)}
      </div>
    </section>
  );
};

export default BestSellers
