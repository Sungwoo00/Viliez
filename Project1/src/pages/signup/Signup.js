import { useState } from 'react';

import BarLoader from 'react-spinners/BarLoader';
import styles from './Signup.module.css';
import useSignup from '../../hooks/useSignup';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { error, isPending, signup } = useSignup();

  const handleData = (event) => {
    if (event.target.id === 'myEmail') {
      setEmail(event.target.value);
    } else if (event.target.id === 'myPassword') {
      setPassword(event.target.value);
    } else if (event.target.id === 'myNickName') {
      setDisplayName(event.target.value);
    } else if (event.target.id === 'myPassword2') {
      setPassword2(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== password2) {
      signup(email, password, displayName, 'password-mismatch');
      return;
    }

    signup(email, password, displayName);
  };

  const getErrorMsg = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 주소입니다.';
      case 'auth/email-already-in-use':
        return '이미 사용 중인 이메일 주소입니다.';
      case 'auth/weak-password':
        return '비밀번호는 6자 이상 입력하세요.';
      case 'password-mismatch':
        return '비밀번호가 일치하지 않습니다.';
      default:
        return '회원가입 중 오류가 발생했습니다.';
    }
  };

  return (
    <form className={styles.signup_form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>회원가입</legend>
        <div className={styles.input_box}>
          <input
            type='email'
            id='myEmail'
            required
            value={email}
            onChange={handleData}
          />
          <label htmlFor='myEmail'>email</label>
        </div>
        <div className={styles.input_box}>
          <input
            type='password'
            id='myPassword'
            required
            value={password}
            onChange={handleData}
          />
          <label htmlFor='myPassword'>password</label>
        </div>

        <div className={styles.input_box}>
          <input
            type='password'
            id='myPassword2'
            required
            value={password2}
            onChange={handleData}
          />
          <label htmlFor='myPassword2'>password2</label>
        </div>

        <div className={styles.input_box}>
          <input
            type='text'
            id='myNickName'
            required
            value={displayName}
            onChange={handleData}
          />
          <label htmlFor='myNickName'>Nickname</label>
        </div>
        <div className={styles.strong_container}>
          {!isPending && (
            <button type='submit' className={styles.btn}>
              회원가입
            </button>
          )}

          {isPending && (
            <BarLoader
              color='#136CE1'
              cssOverride={{}}
              height={5}
              speedMultiplier={1}
              width={360}
            />
          )}
          {error && (
            <strong className={styles.error}>{getErrorMsg(error)}</strong>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default Signup;
