import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import type { Post } from "@lib/types";
import { firestore } from "@lib/firebase";
import Loader from "@components/Loader";
import ImageUploader from "@components/ImageUploader";
import useStyles from "@lib/Styles";

const EditPost = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [postData, setPostData] = useState<Post | null>(null);

  const getPostData = async () => {
    const { post } = router.query;
    const postRef = await firestore
      .collection("posts")
      .doc(post as string)
      .get();
    setPostData(postRef.data() as Post);
    setShowLoader(false);
  };

  const editPost = () => {
    console.log("Post edited");
  };

  getPostData();

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty, errors },
  } = useForm({ mode: "onChange" });
  const classes = useStyles();
  const [downloadURL, setDownloadURL] = useState<string>(
    postData?.imgURL || ""
  );
  const [publicPost, setPublicPost] = useState<boolean>(
    postData?.public || false
  );

  return postData ? (
    <form onSubmit={handleSubmit(editPost)} className={classes.createPostForm}>
      {downloadURL === "" ? (
        <ImageUploader setDownloadURL={setDownloadURL} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={downloadURL} alt="" width="200" height="200" />
      )}
      <TextField
        {...register("content", {
          maxLength: { value: 20000, message: "content is too long" },
          required: { value: true, message: "content is required" },
        })}
        label="content"
        variant="outlined"
        multiline
        rows={10}
        defaultValue={postData.content}
        helperText={errors.content ? errors.content.message : ""}
        error={!!errors.content}
        className={classes.createPostTF}
      />
      <div>
        <span
          style={
            publicPost
              ? { textDecoration: "underline", fontWeight: "bold" }
              : { textDecoration: "none" }
          }
          onClick={(e) => {
            e.preventDefault();
            setPublicPost(true);
          }}
        >
          Public
        </span>{" "}
        /{" "}
        <span
          style={
            publicPost
              ? { textDecoration: "none" }
              : { textDecoration: "underline", fontWeight: "bold" }
          }
          onClick={(e) => {
            e.preventDefault();
            setPublicPost(false);
          }}
        >
          Private
        </span>
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isValid || !isDirty}
      >
        Edit Post
      </Button>
    </form>
  ) : (
    <Loader show={showLoader} />
  );
};

export default EditPost;
