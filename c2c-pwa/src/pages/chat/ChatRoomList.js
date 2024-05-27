import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { appFireStore } from "../../firebase/config";
import { Link } from "react-router-dom";

const ChatRoomList = ({ currentUserUid }) => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const chatRoomsRef = collection(appFireStore, "chatRooms");
    let q;
    if (currentUserUid) {
      q = query(chatRoomsRef, where("users", "array-contains", currentUserUid));
    } else {
      q = chatRoomsRef; // 만약 currentUserUid가 없다면 모든 채팅방을 가져옵니다.
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatRoomsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatRooms(chatRoomsData);
    });

    return () => unsubscribe();
  }, [currentUserUid]);

  return (
    <div>
      <h2>My Chat Rooms</h2>
      <ul>
        {chatRooms.map((chatRoom) => (
          <li key={chatRoom.id}>
            <Link to={`/chat/${chatRoom.id}`}>{chatRoom.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
