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
    const messagesContainerRef = useRef(null);

    const { chatRoomId } = useParams();

    useEffect(() => {
        const fetchChatRoom = async () => {
            if (!chatRoomId) return;
            const chatRoomRef = doc(appFireStore, 'chatRooms', chatRoomId);
            const chatRoomSnap = await getDoc(chatRoomRef);

            if (chatRoomSnap.exists()) {
                // 여기서 정보 더 가져올 수 있음
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
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="메세지를 입력하세요."
                    onKeyPress={handleKeyPress}
                    className={styles.inputMessage}
                />
                <button
                    onClick={sendMessage}
                    className={styles.sendMessageButton}
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
