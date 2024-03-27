import React from 'react';
import styles from './Modal.module.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal}>
        <button className={styles.close_button} onClick={closeModal}>
          <IoIosCloseCircleOutline size={25} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
