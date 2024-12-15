// Import Firebase libraries
import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh-We3MwQp_Tc3sTiONjZzqX6uoFhxC6I",
  authDomain: "cloudcomputing-52c02.firebaseapp.com",
  databaseURL: "https://cloudcomputing-52c02-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloudcomputing-52c02",
  storageBucket: "cloudcomputing-52c02.appspot.com",
  messagingSenderId: "173767811471",
  appId: "1:173767811471:android:1fe175e3fd724a979febfa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export app instance for use in other parts of your app
export default app;
