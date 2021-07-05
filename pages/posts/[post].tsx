/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import type firebase from "firebase";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";

import { auth, firestore, postToJson } from "@lib/firebase";
import LikeButton from "@components/LikeButton";
import CommentModal from "@components/CommentModal";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";

import ChatIcon from "@material-ui/icons/Chat";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/MoreHoriz";

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
  const commentsRef = postRef.collection("comments");
  const [realtimePost] = useDocumentData(postRef);
  const [realtimeComments] = useCollectionData(commentsRef);
  const post = realtimePost || props.postContent;
  const comments = realtimeComments || props.comments;
  const author = props.poster;

  type Comment = {
    content: string;
    likeCount: number;
    likes: Object;
    postedBy: string;
    createdAt: number;
    modifiedAt: number;
  };

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

  const Comment = ({ comment }: { comment: Comment }) => {
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

    const commenterProfilePic = commenter.profileURL ? (
      <Avatar src={commenter.profileURL} alt="" />
    ) : (
      <Avatar>{commenter.firstName.charAt(0).toUpperCase()}</Avatar>
    );

    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>{commenterProfilePic}</ListItemAvatar>
        <ListItemText
          primary={comment.content}
          secondary={commenter.fullName}
        />
      </ListItem>
    );
  };

  const PostComments = () => {
    return comments != undefined && comments.length != 0 ? (
      <List>
        {comments.map((comment: Comment, idx: number) => (
          <>
            <Comment comment={comment} key={idx} />
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
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
