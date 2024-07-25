// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cs-at-sjdls.firebaseapp.com",
  projectId: "cs-at-sjdls",
  storageBucket: "cs-at-sjdls.appspot.com",
  messagingSenderId: "134736628853",
  appId: "1:134736628853:web:4a198e8414cbf930a43c3c",
  measurementId: "G-05V9JTG98G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);