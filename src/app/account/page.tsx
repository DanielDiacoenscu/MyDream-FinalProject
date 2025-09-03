// src/app/account/page.tsx - DEFINITIVE IMPLEMENTATION
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/AccountPage.module.css';

const AccountPage = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect handles the route protection
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // While loading the user session, show a placeholder
  if (isLoading) {
    return <div className={styles.loading}>Loading Account...</div>;
  }

  // If the user is not logged in (after loading), this component will redirect,
  // but we can return null to prevent a flash of content.
  if (!user) {
    return null;
  }

  // If the user is logged in, display their account information
  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountWrapper}>
        <h1 className={styles.title}>Моят профил</h1>
        <div className={styles.userInfo}>
          <p><strong>Потребителско име:</strong> {user.username}</p>
          <p><strong>Имейл:</strong> {user.email}</p>
          <p><strong>Член от:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Излез
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
