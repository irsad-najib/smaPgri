// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4tA3BEhUB5vtgaHpqP1B2viK98B_otto",
    authDomain: "smapgri-9b70f.firebaseapp.com",
    projectId: "smapgri-9b70f",
    storageBucket: "smapgri-9b70f.firebasestorage.app",
    messagingSenderId: "199908347480",
    appId: "1:199908347480:web:b8ba08bde1bcd137f4042d",
    measurementId: "G-E48FFCWR95"
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

// Initialize Firebase

export const db = getFirestore();
export const storage = getStorage();