import React, { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import useFirestore from "../../hooks/useFirestore";
import styles from "./HomeItemList.module.css";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "../../components/CustomDatePicker";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "react-toastify";

const HomeItemList = ({ items, selectedCategory }) => {
  const { updateDocument } = useFirestore("Sharemarket");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: null,
    endDate: null,
  });
  const [quantity, setQuantity] = useState(0);

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageURL) => {
    setSelectedImage(imageURL);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const openModal = (index) => setSelectedItem(items[index]);
  const openChat = (item) => setSelectedItem(item);
  const closeModal = () => {
    setSelectedItem(null);
    setQuantity(0);
    setRentalPeriod({
      startDate: null,
      endDate: null,
    });
  };

  const openDatePicker = () => setDatePickerOpen(true);
  const closeDatePicker = () => setDatePickerOpen(false);

  const handleBackgroundClick = (e) => {
    if (isDatePickerOpen) {
      closeDatePicker();
    } else {
      closeModal();
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setRentalPeriod({ startDate: start, endDate: end });

    if (start && end) {
      setDatePickerOpen(false);
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const calculateTotalPrice = () => {
    const days =
      differenceInCalendarDays(
        new Date(rentalPeriod.endDate),
        new Date(rentalPeriod.startDate)
      ) + 1;
    return selectedItem.price * quantity * days;
  };

  const rentHandler = () => {
    const quantity = parseInt(
      document.getElementById("quantityInput").value,
      10
    );
    if (isNaN(quantity) || quantity < 1 || quantity > selectedItem.ea) {
      toast.error("유효한 수량을 입력하세요.");
      return;
    }

    const totalRentPrice = calculateTotalPrice();

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
            ? rentalPeriod.startDate.toISOString().split("T")[0]
            : null,
          endDate: rentalPeriod.endDate
            ? rentalPeriod.endDate.toISOString().split("T")[0]
            : null,
        },
      ],
      TotalRentPrice: totalRentPrice,
    };

    setSelectedItem(updatedItem);
    updateDocument(selectedItem.id, updatedItem);
    toast.success(`${selectedItem.title}을 성공적으로 빌리셨습니다.`);
    closeModal();
  };

  const chatHandler = (item) => {
    if (!user) {
      navigate("/login");
    } else {
      const chatRoomId = `${item.id}`;
      openChat(item);
      navigate(`/chat/${chatRoomId}${user.uid}`);
      closeModal();
    }
  };

  const renderListItem = (item, index) => {
    if (
      selectedCategory !== "모든 물품" &&
      item.category !== selectedCategory
    ) {
      return null;
    }

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

    return (
      <li key={item.id} className={styles.item}>
        <strong className={styles.title}>{item.title}</strong>
        <img
          alt={item.id}
          className={styles.homeImg}
          src={item.photoURL}
          onClick={() => openImageModal(item.photoURL)}
        />
        <p className={styles.amountP}>
          남은 수량: {item.ea} 개 (
          {item.ea !== 0 ? "대여 가능" : "모두 대여 중"})
        </p>
        {nearestEndDate ? (
          <p className={styles.dateP}>{`예약 가능 날짜:${nearestEndDate}`}</p>
        ) : (
          <p className={styles.dateP}>예약 가능한 날짜 정보가 없습니다.</p>
        )}
        <p className={styles.priceP}>{`일일 대여 비용: ${item.price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`}</p>

        <div className={styles.home_btn_container}>
          <button className={styles.infoBtn} onClick={() => openModal(index)}>
            자세히
          </button>
          <button
            type='button'
            className={styles.chatBtn}
            onClick={() => chatHandler(item)}
          >
            채팅
          </button>
        </div>
      </li>
    );
  };

  const renderModal = () => (
    <div className={styles.modalOverlay} onClick={handleBackgroundClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type='button' className={styles.closeBtn} onClick={closeModal}>
          <IoIosCloseCircleOutline />
        </button>
        <h3>{`[${selectedItem.displayName}]님의 ${selectedItem.title}`}</h3>
        <p>{`일일 대여 비용: ${selectedItem.price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`}</p>
        <p>{`수량 : ${selectedItem.ea} 개`}</p>
        <p>{`설명 : ${selectedItem.description}`}</p>
        {user && (
          <>
            <div className='ReactDatePicker'>
              <CustomDatePicker
                startDate={rentalPeriod.startDate}
                endDate={rentalPeriod.endDate}
                handleDateChange={handleDateChange}
                isDatePickerOpen={isDatePickerOpen}
                openDatePicker={openDatePicker}
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                className={styles.quantityInput}
                placeholder='수량을 입력하세요.'
                id='quantityInput'
                type='number'
                min='1'
                max={selectedItem.ea}
                value={quantity}
                onChange={handleQuantityChange}
                onClick={(e) => e.stopPropagation()}
              />

              <button
                type='button'
                className={styles.rentBtn}
                onClick={rentHandler}
              >
                빌리기
              </button>
            </div>
            <div>
              <p>{`총 대여 비용: ${calculateTotalPrice()}원`}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderImageModal = () => (
    <div className={styles.modalOverlay} onClick={closeImageModal}>
      <div className={styles.img_modal} onClick={(e) => e.stopPropagation()}>
        <button
          type='button'
          className={styles.closeBtn}
          onClick={closeImageModal}
        >
          <IoIosCloseCircleOutline />
        </button>
        {selectedImage && <img src={selectedImage} alt='Large' />}
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
