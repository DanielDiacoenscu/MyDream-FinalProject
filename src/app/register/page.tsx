// src/app/register/page.tsx - DEFINITIVE FIX
'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // <-- Make sure z is imported
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/AuthForm.module.css';

// --- SCHEMA DEFINED DIRECTLY IN THE FILE ---
const registrationSchema = z.object({
  username: z.string().min(3, { message: "Потребителското име трябва да е поне 3 символа." }),
  email: z.string().min(1, { message: "Имейлът е задължителен." }).email({ message: "Моля, въведете валиден имейл." }),
  password: z.string().min(8, { message: "Паролата трябва да е поне 8 символа." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролите не съвпадат.",
  path: ["confirmPassword"],
});
// --- END SCHEMA DEFINITION ---

type RegisterFormInputs = z.infer<typeof registrationSchema>;

const RegisterPage = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registrationSchema), // Now it can't be undefined
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username, email: data.email, password: data.password }),
      });
      const responseData = await response.json();
      if (responseData.error) throw new Error(responseData.error.message || 'Registration failed.');
      login(responseData.jwt, responseData.user);
    } catch (err: any) {
      setError('root', { type: 'manual', message: err.message });
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authFormWrapper}>
        <h1 className={styles.title}>Създайте своя профил</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {errors.root && <p className={styles.error}>{errors.root.message}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Потребителско име</label>
            <input id="username" type="text" {...register('username')} className={`${styles.input} ${errors.username ? styles.inputError : ''}`} />
            {errors.username && <p className={styles.fieldError}>{errors.username.message}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Имейл</label>
            <input id="email" type="email" {...register('email')} className={`${styles.input} ${errors.email ? styles.inputError : ''}`} />
            {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Парола</label>
            <input id="password" type="password" {...register('password')} className={`${styles.input} ${errors.password ? styles.inputError : ''}`} />
            {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Потвърди парола</label>
            <input id="confirmPassword" type="password" {...register('confirmPassword')} className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`} />
            {errors.confirmPassword && <p className={styles.fieldError}>{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Регистриране...' : 'Регистрирай се'}
          </button>
        </form>
        <p className={styles.redirect}>
          Вече имаш акаунт? <Link href="/login">Влез в своя акаунт</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
