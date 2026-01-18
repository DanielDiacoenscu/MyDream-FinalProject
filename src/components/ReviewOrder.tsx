// src/components/ReviewOrder.tsx - FINAL LOGIC FIX
'use client';

import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/api';
import styles from '@/styles/Checkout.module.css';

const ReviewOrder = () => {
  const router = useRouter();
  const { shippingAddress, shippingMethod, shippingCost } = useCheckout();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Calculate final total including shipping
  const finalTotal = cartTotal + shippingCost;

  const handlePlaceOrder = async () => {
    const orderData = {
      shippingAddress,
      shippingMethod,
      cartItems,
      total: finalTotal, // <--- FIX: Sending the CORRECT total (inc. shipping)
      orderStatus: 'Pending',
    };

    try {
      await createOrder(orderData);

      clearCart();
      router.push('/order-confirmation'); 

    } catch (error) {
      console.error('Failed to place order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <div className={styles.review}>
      <div className={styles.reviewSection}>
        <h3 className={styles.reviewTitle}>Доставка до</h3>
        <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
        <p>{shippingAddress.address}</p>
        <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
        <p>{shippingAddress.phone}</p>
      </div>
      
      <div className={styles.reviewSection}>
        <h3 className={styles.reviewTitle}>Метод на доставка</h3>
        <p>{shippingMethod === 'address' ? 'До адрес' : shippingMethod === 'office' ? 'До офис' : 'До автомат'}</p>
        <p>Цена: {shippingCost.toFixed(2)} лв.</p>
      </div>

      <div className={styles.totalSection}>
        <h3>Общо за плащане: {finalTotal.toFixed(2)} лв.</h3>
      </div>

      <button onClick={handlePlaceOrder} className={styles.formButton}>
        Направи поръчка (Плащане при доставка)
      </button>
    </div>
  );
};

export default ReviewOrder;
