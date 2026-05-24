import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "vast-ranger-n3n78",
  "appId": "1:577231065768:web:b3c2a5b1bc4be6fd4de89d",
  "apiKey": "AIzaSyCloZDBUNOxXH5rOz5meJz3kCnFh9ZdkKY",
  "authDomain": "vast-ranger-n3n78.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-81af63ef-60ac-47ee-9608-948d9a74618f",
  "storageBucket": "vast-ranger-n3n78.firebasestorage.app",
  "messagingSenderId": "577231065768",
  "measurementId": ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
