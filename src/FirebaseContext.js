// src/FirebaseContext.js
import React, { createContext } from 'react'
import { app } from './firebase'

export const FirebaseContext = createContext(null)

export const FirebaseProvider = ({ children }) => (
	<FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
)
