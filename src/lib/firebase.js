// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpIxaIPQkoENir2OYVbQIIUgAik8Yzb4M",
  authDomain: "digital-buy-5eb08.firebaseapp.com",
  projectId: "digital-buy-5eb08",
  storageBucket: "digital-buy-5eb08.firebasestorage.app",
  messagingSenderId: "435557959714",
  appId: "1:435557959714:web:1c9130e7f9e2319ca7627b",
  measurementId: "G-S25DBFH381"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
