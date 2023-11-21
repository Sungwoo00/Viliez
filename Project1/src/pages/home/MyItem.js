import ItemForm from './ItemForm';
import useAuthContext from '../../hooks/useAuthContext';

import ItemList from './ItemList';
import styles from './MyItem.module.css';
import useCollection from '../../hooks/useCollection';

const MyItem = () => {
  const { user } = useAuthContext();
  const { documents, error } = useCollection('Sharemarket', [
    'uid',
    '==',
    user.uid,
  ]);

  return (
    <main className={styles.container}>
      <aside className={styles.side_menu}>
        <ItemForm uid={user.uid}></ItemForm>
      </aside>
      <ul className={styles.content_list}>
        <h1>My Item list</h1>
        {error && <strong>{error}</strong>}
        {documents && <ItemList items={documents}></ItemList>}
      </ul>
    </main>
  );
};

export default MyItem;
