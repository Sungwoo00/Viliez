import { Link, useRouteLoaderData, useSubmit } from 'react-router-dom';

import classes from './EventItem.module.css';

function EventItem({ event }) {
  const token = useRouteLoaderData('root');
  const submit = useSubmit();

  function startDeleteHandler() {
    const proceed = window.confirm('정말 삭제하겠습니까 ?');

    if (proceed) {
      submit(null, { method: 'delete' });
    }
  }

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />

      <h1>{event.title}</h1>
      {/* <time>{'대여 가능 날짜 : ' + event.date}</time> */}
      <h2>수량 : {event.amount}</h2>
      <h2>
        {new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW',
        }).format(event.price)}
      </h2>
      <p>{event.description}</p>

      {token && (
        <menu className={classes.actions}>
          <Link to='edit'>수정하기</Link>
          <button onClick={startDeleteHandler}>삭제하기</button>
        </menu>
      )}
    </article>
  );
}

export default EventItem;
