import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext.js';
import styles from './Nav.module.css';

const Nav = () => {
  const { logout, userDelete } = useLogout();
  const { user } = useAuthContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setSelectedOption] = useState('My Page');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.nav}>
      <h2 className={styles.tit}>
        <Link to='/'>C2C 공유 상점</Link>
      </h2>
      <ul className={styles.list_nav}>
        {/* <li>
          <Link to='/'>홈</Link>
        </li> */}
        {!user && (
          <>
            <li>
              <Link to='/login'>로그인/회원가입</Link>
            </li>
          </>
        )}
        {user && (
          <>
            {/* <li>
                <Link to='/chat'>Chat</Link>
              </li> */}
            {/* <li>
                <Link to='/chatlist'>ChatList</Link>
              </li> */}
            <li>
              <Link to='/register'>상품등록</Link>
            </li>

            <li>
              <Link to='/myitem'>나의상품</Link>
            </li>
            <li>
              <Link to='/renteditem'>대여기록</Link>
            </li>
            <li onClick={() => handleOptionClick('로그아웃')}>
              <button
                type='button'
                className={styles.user_delete_btn}
                onClick={logout}
              >
                로그아웃
              </button>
            </li>
            {/* <li onClick={() => handleOptionClick('회원탈퇴')}>
              <button
                type='button'
                className={styles.user_delete_btn}
                onClick={userDelete}
              >
                회원탈퇴
              </button>
            </li> */}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
