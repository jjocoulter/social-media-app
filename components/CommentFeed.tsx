import type firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

import SingleComment from "@components/SingleComment";
import type { Comment } from "@lib/types";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

const CommentFeed = ({
  postRef,
  propComments,
}: {
  postRef: firebase.firestore.DocumentReference;
  propComments: any;
}) => {
  const commentsRef = postRef.collection("comments");
  const [realtimeComments] = useCollectionData(commentsRef, { idField: "uid" });
  const comments = realtimeComments || propComments;

  return comments != undefined && comments.length != 0 ? (
    <List>
      <Divider variant="inset" component="li" />
      {comments.map((comment: Comment, idx: number) => (
        <>
          <SingleComment comment={comment} postRef={postRef} key={idx} />
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  ) : (
    <p>No comments to display</p>
  );
};

export default CommentFeed;
