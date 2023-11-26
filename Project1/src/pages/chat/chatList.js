import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { appFireStore } from '../../firebase/confing';
import useAuthContext from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const { user } = useAuthContext();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const chatRoomsRef = collection(appFireStore, 'chatRooms');
    const q = query(chatRoomsRef, where('seller', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newChatRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChatRooms(newChatRooms);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  return (
    <div>
      <p>나의 판매 물품에 대한 채팅방 목록</p>
      {chatRooms.map((chatRoom) => (
        <Link key={chatRoom.id} to={`/chat/${chatRoom.id}`}>
          {chatRoom.id}
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
