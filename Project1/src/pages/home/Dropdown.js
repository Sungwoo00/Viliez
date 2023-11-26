import { useState } from 'react';

import styles from './Dropdown.module.css';

const Dropdown = ({ onCategoryChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('All Items');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    onCategoryChange(option);
  };

  return (
    <>
      <div className={styles.select} onClick={toggleDropdown}>
        <span className={styles.selected}>{selectedOption}</span>
        <div
          className={`${styles.caret} ${
            isDropdownOpen
              ? `${styles.caretRotate} ${styles.caretAnimation}`
              : ''
          }`}
        ></div>
      </div>
      <ul
        className={`${styles.menu} ${
          isDropdownOpen ? `${styles.menuOpen} ${styles.menuAnimation}` : ''
        }`}
      >
        <li
          onClick={() => handleOptionClick('All Items')}
          className={selectedOption === 'All Items' ? styles.active : ''}
        >
          All Items
        </li>
        <li
          onClick={() => handleOptionClick('가전')}
          className={selectedOption === '가전' ? styles.active : ''}
        >
          가전
        </li>
        <li
          onClick={() => handleOptionClick('여행')}
          className={selectedOption === '여행' ? styles.active : ''}
        >
          여행
        </li>
        <li
          onClick={() => handleOptionClick('의류')}
          className={selectedOption === '의류' ? styles.active : ''}
        >
          의류
        </li>
        <li
          onClick={() => handleOptionClick('취미')}
          className={selectedOption === '취미' ? styles.active : ''}
        >
          취미
        </li>
      </ul>
    </>
  );
};

export default Dropdown;
