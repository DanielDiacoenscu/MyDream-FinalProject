// src/components/ShopByCollectionClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/ShopByCollection.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the shape of the collection data
interface Collection {
  id: number;
  name: string;
  slug: string;
  image: string;
  discoverText: string;
}

// The component receives the collections data from the server component
export default function ShopByCollectionClient({ collections }: { collections: Collection[] }) {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleNavClick = (index: number) => { setActiveIndex(index); };
  const goToPrev = () => { setActiveIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1)); };
  const goToNext = () => { setActiveIndex((prev) => (prev === collections.length - 1 ? 0 : prev + 1)); };

  const slideOffset = (1 - activeIndex) * (100 / collections.length);

  return (
    <section className={styles.collectionSection}>
      <h2 className={styles.mainTitle}>Shop by Collection</h2>
      
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
          <div 
            className={styles.slidesWrapper}
            style={{ transform: `translateX(${slideOffset}%)`, width: `${collections.length * 100}%` }}
          >
            {collections.map((collection, index) => (
              <div key={collection.id} className={`${styles.collectionCard} ${activeIndex === index ? styles.activeCard : ''}`} style={{ flexBasis: `${100 / collections.length}%` }}>
                <span className={styles.discoverText}>{collection.discoverText}</span>
                <div className={styles.imageContainer}>
                  <Image
                    src={collection.image}
                    alt={`Image for ${collection.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="33vw"
                    priority={index === 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={goToNext} className={`${styles.arrowButton} ${styles.rightArrow}`} aria-label="Next Collection"><ChevronRight size={32} /></button>
      </div>

      <div className={styles.shopNowContainer}>
        <Link href={`/collections/${collections[activeIndex].slug}`} className={styles.shopNowButton}>
          Shop Now
        </Link>
      </div>
    </section>
  );
}
