import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "profile-info-bac25.firebaseapp.com",
  projectId: "profile-info-bac25",
  storageBucket: "profile-info-bac25.appspot.com",
  messagingSenderId: "925021803653",
  appId: "1:925021803653:web:6fda120585e54abbe9c5ec",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
