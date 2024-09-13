import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "adoptpetapp-d8aa7.firebaseapp.com",
  databaseURL: "https://adoptpetapp-d8aa7-default-rtdb.firebaseio.com",
  projectId: "adoptpetapp-d8aa7",
  storageBucket: "adoptpetapp-d8aa7.appspot.com",
  messagingSenderId: "188270055426",
  appId: "1:188270055426:web:5a6d749a6cefc5b615571b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
