// src/components/PageWrapper.tsx
'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Cart />
    </div>
  );
};

export default PageWrapper;
