import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import RentedItemList from '../home/RentedItemList';
import styles from './MyItem.module.css';
import { collection, getDocs } from 'firebase/firestore';
import { appFireStore } from '../../firebase/confing';

const RentedItem = () => {
  const { user } = useAuthContext();
  const [rentedItems, setRentedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(appFireStore, 'Sharemarket'));
        const items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.curRentInfo.some(info => info.rentuser === user.displayName)) {
            items.push({ id: doc.id, ...data });
          }
        });
        setRentedItems(items);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchItems();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1>My Rented Item list</h1>
      <ul className={styles.content_list}>
        {rentedItems.length > 0 ? (
          <RentedItemList items={rentedItems} currentUserDisplayName={user.displayName} />
        ) : (
          <li>No rented items found.</li>
        )}
      </ul>
    </main>
  );
};

export default RentedItem;