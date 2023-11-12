import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { appFireStore } from '../firebase/confing';

const useCollection = (transaction, myQuery) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q;
    if (myQuery) {
      q = query(
        collection(appFireStore, transaction),
        where(...myQuery),
        orderBy('createdTime', 'desc') // desc내림차순 asc오름차순
      );
    } // TODO : 최신순으로 보기 버튼 ?

    const unsubscribe = onSnapshot(
      myQuery ? q : collection(appFireStore, transaction),
      (snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(result);
        setError(null);
      },
      (error) => {
        setError(error.message);
      }
    );

    return unsubscribe;
  }, [collection]);

  return { documents, error };
};

export default useCollection;
