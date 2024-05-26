import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { appFireStore } from '../../firebase/config';
import styles from './Chat.module.css';

const ChatList = () => {
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

            loadedChatRooms.forEach((chatRoom) => {
                console.log('Chat Room ID:', chatRoom.id);
            });
        });

        return () => unsubscribe();
    }, [user]);

    const handleChatRoomClick = (id) => {
        navigate(`/chat/${id}`);
    };

    return (
        <div className={styles.chatRoomsList}>
            {chatRooms.map((chatRoom) => (
                <div
                    key={chatRoom.id}
                    onClick={() => handleChatRoomClick(chatRoom.id)}
                    className={styles.chatRoomItem}
                >
                    {chatRoom.id}
                </div>
            ))}
        </div>
    );
};

export default ChatList;
