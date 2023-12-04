import React from 'react';
import useCollection from '../../hooks/useCollection';

const ChatRooms = () => {
  const { documents, error, isLoading } = useCollection('chatRooms');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Chat Rooms</h1>
      {documents &&
        documents.map((doc) => (
          <div key={doc.id}>
            <h2>{doc.text}</h2>
          </div>
        ))}
    </div>
  );
};

export default ChatRooms;
