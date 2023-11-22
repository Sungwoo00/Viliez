import React, { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
// import styles from './MyPage.module.css';
import styles from './ItemList.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ItemList = ({ items }) => {
  const { deleteDocument, updateDocument } = useFirestore('Sharemarket');

  const [editing, setEditing] = useState({});
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedEa, setUpdatedEa] = useState('');
  const [updaterentuser, setUpdateRentUser] = useState('')
  const [updaterentalperiod, setRentalPeriod] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');

  const toggleEditing = (itemId) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      [itemId]: !prevEditing[itemId],
    }));

    if (!editing[itemId]) {
      setUpdatedTitle(items.find((item) => item.id === itemId).title);
      setUpdatedCategory(items.find((item) => item.id === itemId).Category);
      setUpdatedPrice(items.find((item) => item.id === itemId).price);
      setUpdatedEa(items.find((item) => item.id === itemId).ea);
      setUpdatedDescription(items.find((item) => item.id === itemId).description);
      setUpdateRentUser(items.find((item) => item.id === itemId).rentuser)
      setRentalPeriod(items.find((item) => item.id === itemId).rentalperiod)
    } else {
      setUpdatedTitle('');
      setUpdatedCategory('');
      setUpdatedPrice('');
      setUpdatedEa('');
      setUpdatedDescription('');
      setUpdateRentUser('');
      setRentalPeriod('');
    }
  };

  return (
    <>
      {items.map((item) => {
        return (
          <li key={item.id}>
            {/* {item.displayName && <p>{item.displayName}님의 물건입니다</p>} */}
            {editing[item.id] ? (
              <>
                <label htmlFor='editTitle'>제목 : </label>
                <input
                  id='editTitle'
                  type='text'
                  placeholder='새로운 제목'
                  value={updatedTitle}
                  onChange={(event) => setUpdatedTitle(event.target.value)}
                />
                <label>카테고리 : </label>
                <select
                  value={updatedCategory}
                  onChange={(event) => setUpdatedCategory(event.target.value)}
                >
                  <option value='가전'>가전</option>
                  <option value='여행'>여행</option>
                  <option value='의류'>의류</option>
                  <option value='취미'>취미</option>
                </select>
                <label htmlFor='editPrice'>가격 : </label>
                <input
                  id='editPrice'
                  type='number'
                  placeholder='새로운 가격'
                  value={updatedPrice}
                  onChange={(event) => setUpdatedPrice(event.target.value)}
                  min='5000'
                  step='1000'
                />
                <label htmlFor='editEa'>수량 : </label>
                <input
                  id='editEa'
                  type='number'
                  placeholder='새로운 수량'
                  value={updatedEa}
                  onChange={(event) => setUpdatedEa(event.target.value)}
                  min='1'
                  step='1'
                />
                <label htmlFor='editDescription'>설명 : </label>
                <textarea
                  id='editDescription'
                  placeholder='새로운 설명'
                  value={updatedDescription}
                  onChange={(event) =>
                    setUpdatedDescription(event.target.value)
                  }
                />
              </>
            ) : (
              <>
                {item.rentuser ?
                  <p>이 물품은 {item.rentuser}님이 예약 중입니다.</p> :
                  <p>이 물품을 예약한 사람이 없습니다.</p>
                }
                {item.rentalPeriod && (
                  <p>
                    대여 가능 기간: {item.rentalPeriod.startDate.toDate().toLocaleDateString('ko-KR') || '시작 날짜 정보 없음'}부터 {item.rentalPeriod.endDate.toDate().toLocaleDateString('ko-KR') || '종료 날짜 정보 없음'}까지
                  </p>
                )}
                <strong className={styles.title}>{item.title}</strong>
                {/* <p className={styles.Category}>{item.Category}</p> */}
                <p className={styles.price}>
                  {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  원
                </p>
                <p className={styles.ea}>{item.ea}개</p>
                <p className={styles.description}>{item.description}</p>
              </>
            )}
            <>
              <button
                className={styles.btn_edit}
                type='button'
                onClick={() => {
                  if (editing[item.id]) {
                    const updatedData = {
                      title: updatedTitle || item.title,
                      Category: updatedCategory || item.Category,
                      price: updatedPrice || item.price,
                      ea: updatedEa || item.ea,
                      description: updatedDescription || item.description,
                    };
                    updateDocument(item.id, updatedData);

                    setUpdatedTitle('');
                    setUpdatedCategory('');
                    setUpdatedPrice('');
                    setUpdatedEa('');
                    setUpdatedDescription('');
                  }
                  toggleEditing(item.id);
                }}
              >
                {editing[item.id] ? '확인' : '수정'}
              </button>
              <button
                className={styles.btn_delete}
                type='button'
                onClick={() => {
                  deleteDocument(item.id);
                }}
              >
                삭제
              </button>
            </>
          </li>
        );
      })}
    </>
  );
};

export default ItemList;
