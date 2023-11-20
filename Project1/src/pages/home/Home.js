import HomeItemList from './HomeItemList';
import styles from './Home.module.css';
import useCollection from '../../hooks/useCollection';
import SyncLoader from 'react-spinners/SyncLoader';

const Home = () => {
  const { documents, error, isLoading } = useCollection('Sharemarket');

  return (
    <div className={styles.container}>
      <h1>All Item</h1>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <h2>물건을 가져오는 중..</h2>
          <SyncLoader
            color='#136CE1  '
            margin='2'
            loading={isLoading}
            size={17}
          />
        </div>
      )}

      <ul className={styles.content_list}>
        {error && <strong>{error}</strong>}
        {documents && <HomeItemList items={documents}></HomeItemList>}
      </ul>
    </div>
  );
};

export default Home;
