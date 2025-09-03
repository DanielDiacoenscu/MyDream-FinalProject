// src/context/UIContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a cart item
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Define the shape of the context
interface UIContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
  cartItems: CartItem[];
  // Add functions to modify cart later if needed
}

// Create the context with a default value
const UIContext = createContext<UIContextType | undefined>(undefined);

// Create the provider component
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- MOCK DATA FOR TESTING ---
  // In a real app, this would be managed with functions like addItem, removeItem
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  // Example of a populated cart for testing:
  // const [cartItems, setCartItems] = useState<CartItem[]>([
  //   { id: '1', name: 'Satin Kajal Liner', price: 28.00, quantity: 1, imageUrl: 'https://placehold.co/100x100' }
  // ]);


  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    isCartOpen,
    toggleCart,
    cartItems,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
