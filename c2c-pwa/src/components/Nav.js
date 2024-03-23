import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext.js';
import styles from './Nav.module.css';

const Nav = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className={styles.nav_container}>
      <nav className={styles.nav}>
        <h2 className={styles.tit}>
          <Link to='/'>C2C 공유 상점</Link>
        </h2>
        <ul className={styles.list_nav}>
          {!user && (
            <>
              <li>
                <Link to='/login'>로그인/회원가입</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link to='/register'>상품등록</Link>
              </li>
              <li>
                <Link to='/myitem'>나의상품</Link>
              </li>
              <li>
                <Link to='/renteditem'>대여기록</Link>
              </li>
              <li>
                <button
                  type='button'
                  className={styles.user_delete_btn}
                  onClick={logout}
                >
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
