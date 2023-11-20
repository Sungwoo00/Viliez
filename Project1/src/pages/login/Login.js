import { useState } from 'react';

import BarLoader from 'react-spinners/BarLoader';
import styles from './Login.module.css';
import useLogin from '../../hooks/useLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, isPending, login } = useLogin();

  const handleData = (event) => {
    if (event.target.type === 'email') {
      setEmail(event.target.value);
    } else if (event.target.type === 'password') {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <form className={styles.login_form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>로그인</legend>
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
        <div className={styles.strong_container}>
          {!isPending && (
            <button type='submit' className={styles.btn}>
              {' '}
              로그인
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
            <strong className={styles.error}>
              이메일과 비밀번호를 확인해주세요.
            </strong>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default Login;
