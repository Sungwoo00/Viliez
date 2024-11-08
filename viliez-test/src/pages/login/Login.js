import { useState } from "react";

import BarLoader from "react-spinners/BarLoader";
import styles from "./Login.module.css";
import useLogin from "../../hooks/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isPending, login } = useLogin();

  const handleData = (event) => {
    if (event.target.type === "email") {
      setEmail(event.target.value);
    } else if (event.target.type === "password") {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <form className={styles.login_form} onSubmit={handleSubmit}>
      <div style={{ borderBottom: "1px solid black", paddingBottom: "24px" }}>
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
            <label htmlFor='myEmail'>이메일</label>
          </div>
          <div className={styles.input_box}>
            <input
              type='password'
              id='myPassword'
              required
              value={password}
              onChange={handleData}
            />
            <label htmlFor='myPassword'>비밀번호</label>
          </div>
          <div className={styles.strong_container}>
            {!isPending && (
              <button type='submit' className={styles.btn}>
                {" "}
                로그인
              </button>
            )}
            {isPending && (
              <BarLoader
                color='#136CE1'
                // cssOverride={{}}
                height={5}
                speedMultiplier={1}
                width={300}
              />
            )}
            {error && (
              <strong className={styles.error}>
                이메일과 비밀번호를 확인하세요.
              </strong>
            )}
          </div>
        </fieldset>
      </div>
      <div className={styles.btnWrapper}>
        <Link to='/signup' className={styles.linkBtn}>
          회원가입하기
        </Link>
      </div>
    </form>
  );
};

export default Login;
