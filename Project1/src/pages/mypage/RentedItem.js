import useAuthContext from '../../hooks/useAuthContext';

import RentedItemList from '../home/RentedItemList';
import styles from './MyItem.module.css';
import useCollection from '../../hooks/useCollection';

const RentedItem = () => {
  const { user } = useAuthContext();
  const { documents, error } = useCollection('Sharemarket', [
    'uid',
    '==',
    user.uid,
  ]);

  return (
    <main className={styles.container}>
      <h1>My Rented Item list</h1>
      <ul className={styles.content_list}>
        {error && <strong>{error}</strong>}
        {documents && <RentedItemList items={documents} currentUserDisplayName={user.displayName}></RentedItemList>}
      </ul>
    </main>
  );
};

export default RentedItem;
