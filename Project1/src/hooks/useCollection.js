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
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    setIsLoading(true);
    let q;
    if (myQuery) {
      q = query(
        collection(appFireStore, transaction),
        where(...myQuery),
        orderBy('createdTime', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      myQuery ? q : collection(appFireStore, transaction),
      (snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(result);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false); 
      }
    );

    return () => {
      unsubscribe();
      setIsLoading(false);
    }; 
  }, [transaction, myQuery]);

  return { documents, error, isLoading };
};

export default useCollection;
