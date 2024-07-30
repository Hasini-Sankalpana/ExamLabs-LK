import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "examlabs-lk.firebaseapp.com",
  projectId: "examlabs-lk",
  storageBucket: "examlabs-lk.appspot.com",
  messagingSenderId: "700830505639",
  appId: "1:700830505639:web:5ef1d140e8a39e48215982"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };