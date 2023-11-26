import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import MyItem from './pages/home/MyItem';
import Chat from './pages/chat/Chat';
import ChatList from './pages/chat/chatList';
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
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/myitem'
              element={
                user ? <MyItem /> : <Navigate replace={true} to='/login' />
              }
            />
            <Route
              path='/chat/:chatRoomId'
              element={
                user ? <Chat /> : <Navigate replace={true} to='/login' />
              }
            />
            <Route
              path='/chatlist'
              element={
                user ? <ChatList /> : <Navigate replace={true} to='/login' />
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
