import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { appFireStore } from '../../firebase/confing';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const chatRoomsRef = collection(appFireStore, 'chatRooms');

    const unsubscribe = onSnapshot(chatRoomsRef, (snapshot) => {
      const newChatRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatRooms(newChatRooms);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Chat Rooms</h1>
      {chatRooms.map((room) => (
        <div key={room.id}>
          <Link to={`/chat/${room.id}`}>방 번호: {room.id}</Link>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
