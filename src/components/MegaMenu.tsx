// src/components/MegaMenu.tsx
'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import styles from '../styles/Header.module.css';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  return (
    <>
      <div
        className={`${styles.megaMenuOverlay} ${isOpen ? styles.megaMenuOverlayVisible : ''}`}
        onClick={onClose}
      />
      <div className={`${styles.megaMenu} ${isOpen ? styles.megaMenuVisible : ''}`}>
        <div className={styles.megaMenuHeader}>
          <button onClick={onClose} className={styles.iconButton}>
            <X size={20} />
          </button>
        </div>
        <nav className={styles.megaMenuNav}>
          <Link href="/shop" onClick={onClose} className={styles.megaMenuLink}>Shop</Link>
          <Link href="/categories" onClick={onClose} className={styles.megaMenuLink}>Categories</Link>
          <Link href="/contact" onClick={onClose} className={styles.megaMenuLink}>Contact</Link>
          <Link href="/lessons" onClick={onClose} className={styles.megaMenuLink}>Lessons</Link>
        </nav>
      </div>
    </>
  );
};

export default MegaMenu;
