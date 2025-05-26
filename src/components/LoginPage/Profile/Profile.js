import React, { useState } from 'react'
import { auth } from '../../../firebase'
import Header from '../../Common/Header'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import './Profile.css'

const Profile = () => {
	const user = auth.currentUser
	const navigate = useNavigate()

	const [displayName, setDisplayName] = useState(user?.displayName || '')
	const [isEditing, setIsEditing] = useState(false)
	const [message, setMessage] = useState('')

	const handleLogout = () => {
		auth
			.signOut()
			.then(() => {
				navigate('/')
			})
			.catch(error => {
				console.error('Logout error:', error)
			})
	}

	const handleSave = async () => {
		try {
			await updateProfile(user, { displayName })
			setMessage('Username updated successfully!')
			setIsEditing(false)
		} catch (error) {
			console.error('Error updating name:', error)
			setMessage('Something went wrong while updating your name.')
		}
	}

	return (
		<div>
			<Header />
			<div className="profile-container">
				<div className="profile-card">
					<h2>User Profile</h2>
					{user ? (
						<>
							<p><strong>Email:</strong> {user.email}</p>

							<div className="editable-field">
								{isEditing ? (
									<div className="edit-row">
										<strong>Username: </strong>
										<input
											type="text"
											value={displayName}
											onChange={e => setDisplayName(e.target.value)}
										/>
										<button onClick={handleSave}>Save</button>
									</div>
								) : (
									<div className="edit-row">
										<strong>Username:</strong>
										<span>{displayName || 'Not set'}</span>
										<button onClick={() => setIsEditing(true)}>Edit</button>
									</div>
								)}
							</div>

							<p><strong>Account Type:</strong> <span className="account-type free">Free</span></p>

							<button onClick={handleLogout}>Log out</button>

							{message && <p className="message">{message}</p>}
						</>
					) : (
						<p>You are not logged in.</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Profile
