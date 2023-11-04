import { NavLink, useRouteLoaderData } from 'react-router-dom';

import classes from './EventsNavigation.module.css';

function EventsNavigation() {
  const token = useRouteLoaderData('root');

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to='/events'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              모든 물건
            </NavLink>
          </li>
          {token && (
            <li>
              <NavLink
                to='/events/new'
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                물건 등록
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default EventsNavigation;
