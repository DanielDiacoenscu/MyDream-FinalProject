// src/components/Footer.tsx - DEFINITIVE CORRECTED VERSION
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Instagram, Facebook, Youtube } from 'lucide-react';
import styles from '@/styles/Footer.module.css';

// Data for the footer links - NOW SYNCHRONIZED WITH STRAPI SLUGS
const footerData = [
  {
    title: 'Обслужване на клиенти',
    links: [
      { href: '/contact-us', text: 'Контакти' }, // <-- CORRECTED
      { href: '/fa-qs', text: 'Често задавани въпроси' },             // <-- CORRECTED
      { href: '/shipping', text: 'Доставки' },
      { href: '/returns', text: 'Връщане' },
    ],
  },
  {
    title: 'За нас',
    links: [
      { href: '/our-story', text: 'За нас' }
    ],
  },
  {
    title: 'Правна информация',
    links: [
      { href: '/privacy-policy', text: 'Политика за поверителност' },
      { href: '/terms-of-service', text: 'Условия за използване' },
    ],
  },
];

const Footer = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Accordion/Link Columns */}
          {footerData.map((section) => (
            <div key={section.title} className={styles.footerColumn}>
              <div className={styles.accordionHeader} onClick={() => toggleAccordion(section.title)}>
                <span>{section.title}</span>
                <ChevronDown className={`${styles.accordionIcon} ${openAccordion === section.title ? styles.open : ''}`} size={20} />
              </div>
              <ul className={`${styles.footerNav} ${openAccordion === section.title ? styles.open : ''}`}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* GIF Section */}
          <div className={styles.gifSection}>
            <Image 
              src="/Scene.gif"
              alt="Clean Beauty Delivered" 
              width={650} 
              height={371} 
              className={styles.gifPlaceholder}
              unoptimized={true}
            />
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>&copy; {new Date().getFullYear()} MY DREAM by Tatyana Gyumisheva</p>
          <div className={styles.socials}>
            <Link href="https://instagram.com" className={styles.socialLink} aria-label="Instagram" target="_blank">
              <Instagram size={22} />
            </Link>
            <Link href="https://facebook.com" className={styles.socialLink} aria-label="Facebook" target="_blank">
              <Facebook size={22} />
            </Link>
            <Link href="https://youtube.com" className={styles.socialLink} aria-label="YouTube" target="_blank">
              <Youtube size={22} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
