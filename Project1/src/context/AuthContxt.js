import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useReducer } from 'react';
import { appAuth } from '../firebase/confing';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload };
    case 'logout':
      return { ...state, user: null };
    case 'isAuthReady':
      return { ...state, user: action.payload, isAuthReady: true };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthReady: false,
  });
  console.log(state);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(appAuth, (user) => {
      dispatch({ type: 'isAuthReady', payload: user });
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
