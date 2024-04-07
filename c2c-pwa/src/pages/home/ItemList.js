import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ItemList.module.css";

const ItemList = ({ items }) => {
  const { deleteDocument, updateDocument } = useFirestore("Sharemarket");
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

  const handleUpdate = async (itemId) => {
    await updateDocument(itemId, updatedItems[itemId]);
    setEditing((prevEditing) => ({
      ...prevEditing,
      [itemId]: false,
    }));
  };

  const handleDelete = (itemId) => {
    toast.success("상품을 삭제했습니다.");
    deleteDocument(itemId);
  };

  return (
    <>
      {items.map((item) => (
        <li key={item.id} className={styles.myitem_list}>
          {editing[item.id] ? (
            <EditItemForm
              item={updatedItems[item.id] || item}
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
              deleteItem={() => handleDelete(item.id)}
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
      <input
        className={styles.itemlist_input}
        id='editTitle'
        type='text'
        placeholder='새로운 제목'
        value={item.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      <select
        className={styles.itemlist_select}
        value={item.category}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        <option value='가전'>가전</option>
        <option value='여행'>여행</option>
        <option value='의류'>의류</option>
        <option value='취미'>취미</option>
      </select>

      <input
        className={styles.itemlist_input}
        id='editPrice'
        type='number'
        placeholder='새로운 가격'
        value={item.price}
        onChange={(e) => handleChange("price", e.target.value)}
        min='1000'
        step='500'
      />
      <input
        className={styles.itemlist_input}
        id='editEa'
        type='number'
        placeholder='새로운 수량'
        value={item.ea}
        onChange={(e) => handleChange("ea", e.target.value)}
        min='1'
        step='1'
      />
      <textarea
        className={styles.itemlist_textarea}
        id='editDescription'
        placeholder='새로운 설명'
        value={item.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <div className={styles.btn_container}>
        <button className={styles.btn_edit} onClick={handleUpdate}>
          확인
        </button>
        <button className={styles.btn_delete} onClick={cancelEditing}>
          취소
        </button>
      </div>
    </>
  );
};

const ViewItem = ({ item, startEditing, deleteItem }) => {
  const rentusers = [];
  if (item.curRentInfo) {
    for (let i = 0; i < item.curRentInfo.length; i++) {
      const rentInfo = item.curRentInfo[i];
      if (rentInfo && rentInfo.rentuser) {
        rentusers.push(rentInfo.rentuser);
      }
    }
  }

  return (
    <>
      {item.rentuser ? (
        <p>이 물품은 {rentusers.join(", ")}님이 예약 중입니다.</p>
      ) : (
        <p>현재 예약 중인 사람이 없습니다.</p>
      )}
      <div>
        {item.photoURL && (
          <img src={item.photoURL} alt='Product' className={styles.ImgSize} />
        )}
      </div>
      <strong className={styles.title}>{item.title}</strong>
      <p className={styles.price}>
        가격 : {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
      </p>
      <p className={styles.ea}>수량 : {item.ea}개</p>
      <fieldset>
        <p className={styles.description}>{item.description}</p>
      </fieldset>
      <div className={styles.btn_container}>
        <button className={styles.btn_edit} onClick={startEditing}>
          수정
        </button>
        <button className={styles.btn_delete} onClick={deleteItem}>
          삭제
        </button>
      </div>
    </>
  );
};

export default ItemList;
