import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

const Chat = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<ChatList />} />
                <Route path=':chatRoomId' element={<ChatRoom />} />
            </Routes>
        </>
    );
};

export default Chat;
