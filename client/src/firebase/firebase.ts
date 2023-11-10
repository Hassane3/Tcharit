import { initializeApp } from "firebase/app";
import {getDatabase, onValue, ref} from "firebase/database";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCxpSn9MzF0CJZsfR_7s42S8_a52dskQX4",
  authDomain: "tchari.firebaseapp.com",
  databaseURL: "https://tchari-default-rtdb.firebaseio.com",
  projectId: "tchari",
  storageBucket: "tchari.appspot.com",
  messagingSenderId: "294891691900",
  appId: "1:294891691900:web:c11d262e460c9407ee8ef9",
  measurementId: "G-M7T6TYNY74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);