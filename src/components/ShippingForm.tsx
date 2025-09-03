// src/components/ShippingForm.tsx - DEFINITIVE FIX
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // <-- Make sure z is imported
import Input from './Input';
import { useCheckout, SHIPPING_OPTIONS } from '@/context/CheckoutContext';
import styles from '@/styles/Checkout.module.css';

// --- SCHEMA DEFINED DIRECTLY IN THE FILE ---
const shippingSchema = z.object({
    firstName: z.string().min(1, "Името е задължително."),
    lastName: z.string().min(1, "Фамилията е задължителна."),
    address: z.string().min(5, "Въведете пълен адрес."),
    apartment: z.string().optional(),
    city: z.string().min(1, "Градът е задължителен."),
    postalCode: z.string()
      .min(1, "Пощенският код е задължителен.")
      .regex(/^\d{4}$/, "Кодът трябва да бъде 4 цифри."),
    phone: z.string()
      .min(1, "Телефонът е задължителен.")
      .regex(/^(?:\+359|0)8[789]\d{7}$/, "Въведете валиден български мобилен номер."),
});
// --- END SCHEMA DEFINITION ---

type ShippingFormInputs = z.infer<typeof shippingSchema>;

const ShippingForm = () => {
  const { shippingAddress, handleShippingChange, goToNextStep, shippingMethod, handleShippingMethodChange } = useCheckout();
  
  const { control, handleSubmit, formState: { errors } } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingSchema), // Now it can't be undefined
    defaultValues: shippingAddress,
  });

  const onValidSubmit = (data: ShippingFormInputs) => {
    goToNextStep();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onValidSubmit)}>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <Controller name="firstName" control={control} render={({ field }) => (<Input {...field} label="Име" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} required />)} />
          {errors.firstName && <p className={styles.fieldError}>{errors.firstName.message}</p>}
        </div>
        <div className={styles.inputGroup}>
          <Controller name="lastName" control={control} render={({ field }) => (<Input {...field} label="Фамилия" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} required />)} />
          {errors.lastName && <p className={styles.fieldError}>{errors.lastName.message}</p>}
        </div>
      </div>
      <div className={styles.inputGroup}>
        <Controller name="address" control={control} render={({ field }) => (<Input {...field} label="Адрес" placeholder="Моля въведете адреса на който искате поръчката да бъде доставена" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} required />)} />
        {errors.address && <p className={styles.fieldError}>{errors.address.message}</p>}
      </div>
      <div className={styles.inputGroup}>
        <Controller name="apartment" control={control} render={({ field }) => (<Input {...field} label="Апартамент, suite, etc." placeholder="Optional" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} />)} />
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <Controller name="city" control={control} render={({ field }) => (<Input {...field} label="Град" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} required />)} />
          {errors.city && <p className={styles.fieldError}>{errors.city.message}</p>}
        </div>
        <div className={styles.inputGroup}>
          <Controller name="postalCode" control={control} render={({ field }) => (<Input {...field} label="Пощенски код" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} required />)} />
          {errors.postalCode && <p className={styles.fieldError}>{errors.postalCode.message}</p>}
        </div>
      </div>
      <div className={styles.inputGroup}>
        <Controller name="phone" control={control} render={({ field }) => (<Input {...field} label="Телефонен номер" placeholder="Новини отсносно доставки" onChange={(e) => { field.onChange(e); handleShippingChange(e); }} />)} />
        {errors.phone && <p className={styles.fieldError}>{errors.phone.message}</p>}
      </div>
      <div className={styles.shippingMethodSection}>
        <h3 className={styles.shippingMethodTitle}>Метод на доставка</h3>
        <div className={styles.shippingOptions}>
          {SHIPPING_OPTIONS.map(option => (
            <label key={option.id} className={styles.shippingOption}>
              <input type="radio" name="shippingMethod" value={option.id} checked={shippingMethod === option.id} onChange={() => handleShippingMethodChange(option.id)} />
              <span className={styles.shippingOptionLabel}>{option.name}</span>
              <span className={styles.shippingOptionPrice}>{option.description}</span>
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className={styles.formButton}>
        Продължете към Плащане
      </button>
    </form>
  );
};

export default ShippingForm;
