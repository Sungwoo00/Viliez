import React, { useState, useEffect, useRef } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import {
  collection,
  addDoc,
  doc,
  query,
  getDoc,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { appFireStore } from '../../firebase/config';
import styles from './Chat.module.css';

const ChatRoom = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [itemInfo, setItemInfo] = useState(null);
  const messagesContainerRef = useRef(null);

  const { chatRoomId } = useParams();

  useEffect(() => {
    const fetchChatRoom = async () => {
      if (!chatRoomId) return;
      const chatRoomRef = doc(appFireStore, 'chatRooms', chatRoomId);
      const chatRoomSnap = await getDoc(chatRoomRef);

      if (chatRoomSnap.exists()) {
        const itemId = chatRoomSnap.data().itemId;
        // console.log('ChatRoom data:', chatRoomSnap.data());
        // console.log('itemId:', itemId);

        if (itemId) {
          const itemRef = doc(appFireStore, 'Sharemarket', itemId);
          const itemSnap = await getDoc(itemRef);

          if (itemSnap.exists()) {
            console.log('Item data:', itemSnap.data());
            setItemInfo(itemSnap.data());
          }
        }
      }
    };

    fetchChatRoom();
  }, [chatRoomId]);

  useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = collection(
      appFireStore,
      'chatRooms',
      chatRoomId,
      'messages'
    );
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() !== '' && chatRoomId) {
      const messagesRef = collection(
        appFireStore,
        'chatRooms',
        chatRoomId,
        'messages'
      );
      await addDoc(messagesRef, {
        text: newMessage,
        sender: user.uid,
        displayName: user.displayName,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        {itemInfo && (
          <div className={styles.itemInfo}>
            <img
              src={itemInfo.photoURLs}
              alt={itemInfo.title}
              className={styles.itemImage}
            />
            <div className={styles.itemDetails}>
              <h3>{itemInfo.title}</h3>
              <p>시간 당 대여 비용: {itemInfo.price.toLocaleString()}원</p>
            </div>
          </div>
        )}

        <div className={styles.messageList} ref={messagesContainerRef}>
          {messages.map((message) => (
            <div key={message.id}>
              <p
                className={
                  message.sender === user.uid
                    ? styles.myDisplayName
                    : styles.otherDisplayName
                }
              >
                {message.displayName}
              </p>
              <div
                className={`${styles.message} ${
                  message.sender === user.uid
                    ? styles.myMessage
                    : styles.otherMessage
                }`}
              >
                <p className={styles.messageText}>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder='메세지를 입력하세요.'
          onKeyDown={handleKeyPress}
          className={styles.inputMessage}
        />
        <button onClick={sendMessage} className={styles.sendMessageButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
