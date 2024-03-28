import ItemForm from "./ItemForm";
import useAuthContext from "../../hooks/useAuthContext";

import styles from "./Register.module.css";

const Register = () => {
  const { user } = useAuthContext();

  return (
    <div className={styles.register_container}>
      <ItemForm uid={user.uid}></ItemForm>
    </div>
  );
};

export default Register;
