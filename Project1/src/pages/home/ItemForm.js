import { useEffect, useState } from 'react';
import useFirestore from '../../hooks/useFirestore';

const ItemForm = ({ uid }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addDocument, response } = useFirestore('Sharemarket');

  const handleData = (event) => {
    if (event.target.id === 'tit') {
      setTitle(event.target.value);
    } else if (event.target.id === 'txt') {
      setDescription(event.target.value);
    }
  };

  useEffect(() => {
    console.log(response);
    if (response.success) {
      setTitle('');
      setDescription('');
    }
  }, [response.success]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(title, description);
    addDocument({ uid, title, description });
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
