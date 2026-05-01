import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA461LqzE7ElPY-7e2d365pDlewej7ranE",
  authDomain: "dimer-ba4f8.firebaseapp.com",
  projectId: "dimer-ba4f8",
  storageBucket: "dimer-ba4f8.firebasestorage.app",
  messagingSenderId: "165832871567",
  appId: "1:165832871567:web:a05b52b557e3381bd46afa",
  measurementId: "G-1L458PTX47"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
