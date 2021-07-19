/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

import type { Post } from "@lib/types";
import { firestore } from "@lib/firebase";
import Loader from "@components/Loader";
import ImageUploader from "@components/ImageUploader";
import useStyles from "@lib/Styles";

const EditPost = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [postData, setPostData] = useState<Post | null>(null);
  const { post } = router.query;

  useEffect(() => {
    const getPostData = async () => {
      const postSnapshot = await firestore
        .collection("posts")
        .doc(post as string)
        .get();
      setPostData(postSnapshot.data() as Post);
      setShowLoader(false);
    };
    getPostData();
  }, [post]);

  const getEditedFields = () => {
    let data = {};
    Object.keys(dirtyFields).map((key) => {
      data = { ...data, [key]: getValues(key) };
    });
    return data;
  };

  const editPost = async () => {
    const postRef = firestore.collection("posts").doc(post as string);
    let edited = getEditedFields();

    postData?.imgURL !== downloadURL &&
      (edited = { ...edited, imgURL: downloadURL });

    await postRef.update(edited);
    toast.success("Post updated!");
    router.push(`/posts/${post as string}`);
  };

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { isValid, isDirty, errors, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: postData as { [x: string]: any },
  });
  const classes = useStyles();
  const [downloadURL, setDownloadURL] = useState<string>(
    postData?.imgURL || ""
  );

  return postData ? (
    <form onSubmit={handleSubmit(editPost)} className={classes.createPostForm}>
      {/* TODO: get isDirty working with downloadURL change */}
      <Input className={classes.hidden} name="imgURL" value={downloadURL} />
      <ImageUploader setDownloadURL={setDownloadURL} />
      {downloadURL && <img src={downloadURL} alt="" width="200" height="200" />}

      <TextField
        {...register("content", {
          maxLength: { value: 20000, message: "content is too long" },
          minLength: { value: 1, message: "content is too short" },
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
        <Controller
          render={({ field }) => (
            <Switch
              {...field}
              inputRef={field.ref}
              defaultChecked={postData?.public}
              color="primary"
            />
          )}
          control={control}
          name="public"
          defaultValue={postData?.public}
        />
        <span>Public</span>
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
