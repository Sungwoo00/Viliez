import { useContext } from 'react';
import { AuthContext } from '../context/AuthContxt';

const useAuthContext = () => {
  const context = useContext(AuthContext);

  return context; // state & dispatch 함수가 들어있음
};

export default useAuthContext;
