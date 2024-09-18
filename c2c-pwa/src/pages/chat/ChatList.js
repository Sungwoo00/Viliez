import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { appFireStore } from '../../firebase/config';
import styles from './Chat.module.css';

const ChatRoomList = () => {
  const { user } = useAuthContext();
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const chatRoomsRef = collection(appFireStore, 'chatRooms');
    const q = query(
      chatRoomsRef,
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedChatRooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatRooms(loadedChatRooms);
    });

    return () => unsubscribe();
  }, [user]);

  const handleChatRoomClick = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className={styles.chatRoomsList}>
      <h3>채팅</h3>
      <ul>
        {chatRooms.map((chatRoom) => (
          <li
            key={chatRoom.id}
            onClick={() => handleChatRoomClick(chatRoom.id)}
            className={styles.chatRoomItem}
          >
            <div className={styles.nickname}>
              {chatRoom.participantNames
                ? chatRoom.participantNames
                    .filter((name) => name !== user.displayName)
                    .map((name) => `${name}`)
                    .join(', ')
                : `${chatRoom.id}`}
            </div>
            <div className={styles.item}>
              {chatRoom.itemTitle
                ? chatRoom.itemTitle
                : '등록된 물품 이름 없음'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
