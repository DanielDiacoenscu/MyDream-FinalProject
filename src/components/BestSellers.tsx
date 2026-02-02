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

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(4);
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
              <div className="product-card-mobile-wrapper">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .slick-slide {
            padding: 0 10px !important;
          }
          
          /* FORCE BUTTONS TO SHOW ON MOBILE */
          /* We target common class names for the 'Add to Bag' and 'Wishlist' buttons */
          .product-card-mobile-wrapper [class*="actions"],
          .product-card-mobile-wrapper [class*="button"],
          .product-card-mobile-wrapper [class*="btn"],
          .product-card-mobile-wrapper button {
            opacity: 1 !important;
            visibility: visible !important;
            display: flex !important;
            transform: none !important;
            bottom: 0 !important; /* Ensure they aren't shifted off-screen */
          }

          /* Ensure the container for buttons is visible */
          .product-card-mobile-wrapper [class*="hover"],
          .product-card-mobile-wrapper [class*="overlay"] {
            opacity: 1 !important;
            visibility: visible !important;
            background: transparent !important;
          }

          /* ARROW STYLING - MATCH DESKTOP */
          .${styles.arrow} {
            display: flex !important;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white !important;
            border: 1px solid #eee !important;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 20;
          }

          .${styles.nextArrow} { right: 0px !important; }
          .${styles.prevArrow} { left: 0px !important; }

          /* Fix card height so buttons have space */
          .product-card-mobile-wrapper {
            min-height: 520px;
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
