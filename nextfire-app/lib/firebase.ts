import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHgznekxOpm0z_Z6OOndZXUg_yjgKAutY",
  authDomain: "nextfire-app-alex-names.firebaseapp.com",
  projectId: "nextfire-app-alex-names",
  storageBucket: "nextfire-app-alex-names.appspot.com",
  messagingSenderId: "185610034187",
  appId: "1:185610034187:web:8d6bc7b01c4148d7943b0e"
};

// Initialize Firebase
if (!firebase.apps.length) {
  const app = initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();