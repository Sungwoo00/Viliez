import React, { useState, useEffect, useRef } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import { useLocation } from 'react-router-dom'; 
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  getDoc  
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { appFireStore } from '../../firebase/confing';
import styles from './Chat.module.css';

const Chat = () => {
  const { user } = useAuthContext();
  const location = useLocation(); 
  const item = location.state?.item; 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  const { chatRoomId } = useParams();

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo(0, scrollHeight - clientHeight);
    }
  }, [messages]);
  
  useEffect(() => {
    if (!user || (user.uid !== item?.uids.ownerUid && user.uid !== item?.uids.itemUid)) {
      // 적절한 처리를 여기에 추가 (예: navigate('/login') 또는 경고 메시지 표시)
    }
  }, [user, item]);

  useEffect(() => {
    const messagesRef = collection(appFireStore, 'chatRooms', chatRoomId, 'messages');
  
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const newMessages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((message) => message.sender === user.uid || message.receiver === user.uid)
        .sort((a, b) => a.timestamp - b.timestamp);
  
      setMessages(newMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [chatRoomId]);

  const updateChatRoomListForUser = async (userId, chatRoomId) => {
    const userRef = doc(appFireStore, 'users', userId);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentChatRooms = userData.chatRooms || [];
        if (!currentChatRooms.includes(chatRoomId)) {
          await updateDoc(userRef, {
            chatRooms: [...currentChatRooms, chatRoomId]
          });
        }
      }
    } catch (error) {
      console.error("Error updating user's chat room list: ", error);
    }
  };
  
  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      setLoading(true);
      const messagesRef = collection(appFireStore, 'chatRooms', chatRoomId, 'messages');

      try {
        await addDoc(messagesRef, {
          text: newMessage,
          sender: user.uid, // 현재 로그인한 사용자의 UID
          receiver: item?.uids.ownerUid, // 아이템 등록자의 UID (수정 필요한 경우)
          timestamp: serverTimestamp(),
        });
        const chatRoomRef = doc(appFireStore, 'chatRooms', chatRoomId);
        await updateDoc(chatRoomRef, {
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
        });
  
        // 사용자별 채팅방 목록 업데이트
        await updateChatRoomListForUser(user.uid, chatRoomId);
  
      } catch (error) {
        console.error("Error sending message: ", error);
      }
      setNewMessage('');
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList} ref={messagesContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.sender === user.uid ? styles.myMessage : styles.otherMessage
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
          onKeyPress={handleKeyPress}
          className={styles.inputMessage}
          disabled={loading} 
        />
        <button onClick={sendMessage} className={styles.sendMessageButton} disabled={loading}>
          {loading ? '전송 중...' : '전송'} {/* 추가: 로딩 상태에 따른 버튼 텍스트 변경 */}
        </button>
      </div>
    </div>
  );
};

export default Chat;