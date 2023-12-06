import React from 'react';
import styles from './RentedItemList.module.css';
import useFirestore from '../../hooks/useFirestore';

const RentedItemList = ({ items, currentUserDisplayName, fetchItems }) => {
  return (
    <>
      {items.flatMap(item => 
        item.curRentInfo
          ?.filter(rentInfo => rentInfo.rentuser === currentUserDisplayName)
          .map(rentInfo => (
            <li className={styles.RentedItemList} key={`${item.id}-${rentInfo.startDate}`}>
              <ViewItem item={item} rentInfo={rentInfo} currentUserDisplayName={currentUserDisplayName} fetchItems={fetchItems}/>
            </li>
          ))
      )}
    </>
  );
};

const ViewItem = ({ item, rentInfo, currentUserDisplayName, fetchItems }) => {
  const endDate = new Date(rentInfo.endDate);
  const currentDate = new Date();
  const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const { updateDocument } = useFirestore('Sharemarket');

  const handleReturn = async (itemId, rentInfo) => {
    const confirmReturn = window.confirm("미리 반납 하시겠습니까?");
    if (confirmReturn) {
      console.log("반납 처리가 시작됩니다.");
  
      const updatedQuantity = item.ea + rentInfo.curRentEa;
      const rentIdentifier = `${rentInfo.startDate}-${rentInfo.endDate}`;
      const updatedCurRentInfo = item.curRentInfo.filter(
        (info) => `${info.startDate}-${info.endDate}` !== rentIdentifier
      );
      const updatedReturnedItems = item.returnedItems ? [...item.returnedItems, rentInfo] : [rentInfo];
      const updatedItemInfo = {
        ...item,
        ea: updatedQuantity,
        curRentInfo: updatedCurRentInfo,
        returnedItems: updatedReturnedItems
      };
  
      try {
        await updateDocument(itemId, updatedItemInfo);
        console.log("반납 처리가 완료되었습니다.");
        fetchItems(); 
      } catch (error) {
        console.error("반납 처리 중 오류 발생: ", error);
      }
    }
  };
  
  return (
    <div className={styles.item}>
      {item.photoURL && <img src={item.photoURL} alt='Product' />}
      <strong className={styles.title}>{item.title}</strong>
      <p className={styles.price}>대여 비용: {formatPrice(item.price)}원</p>
      <p className={styles.description}>{item.description}</p>
      <p>대여 시작 날짜: {formatDate(new Date(rentInfo.startDate))}</p>
      <p>대여 종료 날짜: {formatDate(endDate)}</p>
      <p>대여 수량: {rentInfo.curRentEa}</p>

      {item.returnedInfo ? (
        <strong>이 물품은 반납이 완료된 물품입니다.</strong>
      ) : (
        <strong>반납까지 {remainingDays}일 남았습니다. </strong>
      )}

      {!item.returnedInfo && (
        <button onClick={() => handleReturn(item.id, rentInfo)} className={styles.returnButton}>반납하기</button>
      )}
    </div>
  );
};

export default RentedItemList;