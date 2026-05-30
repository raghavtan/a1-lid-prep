import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as fbSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase.js';

// user === undefined  →  auth state is still loading
// user === null       →  signed out
// user === User obj   →  signed in and authorised

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u ?? null));
    }, []);

    const signIn = useCallback(async () => {
        setAuthError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;

            // Check allowlist stored at /config/allowedEmails { emails: string[] }.
            // If the document does not exist, all authenticated Google users are allowed.
            const snap = await getDoc(doc(db, 'config', 'allowedEmails'));
            if (snap.exists()) {
                const allowed = snap.data().emails ?? [];
                if (!allowed.includes(email)) {
                    await fbSignOut(auth);
                    setAuthError(`${email} is not authorised. Ask the admin to add your account.`);
                    return;
                }
            }
            // Auth state listener above will update `user` automatically.
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setAuthError(err.message ?? 'Sign-in failed. Try again.');
            }
        }
    }, []);

    const signOut = useCallback(() => fbSignOut(auth), []);

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, authError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
