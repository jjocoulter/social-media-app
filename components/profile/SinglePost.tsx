import type { Post } from "../../lib/types";

const SinglePost = ({ post }: { post: Post }) => {
  return <div>{post.content}</div>;
};

export default SinglePost;
