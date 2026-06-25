import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0QkvC4mTaLhMHN3tA4OSAQ_dr_DajA5E",
  authDomain: "device-streaming-b428e14c.firebaseapp.com",
  projectId: "device-streaming-b428e14c",
  storageBucket: "device-streaming-b428e14c.firebasestorage.app",
  messagingSenderId: "931352223377",
  appId: "1:931352223377:web:0235530d34a6d903fc2930"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);