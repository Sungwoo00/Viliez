import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import RentedItemHistory from './RentedItemHistory';
import styles from './RentedItem.module.css';
import { collection, getDocs } from 'firebase/firestore';
import { appFireStore } from '../../firebase/config';
import Paginate from '../../components/Paginate';

const RentedItem = () => {
  const { user } = useAuthContext();
  const [rentedItems, setRentedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rentedItems.slice(indexOfFirstItem, indexOfLastItem);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(appFireStore, 'Sharemarket'));
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if ((data.curRentInfo && data.curRentInfo.some((info) => info.rentuser === user.displayName)) || (data.returnedItems && data.returnedItems.some((info) => info.rentuser === user.displayName))) {
          items.push({ id: doc.id, ...data });
        }
      });
      setRentedItems(items);
      setTotalItemCount(items.length);
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
  }, [user /*fetchMyItems*/]);

  if (loading) {
    return <div>처리 중...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1>나의 대여 기록</h1>
      <ul className={styles.rented_list}>{rentedItems.length > 0 ? <RentedItemHistory items={currentItems} currentUserDisplayName={user.displayName} fetchItems={fetchMyItems} /> : <li>빌린 물건이 없습니다.</li>}</ul>
      <Paginate itemsPerPage={itemsPerPage} totalItems={totalItemCount} pages={paginate} currentPage={currentPage} />
    </main>
  );
};

export default RentedItem;
