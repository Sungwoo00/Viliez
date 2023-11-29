import React from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import 'react-datepicker/dist/react-datepicker.css';
import style from './CustomDatePicker.module.css'; 

console.log('cur:',style)
const CustomDatePicker = ({
  startDate,
  endDate,
  handleDateChange,
  isDatePickerOpen,
  openDatePicker,
}) => {
  return (
    <div className={style.ReactDatePicker}>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        shouldCloseOnSelect={false}
        monthsShown={2}
        dateFormat='yy년 MM월 dd일 eee요일'
        minDate={new Date()}
        open={isDatePickerOpen}
        onInputClick={openDatePicker}
        isClearable
        placeholderText='대여 날짜를 선택해주세요.'
        locale={ko}
      />
    </div>
  );
};

export default CustomDatePicker;