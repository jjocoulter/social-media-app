/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import type firebase from "firebase";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

import { auth, firestore, postToJson } from "@lib/firebase";
import LikeButton from "@components/LikeButton";
import CommentModal from "@components/CommentModal";
import CommentFeed from "@components/CommentFeed";
import UserAvatar from "@components/UserAvatar";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AvatarGroup from "@material-ui/lab/AvatarGroup";

import ChatIcon from "@material-ui/icons/Chat";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import { User } from "@lib/types";
import router from "next/router";

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
  const [realtimePost] = useDocumentData(postRef, { idField: "uid" });
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
          <span
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            Likes: {post.likeCount}
            <LikesAvatarGroup postRef={postRef} />
          </span>
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

const LikesAvatarGroup = ({
  postRef,
}: {
  postRef: firebase.firestore.DocumentReference;
}) => {
  // TODO: fix appearance of avatar group
  const likesCollection = postRef.collection("likes");
  const [likes] = useCollectionData(likesCollection);
  const [avatars, setAvatars] = useState<any[]>([]);

  useEffect(() => {
    const getAvatars = async () => {
      let user;
      likes?.forEach(async (like, idx) => {
        const userQuery = await firestore
          .collection("users")
          .doc(like.user)
          .get();
        user = userQuery.data();
        const userAvatar = <UserAvatar profile={user as User} key={idx} />;
        setAvatars((prevState) => {
          return [...prevState, userAvatar];
        });
      });
    };
    getAvatars();
  }, [likes]);

  return likes ? <AvatarGroup max={4}>{avatars || <></>}</AvatarGroup> : <></>;
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
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const menuOpen = Boolean(anchorEl);

  const handleMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setConfirmDelete(false);
    setAnchorEl(null);
  };

  const handleMenuClick = (val: string) => {
    switch (val) {
      case "edit":
        router.push(`/posts/${post.uid}/edit/`);
        handleClose();
        break;
      case "delete":
        if (confirmDelete) {
          deletePost();
          handleClose();
        } else {
          setConfirmDelete(true);
        }
        break;
      default:
        handleClose();
        break;
    }
  };

  const deletePost = () => {
    firestore
      .collection("posts")
      .doc(post.uid)
      .delete()
      .then(() => {
        toast.success("Post removed.");
        router.push(`/users/${post.postedBy}/`);
      })
      .catch((err) => {
        toast.error("Error removing document: ", err);
      });
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
              {confirmDelete ? "Really?" : "Delete"}
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
