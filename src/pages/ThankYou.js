import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer/footer';

function ThankYou() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged user:', user);
      if (plan && user) {
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        setDoc(
          doc(db, "users", user.uid),
          {
            subscription: {
              type: plan,
              expiresAt
            }
          },
          { merge: true }
        ).then(() => {
          console.log('Subskrypcja zapisana!');
        }).catch((err) => {
          console.error('Błąd zapisu:', err);
        });
      } else {
        console.log('Brak użytkownika lub planu:', plan, user);
      }
    });

    return () => unsubscribe();
  }, [location]);

  return (
    <>
      <Header />
      <div className="grey-wrapper" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1>Dziękujemy za zakup!</h1>
        <p>Twoja subskrypcja została aktywowana.<br />Możesz już korzystać z konta premium.</p>
      </div>
      <Footer />
    </>
  );
}

export default ThankYou;