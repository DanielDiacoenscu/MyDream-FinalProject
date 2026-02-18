// src/components/PromoSection.tsx - CONFIRMED
import Link from 'next/link';
import styles from '../styles/PromoSection.module.css';

const PromoSection = () => {
  return (
    <section className={styles.promoSection}>
      <video 
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        key="/promo-video2.mp4" // Adding a key can help force a re-render
      >
        <source src="/promo-video2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.contentOverlay}>
        <p className={styles.eyebrow}>НАШИТЕ НАЙ-ХАРЕСВАНИ</p>
        <h2 className={styles.headline}>ИНСТРУМЕНТИ ЗА МАНИКЮР И ПЕДИКЮР</h2>
        <p className={styles.description}>
        „Красивите нокти не са лукс – те са визитка.“
        </p>
        <Link href="/categories/instrumenti-za-manikyur-i-pedikyur" className={styles.ctaButton}>
          РАЗГЛЕДАЙТЕ
        </Link>
      </div>
    </section>
  );
};

export default PromoSection;
