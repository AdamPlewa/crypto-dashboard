// src/Login.js
import React, { useState } from 'react'
import { auth } from '../../../firebase'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

import { useNavigate, Link } from 'react-router-dom'
import Header from '../../Common/Header/index' // Importuj Header
import './Login.css' // Importuj style CSS
import { FcGoogle } from 'react-icons/fc'


const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleLogin = async e => {
		e.preventDefault()
		try {
			await signInWithEmailAndPassword(auth, email, password)
			navigate('/profile') // Po zalogowaniu przenosi na stronę profilu
		} catch (error) {
			setError('❌ Błąd logowania: ' + error.message)
		}
	}

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider()
		try {
			await signInWithPopup(auth, provider)
			navigate('/profile')
		} catch (error) {
			setError('❌ Błąd logowania: ' + error.message)
		}
	}

	return (
		<div>
			<Header />
			<div className="auth-container">
				<div className="auth-box">
					<h2>Logowanie</h2>
					<form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Hasło"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<button type="submit">Zaloguj się</button>
					</form>

					<button onClick={handleGoogleLogin} className="google-btn">
						<FcGoogle className="google-btn-icon" size={22} style={{ marginRight: '8px' }} />
						Zaloguj przez Google
					</button>

					{error && <p className="error-message">{error}</p>}

					<p>
						Nie masz konta? <Link to="/Register">Zarejestruj się</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login
