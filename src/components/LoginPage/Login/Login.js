// src/Login.js
import React, { useState } from 'react'
import { auth } from '../../../firebase'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

import { useNavigate, Link } from 'react-router-dom'
import Header from '../../Common/Header/index' // Importuj Header
import './Login.css' // Importuj style CSS
import { FcGoogle } from 'react-icons/fc'

// src/utils/firebaseErrors.js

export const getErrorMessage = (errorCode) => {
	switch (errorCode) {
		case 'auth/invalid-email':
			return 'Invalid email address.'
		case 'auth/missing-password':
			return 'Password is required.'
		case 'auth/email-already-in-use':
			return 'This email address is already in use.'
		case 'auth/weak-password':
			return 'Password is too weak. It should be at least 6 characters.'
		case 'auth/user-disabled':
			return 'This account has been disabled.'
		case 'auth/user-not-found':
			return 'No user found with this email address.'
		case 'auth/wrong-password':
			return 'Incorrect password.'
		case 'auth/invalid-credential':
			return 'Invalid login credentials.'
		case 'auth/popup-closed-by-user':
			return 'Login window was closed before completing the sign-in.'
		case 'auth/network-request-failed':
			return 'Network error. Please check your internet connection.'
		default:
			return 'An unknown error occurred. Please try again.'
	}
}

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleLogin = async e => {
		e.preventDefault()
		try {
			await signInWithEmailAndPassword(auth, email, password)
			navigate('/profile')
		} catch (error) {
			setError('❌ ' + getErrorMessage(error.code))
		}
	}

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider()
		try {
			await signInWithPopup(auth, provider)
			navigate('/profile')
		} catch (error) {
			setError('❌ ' + getErrorMessage(error.code))
		}
	}

	return (
		<div>
			<Header />
			<div className="auth-container">
				<div className="auth-box">
					<h2>Welcome to CoinHub</h2>
					<form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<button type="submit">Login</button>
					</form>

					<button onClick={handleGoogleLogin} className="google-btn">
						<FcGoogle className="google-btn-icon" size={22} style={{ marginRight: '8px' }} />
						Continue with Google
					</button>

					{error && <p className="error-message">{error}</p>}

					<p>
						Don't have an account? <Link to="/Register">Sign up</Link>					
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login
