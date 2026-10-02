import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";


// Your Firebase Web Config

const firebaseConfig = {
  apiKey: "AIzaSyA72w4yxjeoKpTY4wdx55KOtPsU6eUBYs0",
  authDomain: "boxify-5430d.firebaseapp.com",
  projectId: "boxify-5430d",
  storageBucket: "boxify-5430d.firebasestorage.app",
  messagingSenderId: "972053296785",
  appId: "1:972053296785:web:fe52c75374a139e1e9b130",
  measurementId: "G-6NEB2GKY1T"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase Authentication
const firebaseAuth = getAuth(app);


// Firebase Cloud Messaging
const firebaseMessaging = getMessaging(app);


// Export
export {
  app,
  firebaseAuth,
  firebaseMessaging
};