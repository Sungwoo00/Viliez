import { useState } from 'react';

import styles from './Dropdown.module.css';

const Dropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('All Items');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
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
          onClick={() => handleOptionClick('Option 1')}
          className={selectedOption === 'Option 1' ? styles.active : ''}
        >
          Option 1
        </li>
        <li
          onClick={() => handleOptionClick('Option 2')}
          className={selectedOption === 'Option 2' ? styles.active : ''}
        >
          Option 2
        </li>
        <li
          onClick={() => handleOptionClick('Option 3')}
          className={selectedOption === 'Option 3' ? styles.active : ''}
        >
          Option 3
        </li>
        <li
          onClick={() => handleOptionClick('Option 4')}
          className={selectedOption === 'Option 4' ? styles.active : ''}
        >
          Option 4
        </li>
      </ul>
    </>
  );
};

export default Dropdown;
