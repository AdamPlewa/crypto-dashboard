import React, { useEffect, useState } from 'react'
import TemporaryDrawer from './drawer'
import './styles.css'
import Switch from '@mui/material/Switch'
import { toast } from 'react-toastify'

import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase";


function Header() {
	const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') == 'dark' ? true : false)
  const [user, setUser] = useState(null);
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser); 

    setIsLoginPage(window.location.pathname === "/login");

    if (localStorage.getItem('theme') === 'dark') {
      setDark();
    } else {
      setLight();
    }
    return () => unsubscribe(); 
  }, []);

	const changeMode = () => {
		if (localStorage.getItem('theme') != 'dark') {
			setDark()
		} else {
			setLight()
		}
		setDarkMode(!darkMode)
		// toast.success('Theme Changed!')
	}

	const setDark = () => {
		localStorage.setItem('theme', 'dark')
		document.documentElement.setAttribute('data-theme', 'dark')
	}

	const setLight = () => {
		localStorage.setItem('theme', 'light')
		document.documentElement.setAttribute('data-theme', 'light')
	}

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Błąd przy wylogowywaniu: ", error.message);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1>CoinHub</h1>
        <div className="links">
          <Link to="/">
            <p className="link">Home</p>
          </Link>
          <Link to="/compare">
            <p className="link">Compare</p>
          </Link>
          <Link to="/watchlist">
            <p className="link">Watchlist</p>
          </Link>
          <Link to="/subscription">
            <p className="link">Subscription</p>
          </Link>
        </div>
      </div>
      <div className="header-right">
        <Switch checked={darkMode} onClick={changeMode} />

        {/* Show Login button only if user is not logged in and not on the login page */}
        {!user && !isLoginPage && (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
        {user && (
          <Link to="/profile">
            <button className="login-button">Profile</button>
          </Link>
        )}

        <div className="drawer-component">
          <TemporaryDrawer />
        </div>
      </div>
    </div>
  );
}

export default Header;
