import React from 'react';
import styles from './ItemList.module.css';

const RentedItemList = ({ items, currentUserDisplayName }) => {
  return (
    <>
      {items.filter(item => item.curRentInfo?.some(rentInfo => rentInfo.rentuser === currentUserDisplayName))
        .map((item) => {
          const userRentInfo = item.curRentInfo.find(
            (rentInfo) => rentInfo.rentuser === currentUserDisplayName
          );
          return (
            <li key={item.id}>
              <ViewItem item={item} rentInfo={userRentInfo} />
            </li>
          );
        })}
    </>
  );
};

const ViewItem = ({ item, rentInfo }) => {
  const endDate = new Date(rentInfo.endDate);
  const currentDate = new Date();
  const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  return (
    <>
      {item.photoURL && <img src={item.photoURL} alt='Product' />}
      <strong className={styles.title}>{item.title}</strong>
      <p className={styles.price}>
        가격 : {formatPrice(item.price)}원
      </p>
      <p className={styles.description}>{item.description}</p>
      <p>Rent date: {formatDate(new Date(rentInfo.startDate))}</p>
      <p>End date: {formatDate(endDate)}</p>
      <p>Default: {rentInfo.curRentEa}</p>
      <strong>Remaining Days: {remainingDays}</strong>
    </>
  );
};

export default RentedItemList;