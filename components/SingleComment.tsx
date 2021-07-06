import React, { useEffect, useState } from "react";
import type firebase from "firebase";
import { firestore } from "@lib/firebase";
import Link from "next/link";

import LikeButton from "@components/LikeButton";
import UserAvatar from "@components/UserAvatar";
import type { Comment, User } from "@lib/types";

import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const SingleComment = ({
  comment,
  postRef,
}: {
  comment: Comment;
  postRef: firebase.firestore.DocumentReference;
}) => {
  const [commenter, setCommenter] = useState<
    firebase.firestore.DocumentData | undefined
  >();

  useEffect(() => {
    const getCommenter = async () => {
      const commenterQuery = await firestore
        .collection("users")
        .doc(comment.postedBy)
        .get();
      setCommenter(commenterQuery.data());
    };
    getCommenter();
  }, [comment.postedBy]);

  if (commenter == undefined) {
    return <p></p>;
  }

  const postedAt =
    typeof comment.createdAt === "number"
      ? new Date(comment.createdAt)
      : comment.createdAt.toDate();

  const commentRef = postRef.collection("comments").doc(comment.uid);

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <UserAvatar profile={commenter as User} />
      </ListItemAvatar>
      <ListItemText
        primary={comment.content}
        secondary={
          <React.Fragment>
            <Link href={`/users/${comment.postedBy}`}>
              {commenter.fullName}
            </Link>{" "}
            {" - " + postedAt.toLocaleString()}
          </React.Fragment>
        }
      />
      <ListItemSecondaryAction>
        <LikeButton postRef={commentRef} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SingleComment;
