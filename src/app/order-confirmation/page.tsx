// src/app/order-confirmation/page.tsx
import Link from 'next/link';

export default function OrderConfirmationPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontFamily: '"Tenor Sans", serif', fontSize: '36px', marginBottom: '24px' }}>
	Благодарим Ви за поръчката!
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '32px' }}>
	Поръчката Ви беше получена и в момента се обработва.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        padding: '16px 32px',
        backgroundColor: '#111',
        color: '#fff',
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Продължи с пазаруването
      </Link>
    </div>
  );
}
