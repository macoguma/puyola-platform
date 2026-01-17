// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4CHTW2lrpUzSnvX3KGJrIPSjdaoqoBQE",
  authDomain: "puyola-platform.firebaseapp.com",
  projectId: "puyola-platform",
  storageBucket: "puyola-platform.firebasestorage.app",
  messagingSenderId: "831659964215",
  appId: "1:831659964215:web:6d568b43f4ad7f09af4cb2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
