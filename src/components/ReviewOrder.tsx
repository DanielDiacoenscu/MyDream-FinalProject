// src/components/ReviewOrder.tsx - DEFINITIVE VERSION
'use client';

import { useRouter } from 'next/navigation'; // <-- IMPORT ADDED
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/Checkout.module.css';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

const ReviewOrder = () => {
  const router = useRouter(); // <-- HOOK ADDED
  const { shippingAddress } = useCheckout();
  const { cartItems, cartTotal, clearCart } = useCart(); // <-- clearCart ADDED

  const handlePlaceOrder = async () => {
    const orderData = {
      shippingAddress,
      cartItems,
      total: cartTotal,
      orderStatus: 'Pending', // Use the corrected field name
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: orderData }), // Strapi expects the data to be wrapped
      });

      if (!response.ok) {
        throw new Error('Failed to submit order.');
      }

      alert('Order has been placed successfully!');
      clearCart();
      router.push('/order-confirmation'); // Redirect to a thank you page

    } catch (error) {
      console.error('Failed to place order:', error);
      alert('There was an error placing your order.');
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
      <button onClick={handlePlaceOrder} className={styles.formButton}>
        Направи поръчка (Плащане при доставка)
      </button>
    </div>
  );
};

export default ReviewOrder;
