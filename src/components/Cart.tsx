// src/components/Cart.tsx - DUAL CURRENCY ENABLED
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from '../styles/Cart.module.css';

const Cart = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    cartTotal, 
    cartTotalBGN, // <--- ADDED
    removeFromCart, 
    updateQuantity, 
    cartCount,
    formatDualPrice // <--- ADDED
  } = useCart();
  
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    router.push('/checkout');
  };

  return (
    <>
      <div className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`} onClick={toggleCart} />
      <div className={`${styles.cartDrawer} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Shopping Cart ({cartCount})</h2>
          <button onClick={toggleCart} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button onClick={toggleCart} className={styles.continueButton}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemPrice}>
                    {/* CHANGED: Use formatDualPrice */}
                    {formatDualPrice(item.price, item.price_bgn)}
                  </p>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className={styles.removeButton}
                >
                  <X size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span className={styles.totalAmount}>
                {/* CHANGED: Use formatDualPrice for total */}
                {formatDualPrice(cartTotal, cartTotalBGN)}
              </span>
            </div>
            <p className={styles.shippingNote}>Shipping calculated at checkout</p>
            <button onClick={handleCheckout} className={styles.checkoutButton}>
              <Lock size={18} />
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
