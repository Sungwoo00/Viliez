import { useState } from 'react';
import HomeItemList from './HomeItemList';
import styles from './Home.module.css';
import useCollection from '../../hooks/useCollection';
import SyncLoader from 'react-spinners/SyncLoader';
import Dropdown from './Dropdown';
import Paginate from '../Page/Paginate';

const Home = () => {
  const { documents, error, isLoading } = useCollection('Sharemarket');
  const [selectedCategory, setSelectedCategory] = useState('모든 물품');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = documents ? documents.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <Dropdown onCategoryChange={setSelectedCategory} />
      {isLoading && (
        <div className={styles.loadingContainer}>
          <h2>물건을 가져오는 중..</h2>
          <SyncLoader
            color='#136CE1'
            margin='2'
            loading={isLoading}
            size={17}
          />
        </div>
      )}

      <ul className={styles.content_list}>
        {error && <strong>{error}</strong>}
        {documents && (
          <HomeItemList
            items={currentItems}
            selectedCategory={selectedCategory}
          ></HomeItemList>
        )}
      </ul>
      <Paginate
        itemsPerPage={itemsPerPage}
        totalItems={documents ? documents.length : 0}
        pages={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Home;
