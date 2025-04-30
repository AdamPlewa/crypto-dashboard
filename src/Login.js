// src/Login.js
import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Header from '../src/components/Common/Header/index';  // Importuj Header

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile');  // Po zalogowaniu przenosi na stronę profilu
    } catch (error) {
      alert('❌ Błąd logowania: ' + error.message);
    }
  };

  return (
    <div>
      <Header />  {/* Dodaj Header tutaj */}
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
};

export default Login;
