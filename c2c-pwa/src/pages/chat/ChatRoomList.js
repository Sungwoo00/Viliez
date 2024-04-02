import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { appFireStore } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";

const ChatRoomList = () => {
  const { user } = useAuthContext();
  const [chatRooms, setChatRooms] = useState([]);

  // 사용자가 참여하고 있는 채팅방 목록을 불러오는 useEffect
  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!user?.uid) return; // user.uid가 없는 경우 early return 처리

      const chatRoomsRef = collection(appFireStore, "chatRooms");
      const q = query(
        chatRoomsRef,
        where("participants", "array-contains", user.uid)
      );
      const querySnapshot = await getDocs(q);

      const rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChatRooms(rooms);
    };

    fetchChatRooms();
  }, [user.uid]);

  return (
    <div>
      {chatRooms.map((room) => (
        <div key={room.id}>
          {/* 각 채팅방을 나타내는 블록. 필요에 따라 디자인을 추가할 수 있습니다. */}
          <p>{room.name || "채팅방 이름 없음"}</p>
          {/* 'room.name'은  각 채팅방의 이름을 표시합니다. 실제 사용시 적절한 필드로 대체해야 합니다. */}
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
