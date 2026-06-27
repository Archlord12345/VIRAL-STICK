import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUNrSiP9HR8DgOwTey7rjLr2imwpYGXQU",
  authDomain: "viral-stick-4320c.firebaseapp.com",
  projectId: "viral-stick-4320c",
  storageBucket: "viral-stick-4320c.firebasestorage.app",
  messagingSenderId: "712665959124",
  appId: "1:712665959124:web:4b72cccfe954989bd34941",
  measurementId: "G-NXWSVBZBKH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
