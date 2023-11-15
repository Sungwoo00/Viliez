import React, { useState } from 'react';
import styles from './Home.module.css';

const HomeItemList = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (index) => {
    setSelectedItem(items[index]);
  };

  const closeModal = () => {
    setSelectedItem(null);
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
              <p className={styles.price}>{selectedItem.price}</p>
              <p className={styles.ea}>{selectedItem.ea} 개</p>
              <p className={styles.description}>{selectedItem.description}</p>
            </div>
            <button className={styles.closeBtn} onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeItemList;
