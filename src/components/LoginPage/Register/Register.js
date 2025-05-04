import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../../firebase'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../../Common/Header/index'
import { FcGoogle } from 'react-icons/fc'
import '../Login/Login.css' // Importuj style CSS

const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleRegister = async e => {
		e.preventDefault()
		if (password !== confirm) {
			setError('❌ Hasła się nie zgadzają')
			return
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password)
			navigate('/profile')
		} catch (error) {
			setError('❌ Błąd rejestracji: ' + error.message)
		}
	}

	const handleGoogleRegister = async () => {
		const provider = new GoogleAuthProvider()
		try {
			await signInWithPopup(auth, provider)
			navigate('/profile')
		} catch (error) {
			setError('❌ Błąd rejestracji przez Google: ' + error.message)
		}
	}

	return (
		<div>
			<Header />
			<div className='auth-container'>
				<div className="auth-box">
					<h2>Rejestracja</h2>
					<form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
						<input
							type='password'
							placeholder='Hasło'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<input
							type='password'
							placeholder='Potwierdź hasło'
							value={confirm}
							onChange={e => setConfirm(e.target.value)}
							required
						/>
						<button type='submit'>Zarejestruj się</button>
					</form>

					<button onClick={handleGoogleRegister} className="google-btn">
						<FcGoogle className="google-btn-icon" size={22} style={{ marginRight: '8px' }} />
						Zarejestruj się przez Google
					</button>

					<p>
						Masz już konto? <Link to='/login'>Zaloguj się</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Register
