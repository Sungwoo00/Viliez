import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { appAuth } from "../firebase/config";
import useAuthContext from "./useAuthContext";

const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = (email, password) => {
    setError(null);
    setIsPending(true);

    signInWithEmailAndPassword(appAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "login", payload: user });
        setError(null);
        setIsPending(false);

        if (!user) {
          throw new Error("로그인에 실패했습니다.");
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  };

  return { error, isPending, login };
};

export default useLogin;
