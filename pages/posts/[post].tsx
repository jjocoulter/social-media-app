import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { auth, firestore, postToJson } from "@lib/firebase";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ChatIcon from "@material-ui/icons/Chat";
import ShareIcon from "@material-ui/icons/Share";

export async function getStaticProps({ params }: { params: any }) {
  const { post } = params;

  let postContent;
  let path;
  let poster;

  const postRef = firestore.collection("posts").doc(post);

  postContent = postToJson(await postRef.get());
  path = postRef.path;
  poster = (
    await firestore.collection("users").doc(postContent.postedBy).get()
  ).data();

  return {
    props: { postContent, poster, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const post = doc.id;
    return {
      params: { post },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

const SinglePostPage = (props: any) => {
  const [liked, setLiked] = useState(false);
  const post = props.postContent;
  const author = props.poster;
  const postedAt =
    typeof post.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate("MM/dd/yy");

  const PostDetails = () => {
    return (
      <>
        <div className="info">
          <Link href={`/users/${post.postedBy}`}>{author.fullName}</Link>
          <span>{postedAt.toLocaleString()}</span>
        </div>
        <div className="options">
          <ThumbUpIcon
            color={liked ? "primary" : "inherit"}
            onClick={() => setLiked(!liked)}
          />
          <ChatIcon />
          <ShareIcon />
        </div>
      </>
    );
  };

  const ImagePost = () => {
    return <p>Image</p>;
  };

  const TextPost = () => {
    return (
      <div className="container">
        <p className="content">{post.content}</p>
        <PostDetails />
      </div>
    );
  };

  return (
    <main>
      <div className="box-center">
        {post && (post.imgURL ? <ImagePost /> : <TextPost />)}
      </div>
    </main>
  );
};

export default SinglePostPage;
