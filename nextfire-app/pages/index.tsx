import Loader from "../components/Loader";
import { useState } from "react";
import {
  collectionGroup,
  where,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { firestore, postToJSON, fromMillis } from "../lib/firebase";
import PostFeed from "../components/PostFeed";

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );
  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {

  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    
    const lastPost = posts[posts.length - 1];
    const cursor =
      typeof lastPost.createdAt === "number"
        ? fromMillis(lastPost.createdAt)
        : lastPost.createdAt;
    const additionalPostsQuery = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );
    const additonalPostsSnapshot = await getDocs(additionalPostsQuery);

    const additonalPosts = additonalPostsSnapshot.docs.map((doc) => {
      return doc.data();
    });

    setPosts(posts.concat(additonalPosts));
    setLoading(false);

    if (additonalPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
