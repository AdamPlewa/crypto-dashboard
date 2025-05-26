import React from 'react';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer/footer';

function PaymentFailed() {
  return (
    <>
      <Header />
      <div className="grey-wrapper" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1>Płatność nieudana</h1>
        <p>Twoja płatność nie została zrealizowana.<br />Spróbuj ponownie lub skontaktuj się z obsługą.</p>
      </div>
      <Footer />
    </>
  );
}

export default PaymentFailed;