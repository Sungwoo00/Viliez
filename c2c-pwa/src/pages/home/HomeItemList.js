import React, { useState, useEffect } from 'react';
import useAuthContext from '../../hooks/useAuthContext';
import useFirestore from '../../hooks/useFirestore';
import styles from './HomeItemList.module.css';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDatePicker from '../../components/CustomDatePicker';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { differenceInMilliseconds } from 'date-fns';
import { toast } from 'react-toastify';
import ImageSlider from '../../components/ImageSlider';
import { FaRegHeart } from 'react-icons/fa';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { appFireStore } from '../../firebase/config';

const HomeItemList = ({ items, selectedCategory }) => {
  const { updateDocument } = useFirestore('Sharemarket');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: null,
    endDate: null,
  });
  const [quantity, setQuantity] = useState('');
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [, setCurrentImageIndex] = useState(0);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchFavoriteItems = async () => {
        const favoritesCollectionRef = collection(
          appFireStore,
          'users',
          user.uid,
          'favorites'
        );
        const snapshot = await getDocs(favoritesCollectionRef);
        const favoriteItems = snapshot.docs.map((doc) => doc.id);
        setFavoriteItems(favoriteItems);
        setIsLoading(false);
      };

      fetchFavoriteItems();
    } else {
      setFavoriteItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const toggleFavorite = async (itemId) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const favoriteDocRef = doc(
        appFireStore,
        'users',
        user.uid,
        'favorites',
        itemId
      );

      if (favoriteItems.includes(itemId)) {
        await deleteDoc(favoriteDocRef);
        setFavoriteItems(favoriteItems.filter((id) => id !== itemId));
      } else {
        await setDoc(favoriteDocRef, { itemId });
        setFavoriteItems([...favoriteItems, itemId]);
      }
    } catch (error) {
      console.error('Error toggling favorite: ', error);
      toast.error('찜한 상품을 처리하는 중 오류가 발생했습니다.');
    }
  };

  const openImageModal = (imageURLs) => {
    setSelectedImages(imageURLs);
    setCurrentImageIndex(0);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImages([]);
    setImageModalOpen(false);
  };

  const openModal = (index) => setSelectedItem(items[index]);
  const closeModal = () => {
    setSelectedItem(null);
    setQuantity('');
    setRentalPeriod({
      startDate: null,
      endDate: null,
    });
  };

  const openStartDatePicker = () => {
    setIsStartDatePickerOpen(true);
  };

  const closeStartDatePicker = () => {
    setIsStartDatePickerOpen(false);
  };

  const openEndDatePicker = () => {
    setIsEndDatePickerOpen(true);
  };

  const closeEndDatePicker = () => {
    setIsEndDatePickerOpen(false);
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setRentalPeriod({
        ...rentalPeriod,
        startDate: date,
      });
      closeStartDatePicker();
      openEndDatePicker();
    } else {
      setRentalPeriod({
        ...rentalPeriod,
        endDate: date,
      });
      closeEndDatePicker();
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const calculateTotalPriceAndDuration = () => {
    const milliseconds = differenceInMilliseconds(
      new Date(rentalPeriod.endDate),
      new Date(rentalPeriod.startDate)
    );

    const totalHours = milliseconds / (1000 * 60 * 60);
    const totalPrice = selectedItem.price * quantity * totalHours;
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return { totalHours, days, hours, totalPrice };
  };

  const rentHandler = () => {
    const { totalHours } = calculateTotalPriceAndDuration();

    const quantity = parseInt(
      document.getElementById('quantityInput').value,
      10
    );
    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      if (selectedItem.ea === 0) {
        toast.error('대여 가능 물품의 수량이 부족합니다.');
        return;
      }
      toast.error('유효한 수량을 입력하세요.');
      return;
    }

    if (totalHours < 24) {
      toast.error('최소 대여시간은 24시간 입니다.');
      return;
    }

    const totalRentPriceAndDuration = calculateTotalPriceAndDuration();

    const formatDateTimeToKST = (date) => {
      if (!date) return null;

      const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

      const isoString = kstDate.toISOString();
      const [datePart, timePart] = isoString.split('T');
      const timePartWithoutZ = timePart.split('.')[0];

      return `${datePart} ${timePartWithoutZ}`;
    };

    const curRentInfo = selectedItem.curRentInfo || [];

    const updatedItem = {
      ...selectedItem,
      ea: selectedItem.ea - quantity,
      rentuser: user.displayName,
      totalRentEa:
        curRentInfo.reduce((sum, rentInfo) => sum + rentInfo.curRentEa, 0) +
        quantity,
      curRentInfo: [
        ...curRentInfo,
        {
          rentuser: user.displayName,
          curRentEa: quantity,
          startDate: rentalPeriod.startDate
            ? formatDateTimeToKST(rentalPeriod.startDate)
            : null,
          endDate: rentalPeriod.endDate
            ? formatDateTimeToKST(rentalPeriod.endDate)
            : null,
        },
      ],
      TotalRentPriceAndDuration: totalRentPriceAndDuration,
    };

    setSelectedItem(updatedItem);
    updateDocument(selectedItem.id, updatedItem);
    toast.success(
      `${selectedItem.displayName}님의
      ${selectedItem.title}을 성공적으로 빌리셨습니다.`
    );
    closeModal();
  };

  const chatHandler = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.uid === item.uid) {
      toast.error('자신이 등록한 물품에는 대화를 시도할 수 없습니다.');
      return;
    }
    const chatRoomId = generateChatRoomId(user.uid, item.uid);
    const chatRoomRef = doc(appFireStore, 'chatRooms', chatRoomId);

    const chatRoomSnap = await getDoc(chatRoomRef);
    if (!chatRoomSnap.exists()) {
      await setDoc(chatRoomRef, {
        participants: [user.uid, item.uid],
        createdAt: serverTimestamp(),
        participantNames: [user.displayName, item.displayName],
        itemId: item.id,
        itemTitle: item.title,
      });
    }

    setSelectedItem(item);
    navigate(`/chat/${chatRoomId}`);
    closeModal();
  };

  const generateChatRoomId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('-');
  };

  const calculateNearestEndDate = (item) => {
    const nearestEndDate = item.curRentInfo
      ? item.curRentInfo.reduce((nearestDate, rentInfo) => {
          if (!nearestDate) return rentInfo.endDate;
          const currentDate = new Date();
          const nearestDateDiff = Math.abs(new Date(nearestDate) - currentDate);
          const rentInfoDateDiff = Math.abs(
            new Date(rentInfo.endDate) - currentDate
          );
          return rentInfoDateDiff < nearestDateDiff
            ? rentInfo.endDate
            : nearestDate;
        }, null)
      : null;

    return { nearestEndDate };
  };

  const renderListItem = (item, index) => {
    if (
      selectedCategory !== '모든 물품' &&
      item.category !== selectedCategory
    ) {
      return null;
    }

    const isWished = favoriteItems.includes(item.id);
    const { nearestEndDate } = calculateNearestEndDate(item);

    return (
      <li key={item.id} className={styles.item}>
        <strong className={styles.title}>{item.title}</strong>
        <FaRegHeart
          className={`${styles.heart} ${isWished ? styles.wished : ''}`}
          onClick={() => toggleFavorite(item.id)}
        />
        <img
          alt={item.id}
          className={styles.homeImg}
          src={item.photoURLs}
          onClick={() => openImageModal(item.photoURLs)}
        />
        <p className={styles.amountP}>
          남은 수량: {item.ea} 개 (
          {item.ea !== 0 ? '대여 가능' : '모두 대여 중'})
        </p>
        {item.ea === 0 && nearestEndDate && (
          <p
            className={styles.dateP}
          >{`예약 가능 날짜:${nearestEndDate.toLocaleString()}`}</p>
        )}
        <p className={styles.priceP}>{`시간당 대여 비용: ${item.price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>

        <div className={styles.home_btn_container}>
          <button className={styles.infoBtn} onClick={() => openModal(index)}>
            자세히
          </button>
          <button
            type="button"
            className={styles.chatBtn}
            onClick={() => chatHandler(item)}
          >
            채팅
          </button>
        </div>
      </li>
    );
  };

  const renderModal = () => {
    const { nearestEndDate } = calculateNearestEndDate(selectedItem);

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeModal}
          >
            <IoIosCloseCircleOutline />
          </button>
          <h3>{`[${selectedItem.displayName}]님의 ${selectedItem.title}`}</h3>
          <p>{`시간당 대여 비용: ${selectedItem.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</p>
          <p>{`수량 : ${selectedItem.ea} 개`}</p>
          {nearestEndDate && selectedItem.ea === 0 ? (
            <p className={styles.dateP}>{`예약 가능 날짜:${nearestEndDate}`}</p>
          ) : null}
          <p>{`설명 : ${selectedItem.description}`}</p>
          {user && (
            <>
              <div style={{ display: 'flex' }}>
                <CustomDatePicker
                  selectedDate={rentalPeriod.startDate}
                  handleDateChange={(date) => handleDateChange(date, 'start')}
                  isDatePickerOpen={isStartDatePickerOpen}
                  openDatePicker={openStartDatePicker}
                  closeDatePicker={closeStartDatePicker}
                />

                <CustomDatePicker
                  selectedDate={rentalPeriod.endDate}
                  handleDateChange={(date) => handleDateChange(date, 'end')}
                  isDatePickerOpen={isEndDatePickerOpen}
                  openDatePicker={openEndDatePicker}
                  closeDatePicker={closeEndDatePicker}
                  minDate={
                    new Date(
                      new Date(rentalPeriod.startDate).getTime() +
                        24 * 60 * 60 * 1000
                    )
                  }
                />
              </div>
              <div className={styles.inputContainer}>
                <input
                  className={styles.quantityInput}
                  placeholder="수량을 입력하세요."
                  id="quantityInput"
                  type="number"
                  min="1"
                  max={selectedItem.ea}
                  value={quantity}
                  onChange={handleQuantityChange}
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  type="button"
                  className={styles.rentBtn}
                  onClick={rentHandler}
                >
                  빌리기
                </button>
              </div>
              <div>
                <p>{`총 대여 비용: ${
                  calculateTotalPriceAndDuration().totalPrice
                }원`}</p>
                <p>
                  {`총 대여 기간: ${calculateTotalPriceAndDuration().days}일 ${
                    calculateTotalPriceAndDuration().hours
                  }시간`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderImageModal = () => (
    <div className={styles.modalOverlay} onClick={closeImageModal}>
      <div className={styles.img_modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeImageModal}
        >
          <IoIosCloseCircleOutline />
        </button>
        <ImageSlider photoURLs={selectedImages} />
      </div>
    </div>
  );

  return (
    <>
      {items.map(renderListItem)}
      {selectedItem && renderModal()}
      {isImageModalOpen && renderImageModal()}
    </>
  );
};

export default HomeItemList;
