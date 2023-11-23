import React, { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
import styles from './ItemList.module.css';

const ItemList = ({ items }) => {
  const { deleteDocument, updateDocument } = useFirestore('Sharemarket');
  const [editing, setEditing] = useState({});
  const [updatedItems, setUpdatedItems] = useState({});

  const toggleEditing = (itemId) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      [itemId]: !prevEditing[itemId],
    }));

    if (!editing[itemId]) {
      const item = items.find((item) => item.id === itemId);
      setUpdatedItems((prevItems) => ({
        ...prevItems,
        [itemId]: { ...item },
      }));
    }
  };

  const cancelEditing = (itemId) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      [itemId]: false,
    }));

    setUpdatedItems((prevItems) => {
      const newItems = { ...prevItems };
      delete newItems[itemId];
      return newItems;
    });
  };

  const handleChange = (itemId, field, value) => {
    setUpdatedItems((prevItems) => ({
      ...prevItems,
      [itemId]: { ...prevItems[itemId], [field]: value },
    }));
  };

  const handleUpdate = (itemId) => {
    updateDocument(itemId, updatedItems[itemId]);
    setEditing((prevEditing) => ({
      ...prevEditing,
      [itemId]: false,
    }));
  };

  return (
    <>
      {items.map((item) => (
        <li key={item.id}>
          {editing[item.id] ? (
            <EditItemForm
              item={updatedItems[item.id]}
              handleChange={(field, value) =>
                handleChange(item.id, field, value)
              }
              handleUpdate={() => handleUpdate(item.id)}
              cancelEditing={() => cancelEditing(item.id)}
            />
          ) : (
            <ViewItem
              item={item}
              startEditing={() => toggleEditing(item.id)}
              deleteItem={() => deleteDocument(item.id)}
            />
          )}
        </li>
      ))}
    </>
  );
};

const EditItemForm = ({ item, handleChange, handleUpdate, cancelEditing }) => {
  return (
    <>
      <label htmlFor='editTitle'>제목 : </label>
      <input
        id='editTitle'
        type='text'
        placeholder='새로운 제목'
        value={item.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <label>카테고리 : </label>
      <select
        value={item.category}
        onChange={(e) => handleChange('category', e.target.value)}
      >
        <option value='가전'>가전</option>
        <option value='여행'>여행</option>
        <option value='의류'>의류</option>
        <option value='취미'>취미</option>
      </select>

      <label htmlFor='editPrice'>가격: </label>
      <input
        id='editPrice'
        type='number'
        placeholder='새로운 가격'
        value={item.price}
        onChange={(e) => handleChange('price', e.target.value)}
        min='5000'
        step='1000'
      />

      <label htmlFor='editEa'>수량: </label>
      <input
        id='editEa'
        type='number'
        placeholder='새로운 수량'
        value={item.ea}
        onChange={(e) => handleChange('ea', e.target.value)}
        min='1'
        step='1'
      />

      <label htmlFor='editDescription'>설명: </label>
      <textarea
        id='editDescription'
        placeholder='새로운 설명'
        value={item.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <button className={styles.btn_edit} onClick={handleUpdate}>
        확인
      </button>
      <button className={styles.btn_delete} onClick={cancelEditing}>
        취소
      </button>
    </>
  );
};

const ViewItem = ({ item, startEditing, deleteItem }) => {
  return (
    <>
      {item.rentuser ? (
        <p>이 물품은 {item.rentuser}님이 예약 중입니다.</p>
      ) : (
        <p>현재 예약 중인 사람이 없습니다.</p>
      )}
      {item.rentalPeriod && (
        <p>
          대여 가능 기간 :
          {item.rentalPeriod.startDate?.toDate()?.toLocaleDateString('ko-KR') ||
            '시작 날짜 정보가 없습니다.'}{' '}
          ~
          {item.rentalPeriod.endDate?.toDate()?.toLocaleDateString('ko-KR') ||
            '종료 날짜 정보가 없습니다.'}
        </p>
      )}

      {item.photoURL && <img src={item.photoURL} alt='Product' />}

      <strong className={styles.title}>{item.title}</strong>
      <p className={styles.price}>
        {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
      </p>
      <p className={styles.ea}>{item.ea}개</p>
      <p className={styles.description}>{item.description}</p>
      <button className={styles.btn_edit} onClick={startEditing}>
        수정
      </button>
      <button className={styles.btn_delete} onClick={deleteItem}>
        삭제
      </button>
    </>
  );
};

export default ItemList;
