import styles from './Paginate.module.css';

const Paginate = ({ itemsPerPage, totalItems, pages, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const goToPrevPage = () => {
    if (currentPage > 1) pages(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < pageNumbers.length) pages(currentPage + 1);
  };

  return (
    <nav>
      <ul className={styles.Pages}>
        <li className={styles.page_item}>
          <a onClick={goToPrevPage} href='#' className={styles.page_Link}>
            &lt;
          </a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={styles.page_item}>
            <a onClick={(e) => { e.preventDefault(); pages(number); }} href='#' className={styles.page_NumLink}>
              {number}
            </a>
          </li>
        ))}
        <li className={styles.page_item}>
          <a onClick={goToNextPage} href='#' className={styles.page_Link}>
            &gt;
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Paginate;