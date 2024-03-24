import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import loadingScreenJson from "./lottie/loadingScreen.json";

import Home from "./pages/home/Home";
import Register from "./pages/home/Register";
import Chat from "./pages/chat/Chat";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Nav from "./components/Nav";
import useAuthContext from "./hooks/useAuthContext";

import MyItem from "./pages/mypage/MyItem";
import RentedItem from "./pages/mypage/RentedItem";

function App() {
  const { isAuthReady, user } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Lottie
          loop={false}
          animationData={loadingScreenJson}
          play
          style={{ width: 400, height: 400 }}
        />
        <h2 style={{ color: "#192F71" }}>준비되는 동안 잠시만 기다려주세요</h2>
      </div>
    );
  }

  return (
    <div>
      {isAuthReady ? (
        <BrowserRouter>
          <Nav />
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/Register"
                element={
                  user ? <Register /> : <Navigate replace={true} to="/login" />
                }
              />
              <Route
                path="/chat/:chatRoomId"
                element={
                  user ? <Chat /> : <Navigate replace={true} to="/login" />
                }
              />
              {/* <Route
              path='/chatlist'
              element={
                user ? <ChatList /> : <Navigate replace={true} to='/login' />
              }
            /> */}

              <Route
                path="/myitem"
                element={
                  user ? <MyItem /> : <Navigate replace={true} to="/login" />
                }
              />
              <Route
                path="/renteditem"
                element={
                  user ? (
                    <RentedItem />
                  ) : (
                    <Navigate replace={true} to="/login" />
                  )
                }
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate replace={true} to="/" />}
              />
              <Route
                path="/signup"
                element={
                  !user ? <Signup /> : <Navigate replace={true} to="/" />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
