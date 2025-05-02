import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../src/components/Common/Header/index'

const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const navigate = useNavigate()

	const handleRegister = async e => {
		e.preventDefault()
		if (password !== confirm) {
			alert('❌ Hasła się nie zgadzają')
			return
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password)
			navigate('/profile')
		} catch (error) {
			alert('❌ Błąd rejestracji: ' + error.message)
		}
	}

	const handleGoogleRegister = async () => {
		const provider = new GoogleAuthProvider()
		try {
			await signInWithPopup(auth, provider)
			navigate('/profile')
		} catch (error) {
			alert('❌ Błąd rejestracji przez Google: ' + error.message)
		}
	}

	return (
		<>
			<Header />
			<div className='register-page'>
				<h2>Rejestracja</h2>
				<form onSubmit={handleRegister}>
					<input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
					<br />
					<input
						type='password'
						placeholder='Hasło'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					<br />
					<input
						type='password'
						placeholder='Potwierdź hasło'
						value={confirm}
						onChange={e => setConfirm(e.target.value)}
						required
					/>
					<br />
					<button type='submit'>Zarejestruj się</button>
				</form>

				<button onClick={handleGoogleRegister} style={{ marginTop: '10px' }}>
					Zarejestruj się przez Google
				</button>

				<p>
					Masz już konto? <Link to='/login'>Zaloguj się</Link>
				</p>
			</div>
		</>
	)
}

export default Register
