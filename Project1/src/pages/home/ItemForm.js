import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useFirestore from '../../hooks/useFirestore';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import { appStorage } from '../../firebase/confing';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Datepicker from './CustomDatePicker.module.css';
import styles from './ItemForm.module.css';
import { appFireStore } from '../../firebase/confing';
import { collection, doc } from 'firebase/firestore';

const ItemForm = ({ uid }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [ea, setEa] = useState('');
  const [description, setDescription] = useState('');
  const [rentuser, setRentUser] = useState('');
  const [, setStartDateString] = useState('');
  const [, setEndDateString] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: new Date(),
    endDate: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
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

    if (start) {
      setStartDateString(start.toISOString().split('T')[0]);
    }
    if (end) {
      setEndDateString(end.toISOString().split('T')[0]);
    }
    if (start && end) {
      setOpenDatePicker(false);
    }
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
      setSelectedImage(null);
      setRentalPeriod({ startDate: new Date(), endDate: null });
    }
  }, [response]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let photoURL = null;

    if (selectedImage) {
      const storageRef = ref(appStorage, `images/${uid}/${selectedImage.name}`);

      try {
        await uploadBytes(storageRef, selectedImage);
        alert('상품을 등록하였습니다.');
        photoURL = await getDownloadURL(storageRef);
        // console.log('Download URL:', photoURL);
      } catch (error) {
        alert('상품 등록 오류 ❗️');
        return;
      }
    }

    const docRef = doc(collection(appFireStore, 'Sharemarket'));
    const itemUid = docRef.id;

    const dataToSubmit = {
      uid,
      uids: {
        ownerUid: uid,
        itemUid,
      },
      price,
      ea,
      title,
      description,
      category,
      rentuser,
      rentalPeriod,
      displayName: currentUser?.displayName,
      photoURL: photoURL,
    };
    console.log(dataToSubmit.photoURL);

    setTitle('');
    setCategory('');
    setPrice('');
    setEa('');
    setDescription('');
    setRentUser('');
    setSelectedImage(null);
    setRentalPeriod({ startDate: new Date(), endDate: null });
    setImagePreviewUrl('');

    addDocument(dataToSubmit);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>상품 등록</legend>
          <ul className={styles.formList}>
            <li>
              <ReactDatePicker
                className={Datepicker.ReactDatePicker}
                id='rentalperiod'
                // locale='ko'
                // selected={rentalPeriod.startDate}
                startDate={rentalPeriod.startDate}
                endDate={rentalPeriod.endDate}
                selectsRange
                shouldCloseOnSelect={false}
                monthsShown={2}
                minDate={new Date()}
                dateFormat=' yyyy년 MM월 dd일(eee) '
                onChange={handleDateChange}
                open={openDatePicker}
                onInputClick={() => setOpenDatePicker(true)}
                locale={ko}
                readOnly
              />
            </li>

            <li>
              <input
                type='file'
                id='imageInput'
                accept='image/*'
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor='imageInput'>이미지 선택하기</label>

              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt='Preview'
                  required
                  className={styles.imagePreview}
                />
              )}
            </li>

            <li>
              <input
                className={styles.formItem}
                placeholder='제목'
                id='tit'
                type='text'
                value={title}
                required
                onChange={handleData}
              />
            </li>

            <li className={styles.formItem}>
              <select
                id='category'
                value={category}
                onChange={handleData}
                required
              >
                <option>카테고리</option>
                <option value='가전'>가전</option>
                <option value='여행'>여행</option>
                <option value='의류'>의류</option>
                <option value='취미'>취미</option>
              </select>
            </li>

            <li className={styles.formItem}>
              <input
                placeholder='가격'
                id='price'
                type='number'
                value={price}
                min='5000'
                step='1000'
                required
                onChange={handleData}
              />
            </li>

            <li className={styles.formItem}>
              <input
                placeholder='수량'
                id='ea'
                type='number'
                value={ea}
                min='1'
                step='1'
                required
                onChange={handleData}
              />
            </li>

            <li className={styles.formItem}>
              <textarea
                placeholder='대여하는 사람을 위해 자세히 적어주세요.'
                id='txt'
                type='text'
                value={description}
                required
                onChange={handleData}
              />
            </li>
          </ul>
          <button type='submit'>제출</button>
        </fieldset>
      </form>
    </>
  );
};

export default ItemForm;
