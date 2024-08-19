import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import useDelete from '../../hooks/useDelete';
import { getAuth, updateProfile, updatePassword, signOut } from 'firebase/auth';
import { CiShop } from 'react-icons/ci';
import { GoHeart, GoHistory } from 'react-icons/go';
import { LiaUserEditSolid } from 'react-icons/lia';

import styles from './MyPage.module.css';
import { toast } from 'react-toastify';

const MyPage = () => {
  const { userDelete } = useDelete();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSaveNickname = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updateProfile(user, {
        displayName: nickname,
      })
        .then(() => {
          toast.success('이름이 변경되었습니다!');
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error('Error updating nickname:', error);
        });
    } else console.log('No user');
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          toast.success('비밀번호가 변경되었습니다. 다시 로그인을 해주세요.');
          signOut(auth).then(() => {
            setIsModalOpen(false);
            navigate('/login');
          });
        })
        .catch((error) => {
          console.error('Error updating password:', error);
        });
    } else {
      console.log('No user');
    }
  };

  const handleCloseModal = () => {
    setNickname('');
    setNewPassword('');
    setConfirmPassword('');
    setIsModalOpen(false);
  };

  return (
    <div className={styles.mypage_container}>
      <Link to="/myitem" className={`${styles.section} ${styles.border_right}`}>
        <CiShop size={70} />
        <span>나의상품</span>
      </Link>
      <Link
        to="/renteditem"
        className={`${styles.section} ${styles.border_right}`}
      >
        <GoHistory size={60} />
        <span>나의기록</span>
      </Link>
      <Link
        to="/likeitem"
        className={`${styles.section} ${styles.border_right}`}
      >
        <GoHeart size={60} />
        <span>찜한상품</span>
      </Link>
      <div className={styles.section} onClick={() => setIsModalOpen(true)}>
        <LiaUserEditSolid size={60} />
        <span>개인정보수정</span>
      </div>

      <Modal isOpen={isModalOpen} closeModal={handleCloseModal}>
        <div className={styles.modal_content}>
          <h2>개인정보 수정</h2>
          <div>
            <label>닉네임 변경:</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요."
              className={styles.input_field}
              value={nickname}
              onChange={handleNicknameChange}
            />
            <button className={styles.button} onClick={handleSaveNickname}>
              저장
            </button>
          </div>
          <div>
            <label>비밀번호 재설정:</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요."
              className={styles.input_field}
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <input
              type="password"
              placeholder="비밀번호를 확인"
              className={styles.input_field}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button className={styles.button} onClick={handleSavePassword}>
              저장
            </button>
          </div>
          <div className={styles.kkk}>
            <button className={styles.delete_button} onClick={userDelete}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPage;
