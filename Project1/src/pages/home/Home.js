import HomeItemList from './HomeItemList';
import styles from './Home.module.css';
import useCollection from '../../hooks/useCollection';

const Home = () => {
  const { documents, error } = useCollection('Sharemarket');

  return (
    <div className={styles.container}>
      <h1>All Item</h1>
      <ul className={styles.content_list}>
        {error && <strong>{error}</strong>}
        {documents && <HomeItemList items={documents}></HomeItemList>}
      </ul>
    </div>
  );
};

export default Home;
