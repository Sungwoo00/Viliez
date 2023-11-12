import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext.js';

import styles from './Nav.module.css';

const Nav = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <nav className={styles.nav}>
      <h1 className={styles.tit}>C2C Share Market</h1>
      <ul className={styles.list_nav}>
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
            <strong>{user.displayName}님 환영합니다 !</strong>
            <li>
              <Link to='/mypage'>마이페이지</Link>
            </li>
            <li>
              <button type='button' onClick={logout}>
                로그아웃
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
