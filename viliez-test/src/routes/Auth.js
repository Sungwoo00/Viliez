import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React from 'react';
import { useState } from 'react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (event) => {
    console.log(event.target.type);
    const inputData = {
      type: event.target.type,
      value: event.target.value,
    };

    // 인풋 타입에 따라 state 값을 변경합니다.
    if (inputData.type === 'email') {
      setEmail(inputData.value);
    } else if (inputData.type === 'password') {
      setPassword(inputData.value);
    }
  };

  // 폼이 제출되면 트리거 됩니다.
  const onSubmit = (event) => {
    event.preventDefault();

    // 로그인 관련한 코드를 추가합니다.
    const auth = getAuth();
    let user;
    try {
      if (newAccount) {
        createUserWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            // Signed in
            console.log(userCredential.user);
          }
        );
      } else {
        signInWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            // Signed in
            console.log((user = userCredential.user));
            // ...
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>로그인 페이지입니다.</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>이메일 : </label>
          <input
            type='email'
            value={email}
            onChange={onChange}
            required
          ></input>
        </div>
        <div>
          <label>비밀번호 : </label>
          <input
            type='password'
            value={password}
            onChange={onChange}
            required
          ></input>
        </div>
        <button type='submit'>{newAccount ? '회원가입하기' : '로그인'}</button>
      </form>
    </>
  );
};

export default Auth;
