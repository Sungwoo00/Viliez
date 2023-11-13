import HomeItemList from './HomeItemList';
import styles from './MyPage.module.css';
import useCollection from '../../hooks/useCollection';

const Home = () => {
  const { documents, error } = useCollection('Sharemarket');

  return (
    <main className={styles.container}>
      <p>
        TODO : <br /> 1. Nav css <br /> 2.
      </p>
      <aside className={styles.side_menu}></aside>

      <ul className={styles.content_list}>
        <h1>All Item</h1>
        {error && <strong>{error}</strong>}
        {documents && <HomeItemList items={documents}></HomeItemList>}
      </ul>
    </main>
  );
};

export default Home;
