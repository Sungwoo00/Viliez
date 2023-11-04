import React, { useState } from 'react';
import Style from'./SearchBar.module.css';

const SearchBar = ({ placeholder, data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchWord, setSearchWord] = useState('');

  const handleSearch = (e) => {
    const searchWord = e.target.value;
    setSearchWord(searchWord);
    const newFilter = data.filter((value) => {
      return value.toLowerCase().includes(searchWord.toLowerCase());
    });
    setFilteredData(newFilter);
  };

  return (
    <div className={Style['search-container']}>
      <input
        type="text"
        placeholder="찾으시는 물건을 검색해보세요" 
        value={searchWord}
        onChange={handleSearch}
        className={Style['search-input']}
      />
      {filteredData.length !== 0 && (
        <div className={Style['search-results']}>
          {filteredData.map((value, key) => {
            return <p key={key}>{value}</p>;
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
