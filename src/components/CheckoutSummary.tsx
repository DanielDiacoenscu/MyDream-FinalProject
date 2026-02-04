'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import styles from '@/styles/Checkout.module.css';

const CheckoutSummary = () => {
  // ADDED: cartTotalBGN, formatDualPrice
  const { cartItems, cartTotal, cartTotalBGN, formatDualPrice } = useCart();
  const { shippingCost, promoCode, discountAmount, applyPromoCode, removePromoCode } = useCheckout();
  
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEligibleForFreeShipping = cartTotal >= 100;
  const finalShippingCost = isEligibleForFreeShipping ? 0 : shippingCost;
  
  // Calculate Grand Total (EUR)
  const grandTotal = Math.max(0, cartTotal - discountAmount) + finalShippingCost;

  // ADDED: Calculate Grand Total (BGN)
  const discountBGN = discountAmount * 1.95583;
  const shippingBGN = finalShippingCost * 1.95583;
  const grandTotalBGN = Math.max(0, cartTotalBGN - discountBGN) + shippingBGN;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsLoading(true);
    setPromoMessage(null);

    const result = await applyPromoCode(promoInput, cartTotal);
    
    setPromoMessage({ 
      text: result.message, 
      type: result.success ? 'success' : 'error' 
    });
    setIsLoading(false);
    if (result.success) setPromoInput('');
  };

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
            {/* CHANGED: Use formatDualPrice for item total */}
            <p className={styles.summaryItemPrice}>
              {formatDualPrice(
                item.price * item.quantity, 
                (item.price_bgn || item.price * 1.95583) * item.quantity
              )}
            </p>
          </li>
        ))}
      </ul>

      {/* --- PROMO CODE SECTION --- */}
      <div style={{ marginTop: '20px', marginBottom: '20px', borderTop: '1px solid #e5e5e5', paddingTop: '20px' }}>
        {!promoCode ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Промо код" 
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className={styles.formInput}
              style={{ flexGrow: 1, padding: '10px' }}
            />
            <button 
              onClick={handleApplyPromo}
              disabled={isLoading}
              className={styles.formButton}
              style={{ width: 'auto', marginTop: 0, padding: '10px 20px', fontSize: '12px' }}
            >
              {isLoading ? '...' : 'ПРИЛОЖИ'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '10px', border: '1px solid #bbf7d0' }}>
            <span style={{ color: '#166534', fontSize: '14px', fontWeight: '600' }}>
              Code: {promoCode}
            </span>
            <button 
              onClick={removePromoCode}
              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
            >
              Remove
            </button>
          </div>
        )}
        
        {promoMessage && (
          <p style={{ 
            fontSize: '12px', 
            marginTop: '8px', 
            color: promoMessage.type === 'success' ? '#166534' : '#dc2626' 
          }}>
            {promoMessage.text}
          </p>
        )}
      </div>

      <div className={styles.summaryTotals}>
        <div className={styles.summaryTotalRow}>
          <span>Междинна сума</span>
          {/* CHANGED: Use formatDualPrice */}
          <span>{formatDualPrice(cartTotal, cartTotalBGN)}</span>
        </div>
        
        {/* --- DISCOUNT ROW --- */}
        {discountAmount > 0 && (
          <div className={styles.summaryTotalRow} style={{ color: '#166534' }}>
            <span>Отстъпка</span>
            {/* CHANGED: Use formatDualPrice */}
            <span>-{formatDualPrice(discountAmount, discountBGN)}</span>
          </div>
        )}

        <div className={styles.summaryTotalRow}>
          <span>Доставка</span>
          {/* CHANGED: Use formatDualPrice */}
          <span>
            {isEligibleForFreeShipping 
              ? 'FREE' 
              : formatDualPrice(finalShippingCost, shippingBGN)
            }
          </span>
        </div>
        <div className={`${styles.summaryTotalRow} ${styles.grandTotal}`}>
          <span>Общо:</span>
          {/* CHANGED: Use formatDualPrice */}
          <span>{formatDualPrice(grandTotal, grandTotalBGN)}</span>
        </div>
        {isEligibleForFreeShipping && (
          <p className={styles.freeShippingMessage}>Поздравления, спечелихте безплатна доставка!</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;

