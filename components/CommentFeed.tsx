import type firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

import SingleComment from "@components/SingleComment";
import type { Comment } from "@lib/types";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import React from "react";

const CommentFeed = ({
  postRef,
  propComments,
}: {
  postRef: firebase.firestore.DocumentReference;
  propComments: any;
}) => {
  const commentsRef = postRef
    .collection("comments")
    .orderBy("createdAt", "asc");
  const [realtimeComments] = useCollectionData(commentsRef, { idField: "uid" });
  const comments = realtimeComments || propComments;

  return comments != undefined && comments.length != 0 ? (
    <List>
      <Divider variant="inset" component="li" />
      {comments.map((comment: Comment, idx: number) => (
        <React.Fragment key={idx}>
          <SingleComment comment={comment} postRef={postRef} />
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  ) : (
    <p>No comments to display</p>
  );
};

export default CommentFeed;
