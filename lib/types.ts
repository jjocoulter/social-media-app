import type firebase from "firebase";

export type Comment = {
  uid: string;
  content: string;
  likeCount: number;
  likes?: Object;
  postedBy: string;
  createdAt: number | firebase.firestore.Timestamp;
  modifiedAt: number | firebase.firestore.Timestamp;
};

export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  profileURL?: string;
  posts?: Array<string>;
};
