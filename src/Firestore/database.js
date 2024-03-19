// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOc_EOGI6syonjP9cOHzC4Sr4EGKIY8uM",
  authDomain: "logicpuzzles-cce50.firebaseapp.com",
  projectId: "logicpuzzles-cce50",
  storageBucket: "logicpuzzles-cce50.appspot.com",
  messagingSenderId: "474348334334",
  appId: "1:474348334334:web:ef436d34a889795e18c9af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);