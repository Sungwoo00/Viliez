import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { CgSearch } from 'react-icons/cg';

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.SearchBar}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={handleChange}
        />
        <button className={styles.searchBtn} type="submit">
          <CgSearch style={{ fontSize: '22px' }} />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
