import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCyxyiDhrFSUCtlza7mwXOhTOB1btbgCPs",
  authDomain: "photo-tagging-app-7e2f6.firebaseapp.com",
  projectId: "photo-tagging-app-7e2f6",
  storageBucket: "photo-tagging-app-7e2f6.appspot.com",
  messagingSenderId: "428948638023",
  appId: "1:428948638023:web:40d99f6ec157236865e462",
  measurementId: "G-7B222XGL2V"
};


export const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);
export const firestore = getFirestore(firebase);
const analytics = getAnalytics(firebase);