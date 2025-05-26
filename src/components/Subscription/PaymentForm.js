import React from 'react';
import axios from 'axios';

function PaymentForm({ plan, onCancel }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4242/create-checkout-session', { planId: plan.id });
      window.location.href = res.data.url;
    } catch (err) {
      alert('Błąd podczas przekierowania do płatności.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Płatność za: {plan.name}</h3>
      <div style={{ marginTop: '1rem' }}>
        <button className="primary-btn" type="submit">
          Zapłać {plan.price} zł
        </button>
        <button type="button" onClick={onCancel} className="primary-btn" style={{ marginLeft: '1rem' }}>
          Anuluj
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;