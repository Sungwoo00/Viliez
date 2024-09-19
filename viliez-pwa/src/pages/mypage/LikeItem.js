import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';

import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { appFireStore } from '../../firebase/config';
import styles from './LikeItem.module.css';
import { useNavigate } from 'react-router-dom';

const LikeItem = () => {
  const { user } = useAuthContext();
  const [likedItems, setLikedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (user) {
        try {
          const favoritesCollectionRef = collection(
            appFireStore,
            'users',
            user.uid,
            'favorites'
          );
          const snapshot = await getDocs(favoritesCollectionRef);

          const likedItemsData = await Promise.all(
            snapshot.docs.map(async (favoriteDoc) => {
              const itemDocRef = doc(
                appFireStore,
                'Sharemarket',
                favoriteDoc.id
              );
              const itemSnapshot = await getDoc(itemDocRef);

              if (itemSnapshot.exists()) {
                return { id: itemSnapshot.id, ...itemSnapshot.data() };
              } else {
                console.error(`Item with id ${favoriteDoc.id} does not exist.`);
                await deleteDoc(favoriteDoc.ref);
                return null;
              }
            })
          );

          setLikedItems(likedItemsData.filter((item) => item !== null));
        } catch (error) {
          console.error('Error fetching liked items: ', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setLikedItems([]);
        setIsLoading(false);
      }
    };

    fetchLikedItems();
  }, [user]);

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className={styles.LikeItemBox}>
      <h1>
        <br className={styles.brHide} />
        <br className={styles.brHide} />
        <br className={styles.brHide} />
        찜한 상품
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : likedItems.length > 0 ? (
        <ul className={styles.list}>
          {likedItems.map((item) => (
            <li
              key={item.id}
              className={styles.item}
              onClick={() => handleItemClick(item.id)}
            >
              <img
                src={item.photoURLs}
                alt={item.title}
                className={styles.image}
              />
              <div className={styles.details}>
                <h2 className={styles.title}>{item.title}</h2>
                <p className={styles.price}>{`시간당 대여 비용: ${item.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>
                <p className={styles.amount}>{`남은 수량: ${item.ea} 개`}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>찜한 상품이 없습니다.</p>
      )}
    </div>
  );
};

export default LikeItem;
