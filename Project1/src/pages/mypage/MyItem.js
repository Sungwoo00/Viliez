import useAuthContext from '../../hooks/useAuthContext';

import ItemList from '../home/ItemList';
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
      <h1>My Item list</h1>
      <ul className={styles.content_list}>
        {error && <strong>{error}</strong>}
        {documents && <ItemList items={documents}></ItemList>}
      </ul>
    </main>
  );
};

export default MyItem;
