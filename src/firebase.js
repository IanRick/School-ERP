// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8bmXRE_IOGubOhpef_VbI-KtiuJLWJAM",
  authDomain: "school-management-system-93c00.firebaseapp.com",
  projectId: "school-management-system-93c00",
  storageBucket: "school-management-system-93c00.appspot.com",
  messagingSenderId: "283580809284",
  appId: "1:283580809284:web:a54fc8ab081e8bdaccfc11",
  measurementId: "G-DV3GJZW69E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);