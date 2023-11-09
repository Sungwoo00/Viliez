import React, { useState, useEffect } from 'react';
import { Link, useRouteLoaderData } from 'react-router-dom';

import SearchNavigation from './SearchNavigation';
import classes from './EventsList.module.css';

function EventsList({ events, filteredData }) {
  const token = useRouteLoaderData('root');
  const [blurItemIds, setBlurItemIds] = useState([]);
  const [quantityInput, setQuantityInput] = useState(1);

  useEffect(() => {
    setBlurItemIds([]);
  }, [filteredData]);

  const toggleBlurItem = (itemId) => {
    if (blurItemIds.includes(itemId)) {
      setBlurItemIds(blurItemIds.filter((id) => id !== itemId));
    } else {
      setBlurItemIds([...blurItemIds, itemId]);
    }
  };

  const handleBorrowClick = (event) => {
    if (token) {
      if (event.amount - quantityInput === 0) {
        toggleBlurItem(event.id);
      } else {
        event.amount = event.amount - quantityInput;
      }
    } else {
      alert('로그인을 먼저 해주세요.');
    }
  };
  // TODO : When event.amount changed, DB always send event.amount data.

  return (
    <div className={classes.events}>
      <SearchNavigation />
      <h1>모든 물건</h1>
      <ul className={classes.list}>
        {events.map((event) => (
          <li
            key={event.id}
            className={`${classes.item} ${
              blurItemIds.includes(event.id) ? classes.blur : ''
            }`}
          >
            <Link to={`/events/${event.id}`}>
              <img src={event.image} alt={event.title} />
              <div className={classes.content}>
                <h2>{event.title}</h2>
                <h2>
                  {new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW',
                  }).format(event.price)}
                </h2>
                <h2>수량 : {event.amount}</h2>
                {token && (
                  <>
                    <input
                      type='number'
                      max={event.amount}
                      min='1'
                      step='1'
                      onChange={(event) =>
                        setQuantityInput(parseInt(event.target.value))
                      }
                    ></input>
                    <button
                      className={classes.rentBtn}
                      onClick={() => handleBorrowClick(event)}
                    >
                      {token ? '빌리기' : '빌리기'}
                      {/* TODO : When !istoken, button css or NavLink -> / signup Page */}
                    </button>
                  </>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
