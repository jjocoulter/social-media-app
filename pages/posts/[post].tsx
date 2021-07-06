/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";
import type firebase from "firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { auth, firestore, postToJson } from "@lib/firebase";
import LikeButton from "@components/LikeButton";
import CommentModal from "@components/CommentModal";
import CommentFeed from "@components/CommentFeed";
import UserAvatar from "@components/UserAvatar";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import ChatIcon from "@material-ui/icons/Chat";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import { User } from "@lib/types";

export async function getStaticProps({ params }: { params: any }) {
  const { post } = params;

  let postContent;
  let path;
  let poster;

  const postRef = firestore.collection("posts").doc(post);

  postContent = await postToJson(postRef);

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
  const postRef = firestore.collection("posts").doc(props.path.split("/")[1]);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.postContent;
  const author = props.poster;

  const postedAt =
    typeof post.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate("MM/dd/yy");

  const PostDetails = () => {
    return (
      <>
        <div className="info">
          <span>Likes: {post.likeCount}</span>
          <span>{postedAt.toLocaleString()}</span>
        </div>
        <div className="options">
          {auth.currentUser ? (
            <>
              <LikeButton postRef={postRef} />
              <AddCommentModal postRef={postRef} />
              <ShareIcon />
            </>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  const ImagePost = () => {
    return (
      <>
        <img src={post.imgURL} alt="" className="single-post-image" />
        <p className="image-post-content">{post.content}</p>
      </>
    );
  };

  const TextPost = () => {
    return <p className="content">{post.content}</p>;
  };

  return (
    <main>
      <div className="box-center container">
        <PostHeader post={post} author={author} />
        {post && (post.imgURL ? <ImagePost /> : <TextPost />)}
        <PostDetails />
        <CommentFeed postRef={postRef} propComments={props.comments} />
      </div>
    </main>
  );
};

const AddCommentModal = ({
  postRef,
}: {
  postRef: firebase.firestore.DocumentReference;
}) => {
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const handleOpenCommentModal = () => {
    setOpenCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
  };

  return (
    <>
      <ChatIcon onClick={handleOpenCommentModal} />
      <CommentModal
        open={openCommentModal}
        handleClose={handleCloseCommentModal}
        postRef={postRef}
      />
    </>
  );
};

const PostHeader = ({ post, author }: { post: any; author: User }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (val: string) => {
    switch (val) {
      case "edit":
        console.log("edit");

        break;
      case "delete":
        console.log("delete");

        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <div className="post-header">
      <div style={{ maxHeight: "100%", display: "flex" }}>
        <UserAvatar profile={author} />
        <div className="author-details">
          <p className="author-name">
            <Link href={`/users/${post.postedBy}`}>{author.fullName}</Link>
          </p>
          <p className="author-username">Email adress</p>
        </div>
      </div>
      {auth.currentUser && auth.currentUser.uid === post.postedBy ? (
        <>
          <IconButton edge="end" onClick={handleMoreMenu}>
            <MoreIcon />
          </IconButton>
          <Menu
            id="menu-post-options"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={menuOpen}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleMenuClick("edit")}>Edit</MenuItem>
            <MenuItem onClick={() => handleMenuClick("delete")}>
              Delete
            </MenuItem>
          </Menu>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default SinglePostPage;
