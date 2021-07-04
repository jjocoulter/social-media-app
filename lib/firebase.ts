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
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED; // Progress of file upload
export const arrayAdd = firebase.firestore.FieldValue.arrayUnion;
export const increment = firebase.firestore.FieldValue.increment;

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export async function postToJson(doc: any) {
  const dataQuery = await doc.get();
  const data = dataQuery.data();

  const commentsRef = doc.collection("comments");

  let comments: any[] = [];
  if (commentsRef) {
    let commentsQuery = await commentsRef.get();
    commentsQuery.forEach((comment: any) => {
      let commentData = comment.data();

      commentData = {
        ...commentData,
        createdAt: commentData.createdAt.toMillis(),
        modifiedAt: commentData.modifiedAt.toMillis(),
      };

      comments.push(commentData);
    });
  }

  return {
    ...data,
    comments: { ...comments },
    // Firestore Timestamp not serializable to JSON
    createdAt: data.createdAt.toMillis(),
    modifiedAt: data.modifiedAt.toMillis(),
  };
}
