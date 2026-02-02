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
    <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={onClick} style={{ zIndex: 10, right: '-5px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '5px' }}>
      <ChevronRight size={32} color="black" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={onClick} style={{ zIndex: 10, left: '-5px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '5px' }}>
      <ChevronLeft size={32} color="black" />
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
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          centerMode: false,
          fade: false
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
              <div className="mega-card-wrapper">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          /* FORCE THE SLIDE TO BE HUGE */
          .slick-slide {
            padding: 0 10px !important;
          }
          .mega-card-wrapper {
            width: 100% !important;
            min-height: 600px !important; /* X2 HEIGHT */
            display: flex !important;
            justify-content: center;
          }
          /* TARGET THE PRODUCT CARD DIRECTLY */
          .mega-card-wrapper > div {
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            transform: scale(1.1); /* EXTRA PUSH */
          }
          /* MAKE THE IMAGE CONTAINER WITHIN PRODUCTCARD LARGER */
          .mega-card-wrapper img {
            object-fit: cover !important;
            height: 400px !important; /* FORCE LARGE IMAGE */
          }
          .slick-dots {
            bottom: -40px !important;
          }
          .slick-list {
            overflow: visible !important; /* Prevent clipping of scaled cards */
          }
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
