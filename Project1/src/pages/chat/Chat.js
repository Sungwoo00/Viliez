import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { appFireStore } from '../../firebase/confing';
import styles from './Chat.module.css';

const Chat = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const chatRoomId = 'chat'; // chatRooms/

  useEffect(() => {
    const messagesRef = collection(
      appFireStore,
      'chatRooms',
      chatRoomId,
      'messages'
    );

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      newMessages.sort((a, b) => a.timestamp - b.timestamp);

      setMessages(newMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      const messagesRef = collection(
        appFireStore,
        'chatRooms',
        chatRoomId,
        'messages'
      );

      await addDoc(messagesRef, {
        text: newMessage,
        sender: user.uid,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.sender === user.uid
                ? styles.myMessage
                : styles.otherMessage
            }`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder='메세지를 입력하세요.'
          className={styles.inputMessage}
        />
        <button onClick={sendMessage} className={styles.sendMessageButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;
