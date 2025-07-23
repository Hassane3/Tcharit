import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase, onValue, ref} from "firebase/database";
import {getFirestore} from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBWwVWPWYVoDn8ZcSvs7yYDtVCwD4vgPcE",
  authDomain: "tcharit-47.firebaseapp.com",
  databaseURL: "https://tcharit-47-default-rtdb.firebaseio.com",
  projectId: "tcharit-47",
  storageBucket: "tcharit-47.firebasestorage.app",
  messagingSenderId: "12214304458",
  appId: "1:12214304458:web:3777a953b2ecd1cdbb7e33",
  measurementId: "G-GSK7RXVRFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const firestoreDb = getFirestore(app)
export const auth = getAuth();