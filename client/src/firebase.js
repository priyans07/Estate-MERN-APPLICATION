// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4f4d8.firebaseapp.com",
  projectId: "mern-estate-4f4d8",
  storageBucket: "mern-estate-4f4d8.appspot.com",
  messagingSenderId: "908798878558",
  appId: "1:908798878558:web:2f9bce1e41908a47de25cf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);