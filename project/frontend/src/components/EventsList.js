import { useState } from 'react';
import { Link, useRouteLoaderData } from 'react-router-dom';

import classes from './EventsList.module.css';

function EventsList({ events }) {
  const token = useRouteLoaderData('root');

  const [blurItemIds, setBlurItemIds] = useState([]);

  const toggleBlurItem = (itemId) => {
    if (blurItemIds.includes(itemId)) {
      setBlurItemIds(blurItemIds.filter((id) => id !== itemId));
    } else {
      setBlurItemIds([...blurItemIds, itemId]);
    }
  };

  const handleBorrowClick = (event) => {
    if (token) {
      toggleBlurItem(event.id);
    } else {
      alert('로그인을 먼저 해주세요.');
    }
  };

  return (
    <div className={classes.events}>
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
                <button
                  className={classes.rentBtn}
                  onClick={() => handleBorrowClick(event)}
                >
                  {token ? '빌리기' : '빌리기'}
                  {/* TODO : When !istoken, button css or NavLink -> / signup Page */}
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
