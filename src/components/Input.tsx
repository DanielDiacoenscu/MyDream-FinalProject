// src/components/Input.tsx - CORRECTED VERSION

import styles from '@/styles/Checkout.module.css';
import React from 'react'; // Import React for the Fragment

type InputProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

const Input = ({ name, label, value, onChange, type = 'text', placeholder, required = false }: InputProps) => {
  // --- FIX: Removed the wrapper div. Using a Fragment instead. ---
  return (
    <>
      <label htmlFor={name} className={styles.formLabel}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={styles.formInput}
      />
    </>
  );
};

export default Input;
