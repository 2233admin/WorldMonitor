import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const isDev = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app: any;
let auth: any;
let db: any;
let googleProvider: any;

if (isDev && !import.meta.env.VITE_FIREBASE_API_KEY) {
    // Dev mode without Firebase — mock everything
    console.warn('[Firebase] Dev mode: using mock auth (no API key)');
    app = { delete: () => Promise.resolve() };
    auth = { currentUser: null, onAuthStateChanged: (_cb: any) => () => {} };
    db = {};
    googleProvider = {};
} else {
    try {
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            throw new Error('VITE_FIREBASE_API_KEY is missing.');
        }
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        app = { delete: () => Promise.resolve() };
        auth = { currentUser: null, onAuthStateChanged: (_cb: any) => () => {} };
        db = {};
        googleProvider = {};
    }
}

export { auth, db, googleProvider };
