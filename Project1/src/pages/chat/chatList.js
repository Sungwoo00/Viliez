
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { collection, query, where, onSnapshot } from 'firebase/firestore';
// import { appFireStore } from '../../firebase/confing';
// import { Link } from 'react-router-dom';

// const ChatList = () => {
//   const [chatRooms, setChatRooms] = useState([]);
//   const currentItemUid = 'your_current_item_uid';

//   useEffect(() => {
//     const chatRoomsRef = collection(appFireStore, 'chatRooms');
//     const q = query(chatRoomsRef, where('Item.uid', '==', currentItemUid));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const newChatRooms = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setChatRooms(newChatRooms);
//     });

//     return () => unsubscribe();
//   }, [currentItemUid]);

  
//   return (
//     <div>
//       {chatRooms.map((chatRoom) => (
//         <Link key={chatRoom.id} to={`/chat/${chatRoom.id}`}>
//           Chat Room: {chatRoom.id}
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default ChatList;

import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { appFireStore } from '../../firebase/confing';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const currentItemUid = 'your_current_item_uid';

  useEffect(() => {
    // 쿼리를 정의합니다.
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

    const q = query(chatRoomsRef, where('Item.uid', '==', currentItemUid));

    // 각 채팅방에 대한 정보를 가져옵니다.
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatRoomsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const chatRoomData = doc.data();
        // 여기에 각 채팅방의 최신 메시지를 가져오는 로직을 추가합니다.
        // 예: chatRoomData.lastMessage = await fetchLastMessage(doc.id);
        return {
          id: doc.id,
          ...chatRoomData,
        };
      }));
      setChatRooms(chatRoomsData);
    });

    return () => unsubscribe();
  }, [currentItemUid]);

  return (
    <div>
      {chatRooms.map((chatRoom) => (
        <Link key={chatRoom.id} to={`/chat/${chatRoom.id}`}>
          Chat Room: {chatRoom.id} // 추가 정보를 여기에 표시할 수 있습니다.
        </Link>

      ))}
    </div>
  );
};

export default ChatList;