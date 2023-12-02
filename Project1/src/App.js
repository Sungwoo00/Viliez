import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import Register from './pages/home/Register';
import Chat from './pages/chat/Chat';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Nav from './components/Nav';
import useAuthContext from './hooks/useAuthContext';

import MyItem from './pages/mypage/MyItem';
import RentedItem from './pages/mypage/RentedItem';

function App() {
  const { isAuthReady, user } = useAuthContext();

  return (
    <div className='App'>
      {isAuthReady ? (
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/Register'
              element={
                user ? <Register /> : <Navigate replace={true} to='/login' />
              }
            />
            <Route
              path='/chat/:chatRoomId'
              element={
                user ? <Chat /> : <Navigate replace={true} to='/login' />
              }
            />
            {/* <Route
              path='/chatlist'
              element={
                user ? <ChatList /> : <Navigate replace={true} to='/login' />
              }
            /> */}

            <Route
              path='/myitem'
              element={
                user ? <MyItem /> : <Navigate replace={true} to='/login' />
              }
            />
            <Route
              path='/renteditem'
              element={
                user ? <RentedItem /> : <Navigate replace={true} to='/login' />
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
        ''
      )}
    </div>
  );
}

export default App;
