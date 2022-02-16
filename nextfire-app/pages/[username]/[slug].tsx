import { getUserWithUsername, firestore } from "../../lib/firebase";
import {
  getDoc,
  collectionGroup,
  doc,
  query,
  getDocs,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import styles from "../../styles/Home.module.css";
import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";
import Link from "next/link";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  let post;
  let path;

  if (userDoc) {
    const postRef = doc(firestore, userDoc.ref.path, "posts", slug);
    const postSnapshot = await getDoc(postRef);
    path = postRef.path;

    if (postSnapshot.exists()) {
      const data = postSnapshot.data();
      // Cannot use the postToJSON() function because the function is expecting a QueryDocumentSnapshot and the type is not of QueryDocumentSnapshot
      post = {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
      };
    }

    return {
      props: { post, path },
      revalidate: 5000,
    };
  }
}

export async function getStaticPaths() {
  const postsQuery = query(collectionGroup(firestore, "posts"));
  const postsSnapshot = await getDocs(postsQuery);
  const paths = postsSnapshot.docs.map((doc) => {
    const { username, slug } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>❤️ Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
