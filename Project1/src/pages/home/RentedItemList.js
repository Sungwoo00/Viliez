import React from 'react';
import styles from './ItemList.module.css';

const RentedItemList = ({ items, currentUserDisplayName }) => {
  return (
    <>
      {items.map((item) => {
        // 현재 로그인한 사용자가 rentuser인지 확인
        const userRentInfo = item.curRentInfo?.find(
          (rentInfo) => rentInfo.rentuser === currentUserDisplayName
        );

        // 사용자가 rentuser인 아이템만 표시
        if (userRentInfo) {
          return (
            <li key={item.id}>
              <ViewItem item={item} rentInfo={userRentInfo} />
            </li>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

const ViewItem = ({ item, rentInfo }) => {
  const endDate = new Date(rentInfo.endDate);
  const currentDate = new Date();
  const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

  return (
    <>
      {item.photoURL && <img src={item.photoURL} alt='Product' />}

      <strong className={styles.title}>{item.title}</strong>
      <p className={styles.price}>
        가격 : {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
      </p>
      <p className={styles.description}>{item.description}</p>

      <p>대여 시작 날짜: {rentInfo.startDate}</p>
      <p>대여 종료 날짜: {rentInfo.endDate}</p>
      <p>대여 수량: {rentInfo.curRentEa}</p>

      <strong>남은 대여 기간: {remainingDays}일</strong>
    </>
  );
};

export default RentedItemList;