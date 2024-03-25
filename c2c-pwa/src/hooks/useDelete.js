import {
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { appAuth, appFireStore } from '../firebase/config';
import useAuthContext from './useAuthContext';
import { useState } from 'react';

const useDelete = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const userDelete = async () => {
    const confirmed = window.confirm(
      '정말 탈퇴 하시겠습니까? 탈퇴하면 회원님의 모든 정보가 사라집니다.' +
        ' 이 작업은 되돌릴 수 없습니다.'
    );

    if (!confirmed) {
      return;
    }
    setError(null);
    setIsPending(true);

    const user = appAuth.currentUser;

    try {
      const itemsCollection = collection(appFireStore, 'Sharemarket');
      const itemsQuery = query(itemsCollection, where('uid', '==', user.uid));
      const itemDocs = await getDocs(itemsQuery);

      itemDocs.forEach(async (itemDoc) => {
        await deleteDoc(doc(itemsCollection, itemDoc.id));
      });

      await deleteUser(user);

      dispatch({ type: 'logout' });
      setError(null);
      setIsPending(false);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };
  return { error, isPending, userDelete };
};

export default useDelete;
