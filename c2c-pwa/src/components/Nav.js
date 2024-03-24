import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext.js';
import styles from './Nav.module.css';

import logoImage from '../img/viliez.jpg';
import { IoIosLogOut } from 'react-icons/io';
import { GoHistory } from 'react-icons/go';
import { CiShop } from 'react-icons/ci';
import { LuUpload } from 'react-icons/lu';
import { FaRegUser } from 'react-icons/fa';
import { LiaHomeSolid } from 'react-icons/lia';

const Nav = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className={styles.nav_container}>
      <nav className={styles.nav}>
        <Link to='/'>
          <img src={logoImage} alt='viliez' className={styles.logo} />
        </Link>
        <ul className={styles.list_nav}>
          <li className={`${styles.iconButtonContainer} ${styles.mobileOnly}`}>
            <Link to='/'>
              <LiaHomeSolid className={styles.icon} />홈
            </Link>
          </li>
          {!user && (
            <>
              <li className={styles.iconButtonContainer}>
                <Link to='/login'>
                  <FaRegUser className={styles.icon} />
                </Link>
                <Link to='/login'>로그인/회원가입</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li className={styles.iconButtonContainer}>
                <Link to='/register'>
                  <LuUpload className={styles.icon} />
                </Link>
                <Link to='/register'>상품등록</Link>
              </li>
              <li className={styles.iconButtonContainer}>
                <Link to='/myitem'>
                  <CiShop className={styles.icon} />
                </Link>
                <Link to='/myitem'>나의상품</Link>
              </li>
              <li className={styles.iconButtonContainer}>
                <Link to='/renteditem'>
                  <GoHistory className={styles.icon} />
                </Link>
                <Link to='/renteditem'>대여기록</Link>
              </li>
              <li className={styles.iconButtonContainer}>
                <IoIosLogOut className={styles.icon} onClick={logout} />
                <button type='button' className={styles.user_delete_btn}>
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
