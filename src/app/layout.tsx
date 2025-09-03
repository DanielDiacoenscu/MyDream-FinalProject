// src/app/layout.tsx - UPDATED WITH WISHLIST PROVIDER
import type { Metadata } from "next";
import { Tenor_Sans, Montserrat } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { UIProvider } from '../context/UIContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { WishlistProvider } from '../context/WishlistContext'; // <-- 1. THE NECESSARY IMPORT
import PageWrapper from '../components/PageWrapper';
import Cart from '../components/Cart';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-secondary",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-primary",
});

export const metadata: Metadata = {
  title: "My Dream Beauty",
  description: "My Dream Beauty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tenorSans.variable} ${montserrat.variable}`}>
        <AuthProvider>
          <UIProvider>
            <CartProvider>
              {/* --- 2. THE NECESSARY WRAPPER --- */}
              <WishlistProvider>
                <Cart />
                <PageWrapper>
                  {children}
                </PageWrapper>
              </WishlistProvider>
            </CartProvider>
          </UIProvider>
        </AuthProvider>

        <Script 
          src="https://code.jquery.com/jquery-3.6.0.min.js" 
          strategy="afterInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
