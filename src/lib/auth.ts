// This file uses client-side code
'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  type User as FirebaseAuthUser,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';


export interface User extends FirebaseAuthUser {
  role?: 'owner' | 'customer';
}

export const signUp = async (email, password, name, role: 'owner' | 'customer', phone?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Now, store the user's role and other details in Firestore
  if (user) {
    await sendEmailVerification(user); // Send verification email
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      phone: phone || null,
      displayName: name,
      role: role,
      createdAt: serverTimestamp()
    });
  }
  
  return userCredential;
};

export const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
        await sendEmailVerification(user);
    } else {
        throw new Error("No user is currently signed in to resend verification email.");
    }
}

export const signIn = async (identifier, password) => {
  // Check if identifier is an email or phone number
  if (identifier.includes('@')) {
    // It's an email
    return signInWithEmailAndPassword(auth, identifier, password);
  } else {
    // It's a phone number, we need to find the user's email first
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", identifier));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("No user found with this mobile number.");
    }
    
    // Assuming phone numbers are unique, so we take the first result
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const email = userData.email;

    if (!email) {
        throw new Error("No email associated with this mobile number.");
    }

    return signInWithEmailAndPassword(auth, email, password);
  }
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
