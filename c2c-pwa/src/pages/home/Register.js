import ItemForm from './ItemForm';
import useAuthContext from '../../hooks/useAuthContext';

import styles from './Register.module.css';

const Register = () => {
  const { user } = useAuthContext();

  return (
    <main className={styles.container}>
      <aside className={styles.side_menu}>
        <ItemForm uid={user.uid}></ItemForm>
      </aside>
    </main>
  );
};

export default Register;
