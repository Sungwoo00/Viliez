import React, { useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import useFirestore from '../../hooks/useFirestore';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HomeItemList = ({ items }) => {
  const { updateDocument } = useFirestore('Sharemarket');
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: new Date(),
    endDate: null,
  });

  const openModal = (index) => setSelectedItem(items[index]);
  const openChat = (item) => setSelectedItem(item);
  const closeModal = () => {
    if (!isDatePickerOpen) {
      setSelectedItem(null);
    }
  };
  const openDatePicker = () => setDatePickerOpen(true);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setRentalPeriod({ startDate: start, endDate: end });
  
    if (start && end) {
      setDatePickerOpen(false);
    }
  };

  const rentHandler = () => {
    const quantity = parseInt(document.getElementById('quantityInput').value, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      alert('Please enter a valid quantity.');
      return;
    }

    const curRentInfo = selectedItem.curRentInfo || [];

    const updatedItem = {
      ...selectedItem,
      ea: selectedItem.ea - quantity,
      rentuser: user.displayName,
      totalRentEa: curRentInfo.reduce((sum, rentInfo) => sum + rentInfo.curRentEa, 0) + quantity,
      curRentInfo: [
        ...curRentInfo,
        {
          rentuser: user.displayName,
          curRentEa: quantity,
          startDate: rentalPeriod.startDate ? rentalPeriod.startDate.toISOString().split('T')[0] : null,
          endDate: rentalPeriod.endDate ? rentalPeriod.endDate.toISOString().split('T')[0] : null
        }
      ]
    };
    
    setSelectedItem(updatedItem);
    updateDocument(selectedItem.id, updatedItem);
    alert(`Renting ${updatedItem.ea} ${selectedItem.title}(s).`);
  };

  const chatHandler = (item) => {
    openChat(item);
    navigate(`/chat/${item.id}`);
  };

  const renderListItem = (item, index) => (
    <li key={item.id} className={styles.item}>
      <strong className={styles.title}>{item.title}</strong>
      <p>남은 수량: {item.ea} 개 ({item.ea !== 0 ?
        '대여 가능' : '모두 대여 중'})
      </p>
      <p>{`가격: ${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>
      {item.curRentInfo?.length > 0 && item.curRentInfo.map((rentInfo, rentIndex) => (
        <h4
          key={rentIndex}>
          {`이 물건은 [${rentInfo.rentuser}]님이 [${rentInfo.curRentEa}]개 대여 중입니다.`}
        </h4>
      ))}
      <img src={item.photoURL}></img>
      <button
        className={styles.btn}
        onClick={() => openModal(index)}>
        상세 정보
      </button>
      <button
        type='button'
        className={styles.btn}
        onClick={() => chatHandler(item)}>
        채팅하기
      </button>
    </li>
  );

  const renderModal = () => (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modal}>
        <div>
          <p>{`${selectedItem.displayName}님의 ${selectedItem.title}`}</p>
          <p>{`가격: ${selectedItem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>
          <p>{`${selectedItem.ea} 개`}</p>
          <p>{selectedItem.description}</p>
          {user && (
            <>
              <button
                type='button'
                className={styles.closeBtn}
                onClick={chatHandler}>채팅하기
              </button>
              <input
                laceholder='개수를 선택해주세요'
                id='quantityInput'
                type='number' min='1'
                max={selectedItem.ea}
                onClick={(e) => e.stopPropagation()}
              />
              <ReactDatePicker
                selectsRange
                startDate={rentalPeriod.startDate}
                endDate={rentalPeriod.endDate}
                onChange={handleDateChange}
                shouldCloseOnSelect={false}
                monthsShown={2}
                dateFormat='yyyy년 MM월 dd일'
                minDate={new Date()}
                open={isDatePickerOpen}
                onInputClick={openDatePicker}
              />
              <button
                type='button'
                className={styles.closeBtn}
                onClick={rentHandler}
              >
                빌리기
              </button>
            </>
          )}
          <button
            type='button'
            className={styles.closeBtn}
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
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