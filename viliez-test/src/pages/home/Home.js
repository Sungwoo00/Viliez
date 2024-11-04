import { useState, useEffect } from 'react';
import HomeItemList from './HomeItemList';
import styles from './Home.module.css';
import useCollection from '../../hooks/useCollection';
import SyncLoader from 'react-spinners/SyncLoader';
import Paginate from '../../components/Paginate';
import Sidebar from '../../components/Sidebar';

const Home = () => {
  const { documents, error, isLoading } = useCollection('Sharemarket');
  const [selectedCategory, setSelectedCategory] = useState('모든 물품');

  const filteredItems = documents?.filter(
    (item) =>
      selectedCategory === '모든 물품' || item.category === selectedCategory
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Sidebar onCategoryChange={setSelectedCategory} />
        </div>
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
      </div>
      <Paginate
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems?.length || 0}
        pages={paginate}
        currentPage={currentPage}
      />
    </>
  );
};

export default Home;
