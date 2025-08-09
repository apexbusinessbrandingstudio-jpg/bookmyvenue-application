// This file uses client-side code
'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseAuthUser,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';


export interface User extends FirebaseAuthUser {
  role?: 'owner' | 'customer';
}

export const signUp = async (email, password, name, role: 'owner' | 'customer') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Now, store the user's role and other details in Firestore
  if (user) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: name,
      role: role,
      createdAt: serverTimestamp()
    });
  }
  
  return userCredential;
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};


export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, get their custom data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        callback({ ...user, role: userData.role });
      } else {
        // Handle case where user exists in Auth but not in Firestore
        // This could happen on first sign-up if Firestore write fails
        // Or for users created before this role system was implemented
        callback({ ...user, role: undefined }); // Or a default role
      }
    } else {
      // User is signed out
      callback(null);
    }
  });
};