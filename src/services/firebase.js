import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCV3e9eevlaMX9vsRKZQKB7VfHPmvvCo6U",
    authDomain: "night-store-1615f.firebaseapp.com",
    projectId: "night-store-1615f",
    storageBucket: "night-store-1615f.firebasestorage.app",
    messagingSenderId: "367296853245",
    appId: "1:367296853245:web:de112f5470f6734bc8fa94",
    measurementId: "G-JES711MB29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy };
