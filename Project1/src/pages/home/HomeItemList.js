import React, { useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import useFirestore from '../../hooks/useFirestore';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDatePicker from './CustomDatePicker';

const HomeItemList = ({ items, selectedCategory }) => {
  const { updateDocument } = useFirestore('Sharemarket');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: null,
    endDate: null,
  });

  const openModal = (index) => setSelectedItem(items[index]);
  const openChat = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const openDatePicker = () => setDatePickerOpen(true);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setRentalPeriod({ startDate: start, endDate: end });

    if (start && end) {
      setDatePickerOpen(false);
    }
  };

  const rentHandler = () => {
    const quantity = parseInt(
      document.getElementById('quantityInput').value,
      10
    );
    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      alert('유효한 값을 입력하세요.');
      return;
    }

    const curRentInfo = selectedItem.curRentInfo || [];

    const updatedItem = {
      ...selectedItem,
      ea: selectedItem.ea - quantity,
      rentuser: user.displayName,
      totalRentEa:
        curRentInfo.reduce((sum, rentInfo) => sum + rentInfo.curRentEa, 0) +
        quantity,
      curRentInfo: [
        ...curRentInfo,
        {
          rentuser: user.displayName,
          curRentEa: quantity,
          startDate: rentalPeriod.startDate
            ? rentalPeriod.startDate.toISOString().split('T')[0]
            : null,
          endDate: rentalPeriod.endDate
            ? rentalPeriod.endDate.toISOString().split('T')[0]
            : null,
        },
      ],
    };

    setSelectedItem(updatedItem);
    updateDocument(selectedItem.id, updatedItem);
    alert(`${selectedItem.title}을 성공적으로 빌리셨습니다.`);
    closeModal();
  };

  const chatHandler = (item) => {
    if (!user) {
      navigate('/login');
    } else {
      const chatRoomId = `${item.id}`;
      openChat(item);
      navigate(`/chat/${chatRoomId}`);
      closeModal();
    }
  };

  const renderListItem = (item, index) => {
    if (
      selectedCategory !== 'All Items' &&
      item.category !== selectedCategory
    ) {
      return null;
    }

    const nearestEndDate = item.curRentInfo
      ? item.curRentInfo.reduce((nearestDate, rentInfo) => {
          if (!nearestDate) return rentInfo.endDate;
          const currentDate = new Date();
          const nearestDateDiff = Math.abs(new Date(nearestDate) - currentDate);
          const rentInfoDateDiff = Math.abs(
            new Date(rentInfo.endDate) - currentDate
          );
          return rentInfoDateDiff < nearestDateDiff
            ? rentInfo.endDate
            : nearestDate;
        }, null)
      : null;

    return (
      <li key={item.id} className={styles.item}>
        <strong className={styles.title}>{item.title}</strong>
        <p>
          남은 수량: {item.ea} 개 (
          {item.ea !== 0 ? '대여 가능' : '모두 대여 중'})
        </p>
        {nearestEndDate ? (
          <p>{`가장 빠른 예약 가능 날짜:${nearestEndDate}`}</p>
        ) : (
          <p>예약 가능한 날짜 정보가 없습니다.</p>
        )}
        <p>{`가격: ${item.price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>
        {/* {item.curRentInfo?.length > 0 &&
          item.curRentInfo.map((rentInfo, rentIndex) => (
            <h4 key={rentIndex}>
              {`이 물건은 [${rentInfo.rentuser}]님이 [${rentInfo.curRentEa}]개 대여 중입니다.`}
            </h4>
          ))} */}
        <div className={styles.home_btn_container}>
          <img src={item.photoURL}></img>
          <button className={styles.btn} onClick={() => openModal(index)}>
            상세 정보
          </button>
          <button
            type='button'
            className={styles.btn}
            onClick={() => chatHandler(item)}
          >
            채팅하기
          </button>
        </div>
      </li>
    );
  };

  const renderModal = () => (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p>{`[${selectedItem.displayName}]님의 ${selectedItem.title}`}</p>
        <p>{`가격: ${selectedItem.price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>
        <p>{`${selectedItem.ea} 개`}</p>
        <p>{selectedItem.description}</p>
        {user && (
          <>
            {/* <button
                type='button'
                className={styles.closeBtn}
                onClick={chatHandler}
              >
                채팅하기
              </button> */}
            {/* <div className="date">날짜 선택</div> */}
            <div className='ReactDatePicker'>
              <CustomDatePicker
                startDate={rentalPeriod.startDate}
                endDate={rentalPeriod.endDate}
                handleDateChange={handleDateChange}
                isDatePickerOpen={isDatePickerOpen}
                openDatePicker={openDatePicker}
              />
            </div>
            <input
              // className='Eainput'
              laceholder='0'
              id='quantityInput'
              type='number'
              min='1'
              max={selectedItem.ea}
              onClick={(e) => e.stopPropagation()}
            />
            <div>
              <button
                type='button'
                className={styles.rentBtn}
                onClick={rentHandler}
              >
                빌리기
              </button>
            </div>
          </>
        )}
        <button type='button' className={styles.closeBtn} onClick={closeModal}>
          닫기
        </button>
      </div>
    </div>
  );

  return (
    <>
      {items.map(renderListItem)}
      {selectedItem && renderModal()}
    </>
  );
};

export default HomeItemList;
