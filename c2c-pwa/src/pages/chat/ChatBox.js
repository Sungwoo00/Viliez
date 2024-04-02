import React, { useState, useEffect, useRef } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { appFireStore } from "../../firebase/config";
import styles from "./Chat.module.css";

function generateChatRoomId(uid1, uid2) {
  return [uid1, uid2].sort().join("-");
}

const ChatBox = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [itemOwnerUid, setItemOwnerUid] = useState("");
  const messagesContainerRef = useRef(null);

  const { chatRoomId } = useParams();

  useEffect(() => {
    async function fetchItemInfo() {
      const itemRef = doc(appFireStore, "Sharemarket", chatRoomId);
      const docSnap = await getDoc(itemRef);

      if (docSnap.exists()) {
        // console.log("owner:", docSnap.data().uid);
        setItemOwnerUid(docSnap.data().uid);
      } else {
        console.log("No such item!");
      }
    }

    fetchItemInfo();
  }, [chatRoomId]);

  useEffect(() => {
    const messagesRef = collection(appFireStore, "messages");

    const qSender = query(
      messagesRef,
      where("chatRoomId", "==", chatRoomId),
      where("sender", "==", user.uid),
      orderBy("timestamp")
    );

    const qReceiver = query(
      messagesRef,
      where("chatRoomId", "==", chatRoomId),
      where("receiver", "==", user.uid),
      orderBy("timestamp")
    );

    let unsubscribeSender = onSnapshot(qSender, (snapshot) => {
      const senderMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages((prevMessages) => [...prevMessages, ...senderMessages]);
    });

    let unsubscribeReceiver = onSnapshot(qReceiver, (snapshot) => {
      const receiverMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages((prevMessages) => [...prevMessages, ...receiverMessages]);
    });

    return () => {
      unsubscribeSender();
      unsubscribeReceiver();
    };
  }, [chatRoomId, user.uid]);

  useEffect(() => {
    const messagesRef = collection(appFireStore, "messages");
    const CheckChatRoomId = generateChatRoomId(user.uid, itemOwnerUid);

    const q = query(
      messagesRef,
      where("wrapchatRoomId", "==", CheckChatRoomId),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [user.uid, itemOwnerUid]);

  // 메세지 전송 처리
  const sendMessage = async () => {
    if (newMessage.trim() !== "" && chatRoomId) {
      const GroupChatRoomId = generateChatRoomId(user.uid, itemOwnerUid);

      const messagesRef = collection(appFireStore, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        sender: user.uid,
        receiver: itemOwnerUid,
        wrapchatRoomId: GroupChatRoomId,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    }
  };

  //자동 스크롤
  useEffect(() => {
    messagesContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList} ref={messagesContainerRef}>
        {messages
          .filter((message) => {
            const participants = message.wrapchatRoomId.split("-");
            // const buyer = participants[0];
            // const seller = participants[1];
            return (
              participants.includes(user.uid) ||
              participants.includes(itemOwnerUid)
            );
          })
          .map((message) => (
            <div key={message.id} className={styles.messageItem}>
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
        <button onClick={sendMessage} className={styles.sendMessageButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
