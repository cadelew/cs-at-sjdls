// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
  authDomain: "cs-at-sjdls.firebaseapp.com",
  projectId: "cs-at-sjdls",
  storageBucket: "cs-at-sjdls.appspot.com",
  messagingSenderId: "134736628853",
  appId: "1:134736628853:web:4a198e8414cbf930a43c3c",
  measurementId: "G-05V9JTG98G"
};

// Initialize Firebase only if API key is valid
let app, auth, storage;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  // Create dummy objects to prevent crashes
  app = null;
  auth = null;
  storage = null;
}

export { app, auth, storage };