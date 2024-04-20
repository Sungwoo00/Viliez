import { useState, useRef, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import styles from "./Category.module.css";

const Sidebar = ({ onCategoryChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("카테고리 선택");
  const sidebarRef = useRef(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.container} `} ref={sidebarRef}>
      <IoMenu size={25} className={styles.icon} />
      <ul
        className={`${styles.menu} ${
          isSidebarOpen ? `${styles.menuOpen} ${styles.menuAnimation}` : ""
        }`}
      >
        <li
          onClick={() => handleOptionClick("모든 물품")}
          className={
            selectedOption === "모든 물품"
              ? `${styles.item} ${styles.active}`
              : styles.item
          }
        >
          모든 물품
        </li>
        <li
          onClick={() => handleOptionClick("가전")}
          className={
            selectedOption === "가전"
              ? `${styles.item} ${styles.active}`
              : styles.item
          }
        >
          가전
        </li>
        <li
          onClick={() => handleOptionClick("여행")}
          className={
            selectedOption === "여행"
              ? `${styles.item} ${styles.active}`
              : styles.item
          }
        >
          여행
        </li>
        <li
          onClick={() => handleOptionClick("의류")}
          className={
            selectedOption === "의류"
              ? `${styles.item} ${styles.active}`
              : styles.item
          }
        >
          의류
        </li>
        <li
          onClick={() => handleOptionClick("취미")}
          className={
            selectedOption === "취미"
              ? `${styles.item} ${styles.active}`
              : styles.item
          }
        >
          취미
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
