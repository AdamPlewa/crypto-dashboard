// src/Profile.js
import React from 'react'
import { auth } from '../../../firebase'
import Header from '../../Common/Header/index'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
	const user = auth.currentUser
	const navigate = useNavigate()

	const handleLogout = () => {
		auth
			.signOut()
			.then(() => {
				navigate('/')
			})
			.catch(error => {
				console.error('Błąd wylogowywania:', error)
			})
	}

	return (
		<div>
			<Header /> {/* Dodaj Header tutaj */}
			<h2>Profil użytkownika</h2>
			{user ? (
				<>
					<p>Email: {user.email}</p>
					<button onClick={handleLogout}>Wyloguj</button>
				</>
			) : (
				<p>Nie jesteś zalogowany</p>
			)}
		</div>
	)
}

export default Profile
