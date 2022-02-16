import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, collection, doc, query , orderBy, setDoc } from 'firebase/firestore';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const uid = auth.currentUser.uid;
  const userPostsQuery = query(collection(firestore, 'users', uid, 'posts'), orderBy('createdAt', 'asc'));
  const [snapshot, loading, error] = useCollection(userPostsQuery);
  // const posts = snapshot?.docs.map((doc) => doc.data());
  const posts = snapshot ? snapshot?.docs.map((doc) => doc.data()) : null;
  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const documentRef = doc(collection(doc(collection(firestore, 'users'), auth.currentUser.uid) , 'posts'), slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(documentRef, data);
    toast.success('Post Created');
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder='My Article' className={styles.input}/>
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>Create New Post</button>
    </form>
  );
}