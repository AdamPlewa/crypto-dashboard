import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer/footer';
import PlanList from '../components/Subscription/PlanList';
import PaymentForm from '../components/Subscription/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // dostosuj ścieżkę jeśli inna
import '../components/Subscription/Subscription.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    duration: 7,
    features: ['Podstawowe funkcje', 'Wsparcie e-mail'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25,
    duration: 7,
    features: ['Wszystko z Basic', 'Zaawansowane analizy', 'Priorytetowe wsparcie'],
  },
];

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBuy = (plan) => setSelectedPlan(plan);
  const handlePaymentSuccess = () => {
    alert('Płatność zakończona sukcesem!');
    setSelectedPlan(null);
  };
  const handleCancel = () => setSelectedPlan(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      alert('Płatność zakończona sukcesem!');
      const plan = params.get('plan');
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          subscription: {
            type: plan,
            expiresAt
          }
        });
      }
    }
    if (params.get('canceled')) {
      // alert('Płatność została anulowana.');
      navigate('/payment-failed');
    }
  }, [location, navigate]);

  return (
    <>
      <Header />
      <div className="grey-wrapper">
        <h1>Subscription & Payments</h1>
        <p>Wybierz plan subskrypcji:</p>
        {!selectedPlan ? (
          <PlanList plans={plans} onBuy={handleBuy} />
        ) : (
          <Elements stripe={stripePromise}>
            <PaymentForm plan={selectedPlan} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />
          </Elements>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Subscription;