import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useFirestore from '../../hooks/useFirestore';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';

const ItemForm = ({ uid }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [ea, setEa] = useState('');
  const [description, setDescription] = useState('');
  const [rentuser, setRentUser] = useState('');

  const [rentalPeriod, setRentalPeriod] = useState({ startDate: new Date(), endDate: null });
  const { addDocument, response } = useFirestore('Sharemarket');

  const handleData = (event) => {
    if (event.target.id === 'tit') {
      setTitle(event.target.value);
    } else if (event.target.id === 'category') {
      setCategory(event.target.value);
    } else if (event.target.id === 'price') {
      setPrice(event.target.value);
    } else if (event.target.id === 'ea') {
      setEa(event.target.value);
    } else if (event.target.id === 'txt') {
      setDescription(event.target.value);
    } else if (event.target.id === 'rentuser') {
      setRentUser(event.target.value);
    }
  };
  
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setRentalPeriod({ startDate: start, endDate: end });
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (response.success) {
      setTitle('');
      setCategory('');
      setPrice('');
      setEa('');
      setDescription('');
      setRentUser('');
      setRentalPeriod({ startDate: new Date(), endDate: null });
    }
  }, [response]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const dataToSubmit = {
      uid,
      price,
      ea,
      title,
      description,
      category,
      rentuser,
      rentalPeriod,
      displayName: currentUser?.displayName,
    };

    // console.log('전송할 데이터:', dataToSubmit);

    addDocument(dataToSubmit);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>상품 등록</legend>
          <label htmlFor='rentalperiod'>대여 기간 : </label>
          <ReactDatePicker
            id='rentalperiod'
            locale="ko"
            // selected={rentalPeriod.startDate}
            startDate={rentalPeriod.startDate}
            endDate={rentalPeriod.endDate}
            selectsRange
            shouldCloseOnSelect={false}
            monthsShown={2}
            minDate={new Date()}
            dateFormat="yyyy.MM.dd(eee)"
            onChange={handleDateChange}
          />
          <label htmlFor='tit'>제목 : </label>
          <input
            placeholder='제목'
            id='tit'
            type='text'
            value={title}
            required
            onChange={handleData}
          />
          <label htmlFor='category'>카테고리 : </label>
          <select id='category' value={category} onChange={handleData} required>
            <option>선택해주세요</option>
            <option value='가전'>가전</option>
            <option value='여행'>여행</option>
            <option value='의류'>의류</option>
            <option value='취미'>취미</option>
          </select>
          <label htmlFor='price'>가격 : </label>
          <input
            placeholder='가격'
            id='price'
            type='number'
            value={price}
            required
            onChange={handleData}
            min='5000'
            step='1000'
          />
          <label htmlFor='ea'>수량 : </label>
          <input
            placeholder='수량'
            id='ea'
            type='number'
            value={ea}
            required
            onChange={handleData}
            min='1'
            step='1'
          />
          <label htmlFor='txt'>설명 : </label>
          <textarea
            placeholder='대여하는 사람을 위해 자세히 적어주세요.'
            id='txt'
            type='text'
            value={description}
            required
            onChange={handleData}
          />

          <button type='submit'>제출</button>
        </fieldset>
      </form>
    </>
  );
};

export default ItemForm;
