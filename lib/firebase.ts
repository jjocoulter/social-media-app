import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsIFyVQW1WLkPqjBofyNkitoV5k0eum-w",
  authDomain: "social-media-c84a1.firebaseapp.com",
  projectId: "social-media-c84a1",
  storageBucket: "social-media-c84a1.appspot.com",
  messagingSenderId: "339289585339",
  appId: "1:339289585339:web:fd50d500e9330f79e51b9e",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
