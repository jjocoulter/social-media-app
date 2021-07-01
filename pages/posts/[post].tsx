import { useRouter } from "next/router";

import { auth, firestore, postToJson } from "@lib/firebase";

export async function getStaticProps({ params }: { params: any }) {
  const { post } = params;

  let postContent;
  let path;

  const postRef = firestore.collection("posts").doc(post);

  postContent = postToJson(await postRef.get());
  path = postRef.path;

  return {
    props: { postContent, path },
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
  const post = props.postContent;

  const ImagePost = () => {
    return <p>Image</p>;
  };

  const TextPost = () => {
    return <p></p>;
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
