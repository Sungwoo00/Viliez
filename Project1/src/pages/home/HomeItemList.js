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

  const openModal = (index) => {
    setSelectedItem(items[index]);
  };

  const openChat = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const rentHandler = () => {
    const quantityInput = document.getElementById('quantityInput');
    const quantity = parseInt(quantityInput.value, 10);
    const rentEa = selectedItem.ea - quantity;
    const totalRentEa = (selectedItem.curRentInfo || []).reduce((sum, rentInfo) => sum + rentInfo.curRentEa, 0) + quantity;

    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      alert('Please enter a valid quantity.');
      return;
    }

    setSelectedItem({
      ...selectedItem,
      ea: selectedItem.ea - quantity,
      rentuser: user.displayName,
      totalRentEa: totalRentEa,
      curRentInfo: [...(selectedItem.curRentInfo || []), { rentuser: user.displayName, curRentEa: quantity }]
    });

    updateDocument(selectedItem.id, {
      ea: rentEa,
      rentuser: user.displayName,
      totalRentEa: totalRentEa,
      curRentInfo: [...(selectedItem.curRentInfo || []), { rentuser: user.displayName, curRentEa: quantity }]
    });

    alert(`Renting ${rentEa} ${selectedItem.title}(s).`);
  };

  const chatHandler = (item) => {
    openChat(item);
    navigate(`/chat/${item.id}`);
  };

  return (
    <>
      {items.map((item, index) => (
        <li key={item.id} className={styles.item}>
          <strong className={styles.title}>{item.title}</strong>
          {item.ea !== 0 ? (
            <p>대여 가능</p>
          ) : (
            <p>모두 대여 중</p>
          )}
          <p>
            {'가격: ' + item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +'원'}
          </p>
          {item.curRentInfo && item.curRentInfo.length > 0 && item.curRentInfo.map((rentInfo, rentIndex) => (
            <h4 key={rentIndex}>
              이 물건은 [{rentInfo.rentuser}]님이 [{rentInfo.curRentEa}]개 대여 중입니다.
            </h4>
          ))}

          {item.ea > 0 && (
            <button className={styles.btn} onClick={() => openModal(index)}>
              상세 정보
            </button>
          )}

          <button
            type='button'
            className={styles.btn}
            onClick={() => chatHandler(item)}
          >
            채팅하기
          </button>
        </li>
      ))}

      {selectedItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal}>
            <div>
              <p>
                {selectedItem.displayName}님의 {selectedItem.title}
              </p>
              {/* <p className={styles.category}>{selectedItem.category}</p> */}
              <p className={styles.price}>
                {selectedItem.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                원
              </p>
              <p className={styles.ea}>{selectedItem.ea} 개</p>
              <p className={styles.description}>{selectedItem.description}</p>
            </div>
            {user && (
              <>
                <button
                  type='button'
                  className={styles.closeBtn}
                  onClick={chatHandler}
                >
                  채팅하기
                </button>
                <input
                  placeholder='개수를 선택해주세요'
                  id='quantityInput'
                  type='number'
                  min='1'
                  max={selectedItem.ea}
                  onClick={(e) => e.stopPropagation()}
                />
                {/* 달력 추가 */}
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
      )}
    </>
  );
};

export default HomeItemList;
