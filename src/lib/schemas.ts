// src/lib/schemas.ts - UPDATING WITH BULGARIAN RULES

import { z } from 'zod';

// ... (loginSchema and registrationSchema remain the same) ...

// Schema for the Shipping Form - NOW WITH BULGARIAN VALIDATION
export const shippingSchema = z.object({
    firstName: z.string().min(1, "Името е задължително."),
    lastName: z.string().min(1, "Фамилията е задължителна."),
    address: z.string().min(5, "Въведете пълен адрес (ж.к./ул., номер, бл., вх., ет., ап.)."),
    apartment: z.string().optional(),
    city: z.string().min(1, "Градът е задължителен."),
    
    // --- RULE UPGRADE ---
    postalCode: z.string()
      .min(1, "Пощенският код е задължителен.")
      .regex(/^\d{4}$/, "Пощенският код трябва да бъде 4 цифри."), // e.g., 1000, 4000, 9000
    
    // --- RULE UPGRADE ---
    phone: z.string()
      .min(1, "Телефонният номер е задължителен.")
      .regex(/^(?:\+359|0)8[789]\d{7}$/, "Моля, въведете валиден български мобилен номер (напр. 08... или +3598...)."),
});
