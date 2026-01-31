// src/components/ReviewOrder.tsx - FIXED DATA MAPPING WITH DUAL CURRENCY
'use client';

import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/api';
import styles from '@/styles/Checkout.module.css';

const ReviewOrder = () => {
  const router = useRouter();
  const { shippingAddress, shippingMethod, shippingCost } = useCheckout();
  // ADDED: cartTotalBGN, formatDualPrice
  const { cartItems, cartTotal, cartTotalBGN, clearCart, formatDualPrice } = useCart();

  const finalTotal = cartTotal + shippingCost;
  // ADDED: Calculate BGN Total
  const finalTotalBGN = cartTotalBGN + (shippingCost * 1.95583);

  const handlePlaceOrder = async () => {
    // --- DATA MAPPING START ---
    // We transform the frontend data to match your Strapi Database Fields EXACTLY.
    
    const orderId = `ORD-${Date.now()}`; // Generate a unique ID

    const strapiData = {
      orderId: orderId,
      products: cartItems,            // Map 'cartItems' -> 'products' (JSON)
      total: finalTotal,              // Matches 'total' (Number)
      statusOfShipment: 'pending',    // Map 'orderStatus' -> 'statusOfShipment' (Enum)
      
      // Flatten the shipping address
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      phone: shippingAddress.phone,
      
      // Combine address info because Strapi is missing 'apartment' and 'shippingMethod' fields
      address: `${shippingAddress.address} ${shippingAddress.apartment ? '(Apt: ' + shippingAddress.apartment + ')' : ''} [Method: ${shippingMethod}]`,
      
      // Combine City and Zip because Strapi is missing 'postalCode'
      city: `${shippingAddress.city}, ${shippingAddress.postalCode}`,
      
      // Placeholder for email since the form doesn't ask for it yet
      email: 'guest@checkout.com' 
    };
    // --- DATA MAPPING END ---

    try {
      console.log('Sending Order to Strapi:', strapiData);
      await createOrder(strapiData);

      clearCart();
      router.push('/order-confirmation'); 

    } catch (error) {
      console.error('Failed to place order:', error);
      alert('There was an error placing your order. Please check the console for details.');
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
        {/* CHANGED: Use formatDualPrice */}
        <p>Цена: {formatDualPrice(shippingCost, shippingCost * 1.95583)}</p>
      </div>

      <div className={styles.totalSection}>
        {/* CHANGED: Use formatDualPrice */}
        <h3>Общо за плащане: {formatDualPrice(finalTotal, finalTotalBGN)}</h3>
      </div>

      <button onClick={handlePlaceOrder} className={styles.formButton}>
        Направи поръчка (Плащане при доставка)
      </button>
    </div>
  );
};

export default ReviewOrder;
