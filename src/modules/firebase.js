import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhtSGkxhNADgI6oTFeg4eQinjHrOwj0V4",
  authDomain: "w5magazine-6d569.firebaseapp.com",
  projectId: "w5magazine-6d569",
  storageBucket: "w5magazine-6d569.appspot.com",
  messagingSenderId: "113318164260",
  appId: "1:113318164260:web:c3b40851ad4d592398e5b1",
  measurementId: "G-2XY4MCK8SB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

