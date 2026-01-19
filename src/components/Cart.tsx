// src/components/Cart.tsx - DEFINITIVE FIX
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from '../styles/Cart.module.css';

const Cart = () => {
  // The correct variable is cartCount, as destructured here.
  const { isCartOpen, toggleCart, cartItems, cartTotal, removeFromCart, updateQuantity, cartCount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    setTimeout(() => {
      router.push('/checkout');
    }, 200); 
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`} 
        onClick={toggleCart} 
      />
      <aside className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
        <header className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            Вашата Кошница
            {/* --- THIS IS THE FIX --- */}
            {/* The variable is now correctly named cartCount */}
            <span className={styles.cartCountCircle}>{cartCount}</span>
          </h2>
          <button onClick={toggleCart} className={styles.closeButton}>
            <X size={24} />
          </button>
        </header>

        <div id="cart-drawer-items-container" className={styles.drawerContent}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyMessage}>
              <p>Вашата кошница е празна.</p>
            </div>
          ) : (
            <ul className={styles.cartList}>
              {cartItems.map(item => (
                <li key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image src={item.image} alt={item.name} width={100} height={120} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    {item.subtitle && <p className={styles.itemSubtitle}>{item.subtitle}</p>}
                    {item.tag && <span className={styles.itemTag}>{item.tag}</span>}
                    
                    {item.price > 0 && (
                      <div className={styles.itemQuantity}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    )}
                  </div>
                  <div className={styles.itemActions}>
                    {item.price > 0 ? (
                      <p className={styles.itemPrice}>{item.price.toFixed(2)} €.</p>
                    ) : (
                      <p className={styles.itemPrice}></p>
                    )}
                    <button onClick={() => removeFromCart(item.id)} className={styles.removeItem}>
                      Премахнете
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className={styles.drawerFooter}>
            <div className={styles.total}>
              <span>Общо</span>
              <span>{cartTotal.toFixed(2)} €.</span>
            </div>
            
            <button onClick={handleCheckout} className={styles.checkoutButton}>
              <Lock size={14} style={{ marginRight: '8px' }} />
              Завършване на Поръчката
            </button>

          </footer>
        )}
      </aside>
    </>
  );
};

export default Cart;
