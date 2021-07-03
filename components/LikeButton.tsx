import { useDocument } from "react-firebase-hooks/firestore";

import { firestore, auth, increment } from "@lib/firebase";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";

const LikeButton = ({ postRef }: { postRef: any }) => {
  const user = auth!.currentUser!.uid;
  const likeRef = postRef.collection("likes").doc(user);
  const [likeDoc] = useDocument(likeRef);

  const addLike = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { likeCount: increment(1) });
    batch.set(postRef.collection("likes").doc(user), { user });

    await batch.commit();
  };
  const removeLike = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { likeCount: increment(-1) });
    batch.delete(postRef.collection("likes").doc(user));

    await batch.commit();
  };

  return likeDoc?.exists ? (
    <ThumbUpIcon color="primary" onClick={removeLike} />
  ) : (
    <ThumbUpIcon color="inherit" onClick={addLike} />
  );
};

export default LikeButton;
