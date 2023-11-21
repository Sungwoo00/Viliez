import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext.js';

import styles from './Nav.module.css';

const Nav = () => {
  const { logout, userDelete } = useLogout();
  const { user } = useAuthContext();

  return (
    <body>
      <nav className={styles.nav}>
        <h1 className={styles.tit}>
          <Link to='/'>C2C Share Market</Link>
        </h1>
        <ul className={styles.list_nav}>
          <li>
            <Link to='/'>홈</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to='/login'>로그인</Link>
              </li>
              <li>
                <Link to='/signup'>가입하기</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link to='/chat'>채팅</Link>
              </li>
              <li>
                <Link to='/myitem'>나의 상품</Link>
              </li>
              <li>
                <button type='button' onClick={logout}>
                  로그아웃
                </button>
              </li>
              <li>
                <button type='button' onClick={userDelete}>
                  회원탈퇴
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </body>
  );
};

export default Nav;
