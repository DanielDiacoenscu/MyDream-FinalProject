// src/components/Input.tsx - UPGRADED
import styles from '@/styles/Checkout.module.css';

type InputProps = {
  name: string;
  label: string;
  value: string; // <-- ADDED
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // <-- ADDED
  type?: string;
  placeholder?: string;
  required?: boolean;
};

const Input = ({ name, label, value, onChange, type = 'text', placeholder, required = false }: InputProps) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.formLabel}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value} // <-- ADDED
        onChange={onChange} // <-- ADDED
        placeholder={placeholder}
        required={required}
        className={styles.formInput}
      />
    </div>
  );
};

export default Input;
