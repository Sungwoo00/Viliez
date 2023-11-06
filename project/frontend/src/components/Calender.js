import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { IoCalendarSharp } from 'react-icons/io5';
import Style from './Calender.module.css';

const Calender = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const dateSelectHandler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={Style['calender-container']}>
      <div className={Style['date-label']}>
        <IoCalendarSharp style={{ marginRight: '2px' }} />
      </div>
      <ReactDatePicker
        className={Style['date-picker']}
        locale={ko}
        selected={startDate}
        onChange={dateSelectHandler}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        shouldCloseOnSelect={false}
        monthsShown={2}
        minDate={new Date()}
        dateFormat=" yyyy년 MM월 dd일 "
      />
    </div>
  );
};

export default Calender;
