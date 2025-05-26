import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../../firebase'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../../Common/Header/index'
import { FcGoogle } from 'react-icons/fc'
import '../Login/Login.css' // Shared styles

const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleRegister = async e => {
		e.preventDefault()
		setError('') // clear previous errors

		if (password !== confirm) {
			setError("❌ Passwords do not match")
			return
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password)
			navigate('/profile')
		} catch (error) {
			switch (error.code) {
				case 'auth/email-already-in-use':
					setError('❌ This email is already in use.')
					break
				case 'auth/invalid-email':
					setError('❌ Invalid email address.')
					break
				case 'auth/weak-password':
					setError('❌ Password should be at least 6 characters.')
					break
				case 'auth/missing-password':
					setError('❌ Please enter a password.')
					break
				default:
					setError('❌ Registration error: ' + error.message)
			}
		}
	}

	const handleGoogleRegister = async () => {
		const provider = new GoogleAuthProvider()
		try {
			await signInWithPopup(auth, provider)
			navigate('/profile')
		} catch (error) {
			setError('❌ Google registration failed: ' + error.message)
		}
	}

	return (
		<div>
			<Header />
			<div className='auth-container'>
				<div className="auth-box">
					<h2>Sign Up</h2>
					<form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<input
							type='email'
							placeholder='Email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
						<input
							type='password'
							placeholder='Password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<input
							type='password'
							placeholder='Confirm password'
							value={confirm}
							onChange={e => setConfirm(e.target.value)}
							required
						/>
						<button type='submit'>Sign up</button>
					</form>

					<button onClick={handleGoogleRegister} className="google-btn">
						<FcGoogle className="google-btn-icon" size={22} style={{ marginRight: '8px' }} />
						Sign up with Google
					</button>

					{error && <p className="error-message">{error}</p>}

					<p>
						Already have an account? <Link to='/login'>Log in</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Register
