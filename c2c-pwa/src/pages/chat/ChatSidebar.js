import React from 'react';
import useCollection from '../../hooks/useCollection';
import SyncLoader from 'react-spinners/SyncLoader';

const ChatRooms = () => {
  const { error, isLoading } = useCollection('chatRooms');

  return (
    <>
      {error && <strong>{error}</strong>}
      {isLoading && (
        <div
          style={{
            fontSize: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            marginTop: '20px',
          }}
        >
          <h2>잠시만 기다려주세요..</h2>
          <SyncLoader
            color='#136CE1'
            margin='2'
            loading={isLoading}
            size={17}
          />
        </div>
      )}
    </>
  );
};

export default ChatRooms;
