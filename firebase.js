// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
//import { getFirebase } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxN5FjF8_ObptcpfXnEuBb1aoSidKnfJk",
  authDomain: "project-3-flashcard.firebaseapp.com",
  projectId: "project-3-flashcard",
  storageBucket: "project-3-flashcard.appspot.com",
  messagingSenderId: "423191705055",
  appId: "1:423191705055:web:c5932d46bcc637fe55c06a",
  measurementId: "G-CC9LZ689BK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};