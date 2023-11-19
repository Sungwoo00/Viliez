import React, { useState } from 'react'; // useState를 임포트합니다.
import HomeItemList from './HomeItemList';
import styles from './Home.module.css';
import useCollection from '../../hooks/useCollection';
import SyncLoader from "react-spinners/SyncLoader"; 

const Home = () => {
  const { documents, error, isLoading } = useCollection('Sharemarket');

  return (
    <div className={styles.container}>
      <h1>All Item</h1>
      <ul className={styles.content_list}>
        {error && <strong>{error}</strong>}

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>물건을 가져오는 중..</p>
            <SyncLoader
              color='#136CE1  '
              margin ='2'
              loading={isLoading} 
              size={10}
            /> 
          </div>
        ) : (
          documents && documents.map(item => (
            <li key={item.id}>{item.title}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
