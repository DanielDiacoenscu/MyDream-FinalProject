'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure for a shipping option
interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Define the available shipping options
export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'address', name: 'Доставка до адрес (Speedy)', price: 4.50, description: '+4.50 €.' },
  { id: 'office', name: 'Доставка до офис на Speedy', price: 3.50, description: '+3.50 €.' },
  { id: 'automate', name: 'Доставка до автомат', price: 3.00, description: '+3.00 €.' },
];

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface CheckoutContextType {
  step: 'shipping' | 'payment';
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  
  // --- PROMO CODE STATE ---
  promoCode: string | null;
  discountAmount: number;
  applyPromoCode: (code: string, cartTotal: number) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;

  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShippingMethodChange: (methodId: string) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '', lastName: '', address: '', apartment: '', city: '', postalCode: '', phone: ''
  });
  
  const [shippingMethod, setShippingMethod] = useState<string>(SHIPPING_OPTIONS[0].id);
  const [shippingCost, setShippingCost] = useState<number>(SHIPPING_OPTIONS[0].price);

  // --- PROMO CODE LOGIC ---
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const applyPromoCode = async (code: string, cartTotal: number): Promise<{ success: boolean; message: string }> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      const response = await fetch(`${apiUrl}/api/promo-codes?filters[code][$eq]=${code}&filters[isActive][$eq]=true`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const promo = data.data[0];
        const attributes = promo.attributes || promo; 

        let calculatedDiscount = 0;
        if (attributes.discountType === 'percentage') {
          calculatedDiscount = (cartTotal * attributes.discountValue) / 100;
        } else {
          calculatedDiscount = attributes.discountValue;
        }

        if (calculatedDiscount > cartTotal) calculatedDiscount = cartTotal;

        setPromoCode(code);
        setDiscountAmount(calculatedDiscount);
        return { success: true, message: 'Promo code applied!' };
      } else {
        return { success: false, message: 'Invalid or expired promo code.' };
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      return { success: false, message: 'Error checking promo code.' };
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscountAmount(0);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingMethodChange = (methodId: string) => {
    const selectedOption = SHIPPING_OPTIONS.find(option => option.id === methodId);
    if (selectedOption) {
      setShippingMethod(selectedOption.id);
      setShippingCost(selectedOption.price);
    }
  };

  const goToNextStep = () => setStep('payment');
  const goToPrevStep = () => setStep('shipping');

  return (
    <CheckoutContext.Provider value={{ 
      step, shippingAddress, shippingMethod, shippingCost,
      promoCode, discountAmount, applyPromoCode, removePromoCode,
      handleShippingChange, handleShippingMethodChange, 
      goToNextStep, goToPrevStep 
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
