import React, { useState } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const HomeItemList = ({ items }) => {
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

    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      alert('Please enter a valid quantity.');
      return;
    }

    // Now you can perform the rental logic with the selected quantity
    alert(`Renting ${quantity} ${selectedItem.title}(s).`);
  };

  const chatHandler = () => {
    navigate('/chat');
  };

  return (
    <>
      {items.map((item, index) => (
        <li key={item.id} className={styles.item}>
          <strong className={styles.title}>{item.title}</strong>
          <button className={styles.btn} onClick={() => openModal(index)}>
            상세정보
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
                  id='quantityInput'
                  type='number'
                  min='1'
                  max={selectedItem.ea}
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
