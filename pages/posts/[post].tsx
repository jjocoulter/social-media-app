/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { auth, firestore, postToJson } from "@lib/firebase";
import LikeButton from "@components/LikeButton";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import ChatIcon from "@material-ui/icons/Chat";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/MoreHoriz";

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
          <LikeButton postRef={postRef} />
          <ChatIcon />
          <ShareIcon />
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

  const Comment = ({ comment }: { comment: any }) => {
    return comment ? <p>Comment</p> : <p>No Comment</p>;
  };

  const PostComments = () => {
    return post.comments ? (
      post.comments.map((comment: any, idx: number) => (
        <Comment comment={comment} key={idx} />
      ))
    ) : (
      <p>No comments to display</p>
    );
  };

  return (
    <main>
      <div className="box-center container">
        <PostHeader post={post} author={author} />
        {post && (post.imgURL ? <ImagePost /> : <TextPost />)}
        <PostDetails />
        <PostComments />
      </div>
    </main>
  );
};

const PostHeader = ({ post, author }: { post: any; author: any }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const authorProfilePic = author.profileURL ? (
    <Avatar src={author.profileURL} alt="" />
  ) : (
    <Avatar>{author.firstName.charAt(0).toUpperCase()}</Avatar>
  );

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
        {authorProfilePic}{" "}
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
