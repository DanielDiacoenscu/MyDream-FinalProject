// src/app/checkout/page.tsx - DIAGNOSTIC VERSION
'use client';

import { CheckoutProvider, useCheckout } from '@/context/CheckoutContext';
import CheckoutSummary from '@/components/CheckoutSummary';
import ShippingForm from '@/components/ShippingForm';
import ReviewOrder from '@/components/ReviewOrder';
import styles from '@/styles/Checkout.module.css';

const CheckoutView = () => {
  const { step } = useCheckout();
  console.log('[CheckoutView] Rendering. Current step is:', step);

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutMain}>
        {step === 'shipping' && (
          <>
            <h1 className={styles.checkoutTitle}>Форма за доставка</h1>
            <ShippingForm />
          </>
        )}
        {step === 'payment' && (
          <>
            <h1 className={styles.checkoutTitle}>Прегледайте вашата поръчка</h1>
            <ReviewOrder />
          </>
        )}
      </div>
      <div className={styles.checkoutSidebar}>
        <CheckoutSummary />
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutView />
    </CheckoutProvider>
  );
}
