import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AuthCheck from "@components/AuthCheck";
import ImageUploader from "@components/ImageUploader";
import useStyles from "@lib/Styles";
import { serverTimestamp, auth, firestore, arrayAdd } from "@lib/firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const CreatePostPage = () => {
  const router = useRouter();

  const [downloadURL, setDownloadURL] = useState("");
  const [publicPost, setPublicPost] = useState(false);

  const CreatePostForm = () => {
    const classes = useStyles();

    const {
      register,
      handleSubmit,
      formState: { isValid, isDirty, errors },
    } = useForm({ mode: "onChange" });

    return (
      <form
        onSubmit={handleSubmit(createPost)}
        className={classes.createPostForm}
      >
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
          Create Post
        </Button>
      </form>
    );
  };

  const createPost = async ({ content }: { content: string }) => {
    const uid = auth!.currentUser!.uid;
    const userRef = firestore.collection("users").doc(uid);
    const postRef = firestore.collection("posts");
    let postUid;

    const data = {
      imgURL: downloadURL === "" ? null : downloadURL,
      content: content,
      public: publicPost,
      likeCount: 0,
      commentCount: 0,
      postedBy: uid,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    };

    await postRef
      .add(data)
      .then((ref) => {
        postUid = ref.id;
        userRef.update({ posts: arrayAdd(postUid) });
        toast.success("Post created!");
      })
      .catch((err) => {
        toast.error(err.message);
        router.push(`/users/${uid}`);
      });

    router.push(`/posts/${postUid}`);
  };

  return (
    <AuthCheck>
      <CreatePostForm />
    </AuthCheck>
  );
};

export default CreatePostPage;
