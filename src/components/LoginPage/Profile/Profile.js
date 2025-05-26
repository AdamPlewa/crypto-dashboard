import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import Header from '../../Common/Header';
import { useNavigate } from 'react-router-dom';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [subscription, setSubscription] = useState(null);
    const navigate = useNavigate();

    // Śledzenie zalogowanego użytkownika
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    // Pobieranie username i subskrypcji z Firestore
    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setDisplayName(data.username || user.displayName || '');
                    setSubscription(data.subscription || null);
                } else {
                    setDisplayName(user.displayName || '');
                }
            };
            fetchData();
        }
    }, [user]);

    const handleLogout = () => {
        auth
            .signOut()
            .then(() => {
                navigate('/');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    const handleSave = async () => {
        try {
            await updateProfile(user, { displayName });
            await setDoc(
                doc(db, "users", user.uid),
                { username: displayName },
                { merge: true }
            );
            setMessage('Username updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating name:', error);
            setMessage('Something went wrong while updating your name.');
        }
    };

    const handleUnsubscribe = async () => {
        if (!user) return;
        try {
            await setDoc(
                doc(db, "users", user.uid),
                { subscription: null },
                { merge: true }
            );
            setSubscription(null);
            setMessage('Subskrypcja została anulowana.');
        } catch (error) {
            setMessage('Błąd podczas anulowania subskrypcji.');
        }
    };

    const getAccountType = () => {
        if (!subscription) return <span className="account-type free">Free</span>;
        const isActive = subscription.expiresAt > Date.now();
        if (isActive) {
            return (
                <span className="account-type paid">
                    {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)} (do {new Date(subscription.expiresAt).toLocaleDateString()})
                </span>
            );
        }
        return <span className="account-type free">Free</span>;
    };

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

                            <p><strong>Account Type:</strong> {getAccountType()}</p>

                            {subscription && subscription.expiresAt > Date.now() && (
                                <button onClick={handleUnsubscribe}>Unsubscribe</button>
                            )}

                            <button onClick={handleLogout}>Log out</button>

                            {message && <p className="message">{message}</p>}
                        </>
                    ) : (
                        <p>You are not logged in.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
