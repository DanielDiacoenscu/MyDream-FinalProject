// src/components/Header.tsx - FINAL, CORRECTED PATHS
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Heart, ShoppingBag, Menu, X, Plus, Minus } from 'lucide-react';

// --- CORRECTED PATHS ---
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from '@/styles/Header.module.css';
import { NavigationLink } from '@/types/navigation';
import { getNavigationLinks, searchProducts } from '@/lib/api';
import { Product } from '@/lib/types';
// --- END OF CORRECTIONS ---

interface StrapiCategory { id: number; name: string; slug: string; }

const MOCK_NAV_DATA: NavigationLink[] = [
  { id: 1, label: 'Магазин', href: '/shop', mega_menu: null },
  { id: 2, label: 'Категории', href: '/categories', mega_menu: { id: 1, columns: [], image: { url: 'https://placehold.co/300x200/D3C5C0/333?text=New+Arrivals', alt: 'New Arrivals' }, image_title: 'DISCOVER NEW ARRIVALS', image_href: '/shop/new' }},
  { id: 3, label: 'Контакти', href: '/contact-us', mega_menu: null },
  { id: 4, label: 'Уроци', href: 'https://tatyanagyumisheva.com', mega_menu: null },
];

const Header = () => {
  const [navLinks, setNavLinks] = useState<NavigationLink[]>(MOCK_NAV_DATA);
  const { toggleCart, cartCount } = useCart();
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<StrapiCategory[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- Desktop Search State ---
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  // --- Mobile Search State (NEW) ---
  const [mobileQuery, setMobileQuery] = useState('');
  const [mobileDebouncedQuery, setMobileDebouncedQuery] = useState('');
  const [mobileResults, setMobileResults] = useState<Product[]>([]);
  const [isMobileLoading, setIsMobileLoading] = useState(false);

  // Debounce for Desktop
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Debounce for Mobile (NEW)
  useEffect(() => {
    const handler = setTimeout(() => setMobileDebouncedQuery(mobileQuery), 300);
    return () => clearTimeout(handler);
  }, [mobileQuery]);

  // API call for Desktop
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      setIsLoading(true);
      setIsResultsVisible(true);
      searchProducts(debouncedQuery).then(data => {
        setResults(data);
        setIsLoading(false);
      });
    } else {
      setResults([]);
      setIsResultsVisible(false);
    }
  }, [debouncedQuery]);

  // API call for Mobile (NEW)
  useEffect(() => {
    if (mobileDebouncedQuery.length > 1) {
      setIsMobileLoading(true);
      searchProducts(mobileDebouncedQuery).then(data => {
        setMobileResults(data);
        setIsMobileLoading(false);
      });
    } else {
      setMobileResults([]);
    }
  }, [mobileDebouncedQuery]);

  // Click outside to close desktop results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDesktopSearch = () => {
    setQuery('');
    setIsResultsVisible(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileQuery(''); // Reset mobile search on close
  };

  const handleAccordionToggle = (id: number) => { setOpenAccordion(openAccordion === id ? null : id); };

  useEffect(() => {
    const fetchNavData = async () => {
      const categories: StrapiCategory[] = await getNavigationLinks();
      if (categories) { setDynamicCategories(categories); }
    };
    fetchNavData();
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <>
      <header ref={searchContainerRef} className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        {/* ... Top bar and nav bar are unchanged ... */}
        <div className={styles.topBar}>
          <div className={styles.leftSection}>
            <button onClick={() => setIsMobileMenuOpen(true)} className={`${styles.iconButton} ${styles.mobileOnly}`}><Menu size={24} /></button>
            <Link href="/wishlist" className={`${styles.iconButton} ${styles.mobileOnly}`} style={{ position: 'relative' }}>
                <Heart size={18} />
                {wishlistCount > 0 && ( <span className={styles.countBadge}>{wishlistCount}</span> )}
            </Link>
            <div className={`${styles.inlineSearchContainer} ${styles.desktopOnly}`}>
              <Search size={18} className={styles.inlineSearchIcon} />
              <input type="text" placeholder="Търсене..." className={styles.inlineSearchInput} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => { if (query.length > 1) setIsResultsVisible(true); }} />
            </div>
          </div>
          
          {/* --- LOGO SECTION: REPLACED WITH IMAGE (700px) --- */}
          <div className={styles.logoSection}>
            <Link href="/" style={{ display: 'block', position: 'relative', width: '700px', height: '300px' }}>
              <img 
                src="/logo.png?v=5" 
                alt="My Dream by Tatyana Gyumisheva" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </Link>
          </div>
          {/* ------------------------------------------------- */}

          <div className={styles.rightSection}>
            <Link href={user ? "/account" : "/login"} className={styles.iconButton}><User size={18} /></Link>
            <Link href="/wishlist" className={`${styles.iconButton} ${styles.desktopOnly}`} style={{ position: 'relative' }}><Heart size={18} />{wishlistCount > 0 && ( <span className={styles.countBadge}>{wishlistCount}</span> )}</Link>
            <button onClick={toggleCart} className={styles.iconButton} style={{ position: 'relative' }}><ShoppingBag size={18} />{cartCount > 0 && ( <span className={styles.countBadge}>{cartCount}</span> )}</button>
          </div>
        </div>
        <nav className={styles.navBar}>{navLinks.map((link) => (<div key={link.id} className={styles.navItem}><Link href={link.href} className={styles.navLink}>{link.label}</Link>{link.mega_menu && (<div className={styles.megaMenu}><div className={styles.megaMenuContent}><div className={styles.megaMenuColumns}><div className={styles.megaMenuColumn}>{dynamicCategories.map((category) => ( category && category.slug && ( <Link key={category.id} href={`/categories/${category.slug}`}>{category.name}</Link> ))) }</div></div><div className={styles.megaMenuImage}><Link href={link.mega_menu.image_href}><img src={link.mega_menu.image.url} alt={link.mega_menu.image.alt} /><p>{link.mega_menu.image_title}</p></Link></div></div></div>)}</div>))}</nav>
        {isResultsVisible && (<div className={styles.resultsPanel}>{isLoading && <div className={styles.resultsMessage}>Searching...</div>}{!isLoading && results.length === 0 && debouncedQuery.length > 1 && (<div className={styles.resultsMessage}>No products found for &quot;{debouncedQuery}&quot;.</div>)}{results.length > 0 && (<ul className={styles.resultsList}>{results.slice(0, 5).map((product) => (<li key={product.id}><Link href={`/products/${product.slug}`} onClick={closeDesktopSearch} className={styles.resultItem}><div className={styles.resultImage}><Image src={product.images[0]?.url || '/placeholder.jpg'} alt={product.name} fill style={{ objectFit: 'cover' }} /></div><span className={styles.resultName}>{product.name}</span></Link></li>))}</ul>)}</div>)}
      </header>

      {/* --- MOBILE NAV DRAWER UPDATES --- */}
      <div className={`${styles.mobileNavDrawer} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <button onClick={closeMobileMenu} className={styles.iconButton}><X size={24} /></button>
          
          {/* --- MOBILE LOGO: REPLACED WITH IMAGE (320px) --- */}
          <div className={styles.drawerLogo} style={{ position: 'relative', width: '320px', height: '140px' }}>
             <img 
              src="/logo.png?v=5" 
              alt="My Dream" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          {/* ------------------------------------------------ */}

        </div>
        <div className={styles.drawerSearchWrapper}>
          <input
            type="text"
            placeholder="Search For..."
            className={styles.drawerSearchInput}
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
          />
          <Search size={20} className={styles.drawerSearchIcon} />
        </div>
        <div className={styles.drawerContent}>
          {/* --- NEW: Conditional Rendering for Search Results --- */}
          {mobileQuery.length > 1 ? (
            <div className={styles.drawerResultsContainer}>
              {isMobileLoading && <div className={styles.drawerResultsMessage}>Searching...</div>}
              {!isMobileLoading && mobileResults.length === 0 && (
                <div className={styles.drawerResultsMessage}>No products found.</div>
              )}
              {mobileResults.length > 0 && (
                <ul className={styles.drawerResultsList}>
                  {mobileResults.map(product => (
                    <li key={product.id}>
                      <Link href={`/products/${product.slug}`} className={styles.drawerResultItem} onClick={closeMobileMenu}>
                        <div className={styles.drawerResultImage}>
                          <Image src={product.images[0]?.url || '/placeholder.jpg'} alt={product.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <span className={styles.drawerResultName}>{product.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <nav className={styles.drawerNav}>{navLinks.map((link) => (<div key={link.id} className={styles.accordionItem}>{link.label === 'Категории' ? (<><div className={styles.accordionHeader} onClick={() => handleAccordionToggle(link.id)}><span>{link.label}</span>{openAccordion === link.id ? <Minus size={20} /> : <Plus size={20} />}</div><div className={`${styles.accordionContent} ${openAccordion === link.id ? styles.open : ''}`}>{dynamicCategories.map(subLink => ( subLink && subLink.slug && ( <Link key={subLink.id} href={`/categories/${subLink.slug}`} className={styles.accordionLink} onClick={closeMobileMenu}>{subLink.name}</Link> ))) }</div></>) : ( <div className={styles.accordionHeader}><Link href={link.href} onClick={closeMobileMenu}>{link.label}</Link></div> )}</div>))}</nav>
          )}
        </div>
      </div>
      <div className={`${styles.overlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={closeMobileMenu} />
    </>
  );
};

export default Header;
