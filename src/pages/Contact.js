import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer/footer";
import '../components/Subscription/Subscription.css';

function Contact() {
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setSubscription(userDoc.data().subscription || null);
        }
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      let collectionName = "contacts_basic";
      if (
        subscription &&
        subscription.type === "premium" &&
        subscription.expiresAt > Date.now()
      ) {
        collectionName = "contacts_premium";
      }
      await addDoc(collection(db, collectionName), {
        name: form.name,
        message: form.message,
        email: auth.currentUser?.email || "",
        createdAt: serverTimestamp(),
      });
      setStatus("Your message has been sent!");
      setForm({ name: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    }
  };

  // Sprawdź dostęp
  const hasPremium =
    subscription &&
    subscription.type === "premium" &&
    subscription.expiresAt > Date.now();

  return (
    <>
      <Header />
      <div
        className="grey-wrapper"
        style={{
          maxWidth: "700px",      // szerszy box
          width: "90%",           // responsywność
          margin: "2rem auto",
          padding: "2.5rem"
        }}
      >
        <h2>Contact Us</h2>
        {checking ? (
          <p>Loading...</p>
        ) : !user ? (
          <p>You must be logged in to use the contact form.</p>
        ) : !subscription || !subscription.expiresAt || subscription.expiresAt < Date.now() ? (
          <p>This feature is available only for users with an active subscription (Basic or Premium).</p>
        ) : (
          <form onSubmit={handleSubmit} className="contact-flex">
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              className="contact-input"
            />
            <textarea
              name="message"
              placeholder="Your message"
              value={form.message}
              onChange={handleChange}
              required
              className="contact-input"
              style={{ minHeight: 100 }}
            />
            <button type="submit" className="primary-btn">Send</button>
          </form>
        )}
        {status && <p style={{ marginTop: 10 }}>{status}</p>}
      </div>
    </>
  );
}

export default Contact;