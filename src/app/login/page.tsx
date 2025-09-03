// src/app/login/page.tsx - DEFINITIVE FIX
'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // <-- Make sure z is imported
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/AuthForm.module.css';

// --- SCHEMA DEFINED DIRECTLY IN THE FILE ---
const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Полето е задължително." }),
  password: z.string().min(1, { message: "Полето е задължително." }),
});
// --- END SCHEMA DEFINITION ---

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema), // Now it can't be undefined
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.error) throw new Error(responseData.error.message || 'Invalid credentials.');
      login(responseData.jwt, responseData.user);
    } catch (err: any) {
      setError('root', { type: 'manual', message: err.message });
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authFormWrapper}>
        <h1 className={styles.title}>Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {errors.root && <p className={styles.error}>{errors.root.message}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="identifier" className={styles.label}>Имейл или потребителско име</label>
            <input id="identifier" type="text" {...register('identifier')} className={`${styles.input} ${errors.identifier ? styles.inputError : ''}`} />
            {errors.identifier && <p className={styles.fieldError}>{errors.identifier.message}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Парола</label>
            <input id="password" type="password" {...register('password')} className={`${styles.input} ${errors.password ? styles.inputError : ''}`} />
            {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
          </div>
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Влизане...' : 'Влез'}
          </button>
        </form>
        <p className={styles.redirect}>
          Нямаш ли акаунт? <Link href="/register">Създайте</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
