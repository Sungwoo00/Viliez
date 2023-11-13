import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import MyPage from './pages/home/MyPage';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Nav from './components/Nav';
import useAuthContext from './hooks/useAuthContext';

function App() {
  const { isAuthReady, user } = useAuthContext();

  return (
    <div className='App'>
      {isAuthReady ? (
        <BrowserRouter>
          <Nav />
          {/* <Home /> */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/mypage'
              element={
                user ? <MyPage /> : <Navigate replace={true} to='/login' />
              }
            />
            <Route
              path='/login'
              element={!user ? <Login /> : <Navigate replace={true} to='/' />}
            />
            <Route
              path='/signup'
              element={!user ? <Signup /> : <Navigate replace={true} to='/' />}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        '잠시만 기다려주세요.'
      )}
    </div>
  );
}

export default App;
