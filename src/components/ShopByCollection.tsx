// src/components/ShopByCollection.tsx - UPGRADED WITH PERFECTLY SEAMLESS LOOP
'use client';
import { useState, useEffect, useRef } from 'react'; // 1. useRef is now used
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/ShopByCollection.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const collections = [
  { id: 1, name: 'Изграждане с акрил', slug: 'colour-wash', image: '/1.jpg', discoverText: 'Разгледайте Колекция Изграждане с акрил' },
  { id: 2, name: "Златните четки", slug: 'portofino-97', image: '/2.jpg', discoverText: "Разгледайте Златните четки на Татяна Гюмишева" },
  { id: 3, name: 'Изграждане с гел', slug: 'fragrance', image: '/3.jpg', discoverText: 'Разлгедайте Колекция Изграждане с гел' },
];

const ShopByCollection = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [slideIndex, setSlideIndex] = useState(activeIndex + 1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  
  // 2. Create a ref to hold the slider's DOM element
  const sliderRef = useRef<HTMLDivElement>(null);

  const loopedCollections = [collections[collections.length - 1], ...collections, collections[0]];

  const handleNavClick = (index: number) => {
    setTransitionEnabled(true);
    setActiveIndex(index);
    setSlideIndex(index + 1);
  };

  const goToPrev = () => {
    if (!transitionEnabled) return;
    setTransitionEnabled(true);
    setActiveIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
    setSlideIndex((prev) => prev - 1);
  };

  const goToNext = () => {
    if (!transitionEnabled) return;
    setTransitionEnabled(true);
    setActiveIndex((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
    setSlideIndex((prev) => prev + 1);
  };

  // --- 3. THE DEFINITIVE FIX: Using onTransitionEnd instead of setTimeout ---
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleTransitionEnd = () => {
      // When we land on the last clone (a copy of the first slide)
      if (slideIndex === loopedCollections.length - 1) {
        setTransitionEnabled(false); // Turn off animation
        setSlideIndex(1); // Jump to the real first slide
      }
      // When we land on the first clone (a copy of the last slide)
      if (slideIndex === 0) {
        setTransitionEnabled(false); // Turn off animation
        setSlideIndex(loopedCollections.length - 2); // Jump to the real last slide
      }
    };

    // Listen for the exact moment the CSS transition finishes
    slider.addEventListener('transitionend', handleTransitionEnd);

    // Cleanup: remove the listener when the component updates or unmounts
    return () => {
      slider.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [slideIndex, loopedCollections.length]);

  // This effect is still needed to re-enable transitions after the jump
  useEffect(() => {
    if (!transitionEnabled) {
      // A minimal delay is needed to ensure the browser registers the state change
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  const slideOffset = (1 - slideIndex) * (100 / collections.length);

  return (
    <section className={styles.collectionSection}>
      <h2 className={styles.mainTitle}>Нашите колекции</h2>
      
      <nav className={styles.collectionNav}>
        {collections.map((collection, index) => (
          <button key={collection.id} onClick={() => handleNavClick(index)} className={`${styles.navButton} ${activeIndex === index ? styles.active : ''}`}>
            {collection.name}
          </button>
        ))}
      </nav>

      <div className={styles.carouselContainer}>
        <button onClick={goToPrev} className={`${styles.arrowButton} ${styles.leftArrow}`} aria-label="Previous Collection"><ChevronLeft size={32} /></button>
        
        <div className={styles.carouselSlider}>
          {/* 4. Attach the ref to the DOM element */}
          <div 
            ref={sliderRef}
            className={styles.slidesWrapper}
            style={{ 
              transform: `translateX(${slideOffset}%)`,
              transition: transitionEnabled ? undefined : 'none' 
            }}
          >
            {loopedCollections.map((collection, index) => (
              <div key={`${collection.id}-${index}`} className={`${styles.collectionCard} ${activeIndex === (index - 1) ? styles.activeCard : ''}`}>
                <span className={styles.discoverText}>{collection.discoverText}</span>
                <div className={styles.imageContainer}>
                  <Image
                    src={collection.image}
                    alt={`Image for ${collection.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="33vw"
                    priority={index === 2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={goToNext} className={`${styles.arrowButton} ${styles.rightArrow}`} aria-label="Next Collection"><ChevronRight size={32} /></button>
      </div>

      <div className={styles.shopNowContainer}>
        <Link 
          href={`/collections/${collections[activeIndex].slug}`} 
          className={styles.shopNowButton}
        >
          За повече информация
        </Link>
      </div>
    </section>
  );
};

export default ShopByCollection;
