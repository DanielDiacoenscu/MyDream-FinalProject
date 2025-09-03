'use client';

import Link from 'next/link';
import styles from '../styles/HeroSection.module.css';

// The props are updated to accept a videoUrl instead of imageUrl
interface HeroSectionProps {
  videoUrl: string;
  subtitle: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonHref: string;
}

const HeroSection = ({ videoUrl, subtitle, title, description, buttonText, buttonHref }: HeroSectionProps) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.mediaWrapper}>
        {/* This is the new video element. It's set to autoplay, loop, and be silent. */}
        {/* 'playsInline' is critical for it to work correctly on iPhones. */}
        <video 
          key={videoUrl} // Ensures React reloads the video if the URL changes
          className={styles.heroVideo}
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* This entire content block is identical to your old version. Nothing has changed. */}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h4 className={styles.subtitle}>{subtitle}</h4>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <Link href={buttonHref || '#'} className={styles.ctaButton}>{buttonText || 'Shop Now'}</Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
