import React from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";
import style from "./CustomDatePicker.module.css";

const CustomDatePicker = ({
  selectedDate,
  handleDateChange,
  isDatePickerOpen,
  openDatePicker,
  closeDatePicker,
  minDate,
}) => {
  return (
    <div className={style.ReactDatePicker}>
      <DatePicker
        placeholderText="날짜를 선택해주세요."
        selected={selectedDate}
        onChange={handleDateChange}
        shouldCloseOnSelect={false}
        monthsShown={1}
        timeIntervals={60}
        showTimeSelect
        timeCaption="시간"
        dateFormat="M/d(eee) HH:mm"
        minDate={minDate}
        open={isDatePickerOpen}
        onInputClick={openDatePicker}
        onClickOutside={closeDatePicker}
        locale={ko}
        required
        // isClearable
      />
    </div>
  );
};

export default CustomDatePicker;
