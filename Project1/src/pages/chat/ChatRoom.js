import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { appFirestore } from './firebase/config';

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = collection(
      appFirestore,
      'chatRooms',
      roomId,
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
  }, [roomId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      const messagesRef = collection(
        appFirestore,
        'chatRooms',
        roomId,
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      {/* 채팅 메시지 출력 부분 */}
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.text}</p>
        </div>
      ))}

      {/* 메시지 입력 부분 */}
      <input
        type='text'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder='메세지를 입력하세요.'
        onKeyPress={handleKeyPress}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoom;
