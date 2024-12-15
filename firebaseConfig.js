// Import Firebase libraries
import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbJI5LYgkkPqZD1dOVITHVserxc6F6cK4",
  authDomain: "cloudcomputing-52c02.firebaseapp.com",
  databaseURL: "https://cloudcomputing-52c02-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloudcomputing-52c02",
  storageBucket: "cloudcomputing-52c02.firebasestorage.app",
  messagingSenderId: "173767811471",
  appId: "1:173767811471:web:4b1d79c8f698a6229febfa",
  measurementId: "G-E4LHNDNFX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export app instance for use in other parts of your app
export default app;
