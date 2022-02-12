import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;
    
    if (user) {
      const documentRef = doc(firestore, 'users', user.uid);
      
      unsubscribe = onSnapshot(documentRef, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}