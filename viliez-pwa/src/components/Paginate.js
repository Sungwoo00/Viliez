import React, { useState } from "react";
import styles from "./Paginate.module.css";

const Paginate = ({ itemsPerPage, totalItems, pages, currentPage }) => {
  const [pageGroup, setPageGroup] = useState(1);
  const maxPageNumber = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  const pagesPerGroup = 5;

  for (
    let i = (pageGroup - 1) * pagesPerGroup + 1;
    i <= Math.min(pageGroup * pagesPerGroup, maxPageNumber);
    i++
  ) {
    pageNumbers.push(i);
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      pages(currentPage - 1);
      if ((currentPage - 1) % pagesPerGroup === 0) {
        setPageGroup(pageGroup - 1);
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < maxPageNumber) {
      pages(currentPage + 1);
      if (currentPage % pagesPerGroup === 0) {
        setPageGroup(pageGroup + 1);
      }
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <nav>
      <ul className={styles.Pages}>
        <li className={styles.page_item}>
          <a onClick={goToPrevPage} href='#' className={styles.page_Link}>
            {"‹"}
          </a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className={styles.page_item}>
            <a
              onClick={(e) => {
                e.preventDefault();
                pages(number);
              }}
              href='#'
              className={`${styles.page_NumLink} ${
                number === currentPage ? styles.activePage : ""
              }`}
            >
              {number}
            </a>
          </li>
        ))}
        <li className={styles.page_item}>
          <a onClick={goToNextPage} href='#' className={styles.page_Link}>
            {"›"}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Paginate;
