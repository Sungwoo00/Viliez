import React, { useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import useFirestore from '../../hooks/useFirestore';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const HomeItemList = ({ items }) => {
  const { updateDocument } = useFirestore('Sharemarket');

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (index) => {
    setSelectedItem(items[index]);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const rentHandler = () => {
    const quantityInput = document.getElementById('quantityInput');
    const quantity = parseInt(quantityInput.value, 10);
    const rentEa = selectedItem.ea - quantity;

    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      alert('Please enter a valid quantity.');
      return;
    }

    setSelectedItem({ ...selectedItem, ea: rentEa });
    updateDocument(selectedItem.id, { ea: rentEa });

    alert(`Renting ${rentEa} ${selectedItem.title}(s).`);
  };

  const chatHandler = () => {
    navigate('/chat');
  };

  return (
    <>
      {items.map((item, index) => (
        <li key={item.id} className={styles.item}>
          <strong className={styles.title}>{item.title}</strong>
          {item.ea === 0 ? (
            <h4>이 물건은{user.displayName}님이 예약 중 입니다.</h4>) : (
            <button className={styles.btn} onClick={() => openModal(index)}>
              상세 정보
            </button>
          )}
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
