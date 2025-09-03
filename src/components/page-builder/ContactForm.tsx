// src/components/page-builder/ContactForm.tsx
'use client'; // This component is interactive

import styles from '@/styles/page-builder/ContactForm.module.css';

interface ContactFormProps {
  data: {
    title: string;
    subtitle: string;
  };
}

const ContactForm = ({ data }: ContactFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submission is not yet implemented.');
  };

  return (
    <div className={styles.contactFormSection}>
      <h2 className={styles.title}>{data.title}</h2>
      <p className={styles.subtitle}>{data.subtitle}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
        </div>
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;
