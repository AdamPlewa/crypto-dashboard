import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer/footer';
import PlanList from '../components/Subscription/PlanList';
import PaymentForm from '../components/Subscription/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import '../components/Subscription/Subscription.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    duration: 7,
    features: [
      'Basic features',
      'Email support'
    ],
    description: 'Access to basic features for 7 days.'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25,
    duration: 7,
    features: [
      'Everything in Basic',
      'Priority support',
      'Access to Compare feature'
    ],
    description: 'Full access to all features, including Compare, for 7 days.'
  },
];

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleBuy = (plan) => setSelectedPlan(plan);
  const handlePaymentSuccess = () => {
    alert('Payment completed successfully!');
    setSelectedPlan(null);
  };
  const handleCancel = () => setSelectedPlan(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success')) {
      alert('Payment completed successfully!');
      const planId = params.get('plan');
      // Znajdź wybrany plan po id
      const selected = plans.find(p => p.id === planId);
      // Jeśli plan znaleziony, ustaw expiresAt zgodnie z duration
      if (selected && auth.currentUser) {
        const expiresAt = Date.now() + selected.duration * 24 * 60 * 60 * 1000; // duration w dniach
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          subscription: {
            type: planId,
            expiresAt
          }
        });
      }
    }
    if (params.get('canceled')) {
      navigate('/payment-failed');
    }
  }, [location, navigate]);

  return (
    <>
      <Header />
      <div className="grey-wrapper">
        <h1>Subscription & Payments</h1>
        {!user ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>You must be logged in to view and purchase a subscription.</p>
          </div>
        ) : (
          <>
            <p>Select your subscription plan:</p>
            {!selectedPlan ? (
              <PlanList plans={plans} onBuy={handleBuy} />
            ) : (
              <Elements stripe={stripePromise}>
                <PaymentForm plan={selectedPlan} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />
              </Elements>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Subscription;