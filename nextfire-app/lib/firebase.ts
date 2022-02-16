// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHgznekxOpm0z_Z6OOndZXUg_yjgKAutY",
  authDomain: "nextfire-app-alex-names.firebaseapp.com",
  projectId: "nextfire-app-alex-names",
  storageBucket: "nextfire-app-alex-names.appspot.com",
  messagingSenderId: "185610034187",
  appId: "1:185610034187:web:8d6bc7b01c4148d7943b0e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;

export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const userDocument = (await getDocs(q)).docs[0];

  return userDocument;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

export const fromMillis = Timestamp.fromMillis;
