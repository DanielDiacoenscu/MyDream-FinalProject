import React from 'react';

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Контакти</h1>
      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
        <p style={{ marginBottom: '10px' }}><strong>Email:</strong> contact@mydreambeauty.net</p>
        <p style={{ marginBottom: '10px' }}><strong>Телефон:</strong> +359 88 888 8888</p>
        <p>Свържете се с нас за всякакви въпроси!</p>
      </div>
    </div>
  );
}
