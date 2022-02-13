import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername } from "../../lib/firebase";
import {
  getDocs,
  where,
  limit,
  orderBy,
  collection,
  query,
  getDoc,
} from "firebase/firestore";
import { firestore, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query: q }) {
  const { username } = q;
  let user = null;
  let posts = null;
  const userDoc = await getUserWithUsername(username);
  
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();

    const userPostsQuery = query(
      collection(firestore, `${userDoc.ref.path}/posts`),
      where("published", "==", true),
      limit(5),
      orderBy("createdAt", "desc")
    );
    
    const userPostsSnapshot = await getDocs(userPostsQuery);
    posts = userPostsSnapshot.docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
}
