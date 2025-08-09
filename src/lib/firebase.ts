// This file uses client-side code
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "bookmyvenue-vkjpj",
  "appId": "1:796282662919:web:bcfd82a576eb958367faa2",
  "storageBucket": "bookmyvenue-vkjpj.appspot.com",
  "apiKey": "AIzaSyDSq7la9-XoCcm15X54EV-f-aX7hE3Rcyg",
  "authDomain": "bookmyvenue-vkjpj.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "796282662919"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
