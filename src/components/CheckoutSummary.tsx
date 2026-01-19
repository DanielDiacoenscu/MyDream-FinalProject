// src/components/CheckoutSummary.tsx - UPGRADED VERSION
'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext'; // <-- NEW: Import useCheckout
import styles from '@/styles/Checkout.module.css';

const CheckoutSummary = () => {
  const { cartItems, cartTotal } = useCart();
  const { shippingCost } = useCheckout(); // <-- NEW: Get shippingCost from context

  // --- NEW: DYNAMIC SHIPPING CALCULATION ---
  const isEligibleForFreeShipping = cartTotal >= 100;
  const finalShippingCost = isEligibleForFreeShipping ? 0 : shippingCost;
  const grandTotal = cartTotal + finalShippingCost;

  return (
    <div>
      <h2 className={styles.summaryTitle}>Обобщение на поръчката</h2>
      <ul className={styles.summaryItemList}>
        {cartItems.map(item => (
          <li key={item.id} className={styles.summaryItem}>
            <Image 
              src={item.image} 
              alt={item.name} 
              width={80} 
              height={96} 
              className={styles.summaryItemImage}
            />
            <div className={styles.summaryItemInfo}>
              <p className={styles.summaryItemName}>{item.name}</p>
              {item.subtitle && <p className={styles.summaryItemSubtitle}>{item.subtitle}</p>}
              <p className={styles.summaryItemQuantity}>Qty: {item.quantity}</p>
            </div>
            <p className={styles.summaryItemPrice}>{(item.price * item.quantity).toFixed(2)} €.</p>
          </li>
        ))}
      </ul>
      <div className={styles.summaryTotals}>
        <div className={styles.summaryTotalRow}>
          <span>Междинна сума</span>
          <span>{cartTotal.toFixed(2)} €.</span>
        </div>
        <div className={styles.summaryTotalRow}>
          <span>Доставка</span>
          {/* --- NEW: DYNAMIC SHIPPING DISPLAY --- */}
          <span>{isEligibleForFreeShipping ? 'FREE' : `${finalShippingCost.toFixed(2)} €.`}</span>
        </div>
        <div className={`${styles.summaryTotalRow} ${styles.grandTotal}`}>
          <span>Общо</span>
          <span>{grandTotal.toFixed(2)} €.</span>
        </div>
        {isEligibleForFreeShipping && (
          <p className={styles.freeShippingMessage}>Congratulations, you've earned free shipping!</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
