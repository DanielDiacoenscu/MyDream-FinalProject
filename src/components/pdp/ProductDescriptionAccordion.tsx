// src/components/pdp/ProductDescriptionAccordion.tsx - CORRECTED
'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '@/styles/pdp/ProductDescriptionAccordion.module.css';

// We change the prop back to 'description: string'
const ProductDescriptionAccordion = ({ description }: { description: string }) => {
  const [isOpen, setIsOpen] = useState(true);

  // If the description string is empty or missing, don't render.
  if (!description) {
    return null;
  }

  return (
    <div className={styles.accordion}>
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span>Description</span>
        <ChevronDown className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
      </button>
      {isOpen && (
        // We no longer use the BlocksRenderer, we just display the text directly.
        <div className={styles.content}>
          {description}
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionAccordion;
