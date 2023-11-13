import { useState } from 'react';

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
        {!isPending && (
          <button type='submit' className={styles.btn}>
            {' '}
            로그인
          </button>
        )}
        {isPending && <strong>로그인 진행중 ... </strong>}
        {error && <strong>{error}</strong>}
      </fieldset>
    </form>
  );
};

export default Login;
