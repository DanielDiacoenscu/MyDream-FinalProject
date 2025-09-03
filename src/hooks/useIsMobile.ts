// src/hooks/useIsMobile.ts
'use client';
import { useState, useEffect } from 'react';

// This is a simple, reusable hook to detect if the user is on a mobile-sized screen.
export const useIsMobile = (breakpoint = 768): boolean => {
  // We default to false to prevent layout shifts during server-side rendering.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This function checks the window width and updates the state.
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Run the check once on component mount.
    checkScreenSize();

    // Add an event listener to re-check whenever the window is resized.
    window.addEventListener('resize', checkScreenSize);

    // Clean up the event listener when the component unmounts.
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};
