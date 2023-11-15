import { useEffect, useState } from 'react';
import useFirestore from '../../hooks/useFirestore';

const ItemForm = ({ uid }) => {
  const [title, setTitle] = useState('');
  const [kategorie, setKategorie] = useState('');
  const [price, setPrice] = useState('');
  const [ea, setEa] = useState('');
  const [description, setDescription] = useState('');
  const { addDocument, response } = useFirestore('Sharemarket');

  const handleData = (event) => {
    if (event.target.id === 'tit') {
      setTitle(event.target.value);
    } else if (event.target.id === 'kategorie') {
      setKategorie(event.target.value);
    } else if (event.target.id === 'price') {
      setPrice(event.target.value);
    } else if (event.target.id === 'ea') {
      setEa(event.target.value);
    } else if (event.target.id === 'txt') {
      setDescription(event.target.value);
    }
  };

  useEffect(() => {
    console.log(response);
    if (response.success) {
      setTitle('');
      setKategorie('');
      setPrice('');
      setEa('');
      setDescription('');
    }
  }, [response]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(title, price, ea, description, kategorie);
    addDocument({ uid, price, ea, title, description, kategorie });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>상품 등록</legend>
          <label htmlFor='tit'>제목 : </label>
          <input
            placeholder='제목'
            id='tit'
            type='text'
            value={title}
            required
            onChange={handleData}
          />
          <label htmlFor='kategorie'>카테고리 : </label>
          <select
            id='kategorie'
            value={kategorie}
            onChange={handleData}
            required
          >
            <option value='Option 1'>옵션 1</option>
            <option value='Option 2'>옵션 2</option>
            <option value='Option 3'>옵션 3</option>
            <option value='Option 4'>옵션 4</option>
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
          <label htmlFor='tit'>설명 : </label>
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
