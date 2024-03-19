import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

import { appAuth } from '../firebase/config';
import useAuthContext from './useAuthContext';
import { useNavigate } from 'react-router-dom';

const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signup = (email, password, displayName, errorCode) => {
    setError(null);
    setIsPending(true);

    if (errorCode === 'password-mismatch') {
      setError(errorCode);
      setIsPending(false);
      return;
    }

    createUserWithEmailAndPassword(appAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);

        if (!user) {
          throw new Error('회원가입에 실패했습니다.');
        }

        updateProfile(appAuth.currentUser, { displayName })
          .then(() => {
            signOut(appAuth).then(() => {
              dispatch({ type: 'logout' });
              setError(null);
              setIsPending(false);
              navigate('../login');
            });
          })
          .catch((err) => {
            setError(err.message);
            setIsPending(false);
          });
      })
      .catch((err) => {
        setError(err.code);
        setIsPending(false);
      });
  };

  return { error, isPending, signup };
};

export default useSignup;
