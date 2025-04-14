import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXdWHUI5J2NWSJkyAxYL-_tlXaf-Y6uWI",
    authDomain: "pictionary-dc813.firebaseapp.com",
    projectId: "pictionary-dc813",
    storageBucket: "pictionary-dc813.firebasestorage.app",
    messagingSenderId: "512453151807",
    appId: "1:512453151807:web:7eaeb4ffa6eb7e62253c8a",
    measurementId: "G-VZQE1FEHML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);