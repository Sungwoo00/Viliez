import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import RentedItemList from './RentedItemList';
import styles from './RentedItem.module.css';
import { collection, getDocs } from 'firebase/firestore';
import { appFireStore } from '../../firebase/confing';

const RentedItem = () => {
  const { user } = useAuthContext();
  const [rentedItems, setRentedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(appFireStore, 'Sharemarket'));
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if ((data.curRentInfo && data.curRentInfo.some(info => info.rentuser === user.displayName)) ||
          (data.returnedItems && data.returnedItems.some(info => info.rentuser === user.displayName))) {
          items.push({ id: doc.id, ...data });
        }
      });
      setRentedItems(items);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [user, fetchMyItems]);

  if (loading) {
    return <div>처리 중...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1>My Rented Item list</h1>
      <ul className={styles.Rented_list}>
        {rentedItems.length > 0 ? (
          <RentedItemList items={rentedItems} currentUserDisplayName={user.displayName} fetchItems={fetchMyItems} />
        ) : (
          <li>빌린 물건이 없습니다.</li>
        )}
      </ul>
    </main>
  );
};

export default RentedItem;