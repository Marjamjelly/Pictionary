// Firebase configuration (replace with your actual Firebase project details)
const firebaseConfig = {
    apiKey: "AIzaSyBXdWHUI5J2NWSJkyAxYL-_tlXaf-Y6uWI",
    authDomain: "pictionary-dc813.firebaseapp.com",
    databaseURL: "https://pictionary-dc813-default-rtdb.firebaseio.com",
    projectId: "pictionary-dc813",
    storageBucket: "pictionary-dc813.firebasestorage.app",
    messagingSenderId: "512453151807",
    appId: "1:512453151807:web:7eaeb4ffa6eb7e62253c8a",
    measurementId: "G-VZQE1FEHML"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();