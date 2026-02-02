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
    <button className={`${styles.arrow} ${styles.nextArrow} custom-nav-arrow`} onClick={onClick}>
      <ChevronRight size={24} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow} custom-nav-arrow`} onClick={onClick}>
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
        if (products && products.length > 0) setBestsellers(products);
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
    infinite: bestsellers.length > 1,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // FORCE ONE
          slidesToScroll: 1,
          arrows: true
        }
      }
    ]
  };

  if (isLoading || bestsellers.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.introText}>РАЗГЛЕДАЙТЕ НАЙ-ПРОДАВАНИТЕ НИ ПРОДУКТИ</p>
        <div className={styles.divider}></div>
        <h2 className={styles.title}>BEST SELLERS</h2>
      </div>
      
      <div className="bestsellers-force-wrapper">
        <Slider {...settings}>
          {bestsellers.map((product) => (
            <div key={product.id} className="force-full-width-slide">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .bestsellers-force-wrapper {
            padding: 0 40px !important;
            display: block !important;
          }
          .force-full-width-slide {
            width: 100% !important;
            display: block !important;
            padding: 10px !important;
          }
          .slick-track {
            display: flex !important;
            width: 10000px !important; /* Force horizontal track */
          }
          .slick-slide {
            width: calc(100vw - 80px) !important; /* Force slide to be screen width minus padding */
            float: left !important;
            height: auto !important;
          }
          .custom-nav-arrow {
            display: flex !important;
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 100 !important;
            background: white !important;
            border: 1px solid #ddd !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .slick-next { right: -30px !important; }
          .slick-prev { left: -30px !important; }
          
          /* Force buttons inside ProductCard to show */
          .force-full-width-slide button {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
          }
        }
      `}} />
    </section>
  );
};

export default BestSellers;
