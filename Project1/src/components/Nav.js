import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext.js';

import styles from './Nav.module.css';

const Nav = () => {
  const { logout, userDelete } = useLogout();
  const { user } = useAuthContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setSelectedOption] = useState('My Page');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <body>
      <nav className={styles.nav}>
        <h1 className={styles.tit}>
          <Link to='/'>C2C Share Market</Link>
        </h1>
        <ul className={styles.list_nav}>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to='/login'>Login</Link>
              </li>
              <li>
                <Link to='/signup'>Sign</Link>
              </li>
            </>
          )}
          {user && (
            <>
              {/* <li>
                <Link to='/chat'>Chat</Link>
              </li> */}
              <li>
                <Link to='/chatlist'>ChatList</Link>
              </li>
              <li>
                <Link to='/myitem'>Register</Link>
              </li>

              <div className={styles.select} onClick={toggleDropdown}>
                <span className={styles.selected} onClick={toggleDropdown}>
                  My Page
                </span>
                <ul
                  className={`${styles.menu} ${
                    isDropdownOpen
                      ? `${styles.menuOpen} ${styles.menuAnimation}`
                      : ''
                  }`}
                >
                  <li>
                    <Link to='/myitem2'>My Item</Link>
                  </li>
                  <li onClick={() => handleOptionClick('로그아웃')}>
                    <button type='button' onClick={logout}>
                      로그아웃
                    </button>
                  </li>
                  <li onClick={() => handleOptionClick('회원탈퇴')}>
                    <button
                      type='button'
                      className={styles.user_delete_btn}
                      onClick={userDelete}
                    >
                      회원탈퇴
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </ul>
      </nav>
    </body>
  );
};
export default Nav;
