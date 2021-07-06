import { useState } from "react";
import toast from "react-hot-toast";
import type firebase from "firebase";

import { auth, serverTimestamp, increment, firestore } from "@lib/firebase";

import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import useStyles from "@lib/Styles";

const CommentModal = ({
  open,
  handleClose,
  postRef,
}: {
  open: any;
  handleClose: any;
  postRef: firebase.firestore.DocumentReference;
}) => {
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const addComment = async (e: any) => {
    e.preventDefault();
    const commentDoc = postRef.collection("comments").doc();
    const user = auth!.currentUser!.uid;
    const batch = firestore.batch();

    const data = {
      postedBy: user,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
      likeCount: 0,
      content: comment,
    };
    batch.set(commentDoc, data);
    batch.update(postRef, {
      commentCount: increment(1),
    });
    await batch.commit().catch((err: string) => {
      setError(err);
    });

    if (!error) {
      toast.success("Comment added!");
      handleClose();
    } else {
      toast.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={(e) => addComment(e)} className={classes.root}>
        <TextField
          id="comment"
          label="Comment"
          margin="normal"
          type="text"
          required
          error={!!error}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Comment
        </Button>
      </form>
    </Dialog>
  );
};

export default CommentModal;
