import SearchBar from './SearchBar';
import Calender from './Calender';
import Style from './SearchNavigation.module.css';

function SearchNavigation() {
  return (
    <div className={Style['searchnav-container']}>
      <div className={Style['search-container']}>
        <Calender className='calendar' />
        <SearchBar data={[]} />
      </div>
    </div>
  );
}

export default SearchNavigation;
