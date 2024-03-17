import { useState, useRef, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { IoMenu } from 'react-icons/io5';

const Sidebar = ({ onCategoryChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('카테고리 선택');
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsSidebarOpen(false);
    onCategoryChange(option);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`${styles.container} ${
          isSidebarOpen ? styles.containerWithBorder : ''
        }`}
        ref={sidebarRef}
      >
        <div className={styles.select} onClick={toggleSidebar}>
          <IoMenu size={25} />
          <span className={styles.selected}>{selectedOption}</span>
          <div
            className={`${styles.caret} ${
              isSidebarOpen
                ? `${styles.caretRotate} ${styles.caretAnimation}`
                : ''
            }`}
          ></div>
        </div>
        <ul
          className={`${styles.menu} ${
            isSidebarOpen ? `${styles.menuOpen} ${styles.menuAnimation}` : ''
          }`}
        >
          <li
            onClick={() => handleOptionClick('모든 물품')}
            className={selectedOption === '모든 물품' ? styles.active : ''}
          >
            모든 물품
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
      </div>
    </>
  );
};

export default Sidebar;
