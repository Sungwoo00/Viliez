import React, { useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
// import styles from './MyPage.module.css';
import styles from './ItemList.module.css';

const ItemList = ({ items }) => {
  const { deleteDocument, updateDocument } = useFirestore('Sharemarket');

  const [editing, setEditing] = useState({});
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedEa, setUpdatedEa] = useState('');
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
      setUpdatedDescription(
        items.find((item) => item.id === itemId).description
      );
    } else {
      // 편집 모드에서 빠져나갈 때 입력 필드 지우기
      setUpdatedTitle('');
      setUpdatedCategory('');
      setUpdatedPrice('');
      setUpdatedEa('');
      setUpdatedDescription('');
    }
  };

  return (
    <>
      {items.map((item) => {
        return (
          <li key={item.id}>
            {item.displayName && <p>{item.displayName}님의 물건입니다</p>}
            {editing[item.id] ? (
              <>
                <input
                  type='text'
                  placeholder='새로운 제목'
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <select
                  value={updatedCategory}
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                >
                  <option value='가전'>가전</option>
                  <option value='여행'>여행</option>
                  <option value='의류'>의류</option>
                  <option value='취미'>취미</option>
                </select>
                <input
                  type='number'
                  placeholder='새로운 가격'
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  min='5000'
                  step='1000'
                />
                <input
                  type='number'
                  placeholder='새로운 수량'
                  value={updatedEa}
                  onChange={(e) => setUpdatedEa(e.target.value)}
                  min='1'
                  step='1'
                />
                <textarea
                  placeholder='새로운 설명'
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                />
              </>
            ) : (
              <>
                <strong className={styles.title}>{item.title}</strong>
                <p className={styles.Category}>{item.Category}</p>
                <p className={styles.price}>{item.price}</p>
                <p className={styles.ea}>{item.ea}</p>
                <p className={styles.description}>{item.description}</p>
              </>
            )}
            <>
              <button
                className={styles.btn_edit}
                type='button'
                onClick={() => {
                  if (editing[item.id]) {
                    // 새로운 값으로 문서를 업데이트
                    const updatedData = {
                      title: updatedTitle || item.title,
                      Category: updatedCategory || item.Category,
                      price: updatedPrice || item.price,
                      ea: updatedEa || item.ea,
                      description: updatedDescription || item.description,
                    };
                    updateDocument(item.id, updatedData);

                    // 업데이트 후 입력 필드 지우기
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
