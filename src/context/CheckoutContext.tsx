// src/context/CheckoutContext.tsx - UPGRADED VERSION
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
  { id: 'address', name: 'Доставка до адрес (Speedy)', price: 7.90, description: '+7.90 лв.' },
  { id: 'office', name: 'Доставка до офис на Speedy', price: 6.90, description: '+6.90 лв.' },
  { id: 'automate', name: 'Доставка до автомат', price: 5.90, description: '+5.90 лв.' },
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
  shippingMethod: string; // <-- NEW: ID of the selected method
  shippingCost: number;   // <-- NEW: Cost of the selected method
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShippingMethodChange: (methodId: string) => void; // <-- NEW: Function to change method
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '', lastName: '', address: '', apartment: '', city: '', postalCode: '', phone: ''
  });
  
  // --- NEW STATE FOR SHIPPING ---
  const [shippingMethod, setShippingMethod] = useState<string>(SHIPPING_OPTIONS[0].id); // Default to first option
  const [shippingCost, setShippingCost] = useState<number>(SHIPPING_OPTIONS[0].price); // Default to first option's price

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  // --- NEW FUNCTION TO HANDLE SHIPPING METHOD CHANGES ---
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
