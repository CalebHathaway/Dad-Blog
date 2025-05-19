// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSgwtB9hrZoBQYK2NyWTkgyky_2MyYdU",
  authDomain: "blog-project123-28519.firebaseapp.com",
  projectId: "blog-project123-28519",
  storageBucket: "blog-project123-28519.appspot.com",
  messagingSenderId: "31634923292",
  appId: "1:31634923292:web:1d1a7e1c07a9262c6c6cfb",
  measurementId: "G-FLYHVE2ZE9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
