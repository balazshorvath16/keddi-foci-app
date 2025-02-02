// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeXJQornKkPOmbu4Lxs_oCBSHgzyNqVBE",
  authDomain: "keddi-foci-app.firebaseapp.com",
  projectId: "keddi-foci-app",
  storageBucket: "keddi-foci-app.firebasestorage.app",
  messagingSenderId: "820443052164",
  appId: "1:820443052164:web:7d375a8cf5a47ff58b2ad1",
  measurementId: "G-L7BEHE67NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };