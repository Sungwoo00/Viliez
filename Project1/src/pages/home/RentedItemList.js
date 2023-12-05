import React from 'react';
import styles from './RentedItemList.module.css';

const RentedItemList = ({ items, currentUserDisplayName }) => {
  return (
    <ol className={styles.list}>
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
    </ol>
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
    <div className={styles.item}>
      {item.photoURL && <img src={item.photoURL} alt='Product' />}
      <strong className={styles.title}>{item.title}</strong>
      <p className={styles.price}>
        가격 : {formatPrice(item.price)}원
      </p>  
      <p className={styles.description}>{item.description}</p>
      <p>대여 시작 날짜: {formatDate(new Date(rentInfo.startDate))}</p>
      <p>대여 종료 날짜: {formatDate(endDate)}</p>
      <p>빌린 수량: {rentInfo.curRentEa}</p>
      <strong>반납 날까지 {remainingDays}일 남았습니다.</strong>
    </div>
  );
};

export default RentedItemList;