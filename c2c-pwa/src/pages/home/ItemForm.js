import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useFirestore from "../../hooks/useFirestore";
import "react-datepicker/dist/react-datepicker.css";
import { appStorage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./ItemForm.module.css";
import { appFireStore } from "../../firebase/config";
import { collection, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const ItemForm = ({ uid }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [ea, setEa] = useState("");
  const [description, setDescription] = useState("");
  const [rentuser, setRentUser] = useState("");
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: new Date(),
    endDate: null,
  });

  const { addDocument, response } = useFirestore("Sharemarket");

  const handleData = (event) => {
    if (event.target.id === "tit") {
      setTitle(event.target.value);
    } else if (event.target.id === "category") {
      setCategory(event.target.value);
    } else if (event.target.id === "price") {
      setPrice(event.target.value);
    } else if (event.target.id === "ea") {
      setEa(event.target.value);
    } else if (event.target.id === "txt") {
      setDescription(event.target.value);
    } else if (event.target.id === "rentuser") {
      setRentUser(event.target.value);
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
      setTitle("");
      setCategory("");
      setPrice("");
      setEa("");
      setDescription("");
      setRentUser("");
      setSelectedImages([]);
      setRentalPeriod({ startDate: new Date(), endDate: null });
    }
  }, [response]);

  // const handleImageChange = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     setSelectedImage(file);

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreviewUrl(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).slice(0, 12); 
      setSelectedImages(filesArray); 

      const fileReaders = filesArray.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        return new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
      });

      Promise.all(fileReaders).then((files) => {
        setImagePreviewUrls(files);
      });
    }
  };
  const nextImage = () => {
    if (visibleStartIndex < imagePreviewUrls.length - 3) {
      setVisibleStartIndex(visibleStartIndex + 1);
    }
  };
  const prevImage = () => {
    if (visibleStartIndex > 0) {
      setVisibleStartIndex(visibleStartIndex - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let photoURLs = [];

    for (const file of selectedImages) {
      const storageRef = ref(appStorage, `images/${uid}/${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        photoURLs.push(photoURL);
      } catch (error) {
        toast.success("상품 등록 오류 ❗️");
        return;
      }
    }
    const docRef = doc(collection(appFireStore, "Sharemarket"));
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
      photoURLs,
    };

    setTitle("");
    setCategory("");
    setPrice("");
    setEa("");
    setDescription("");
    setRentUser("");
    setSelectedImages([]);
    setRentalPeriod({ startDate: new Date(), endDate: null });
    setImagePreviewUrls("");
    toast.success(`${title} 상품을 등록하였습니다.`);
    addDocument(dataToSubmit);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>상품 등록</legend>
          <ul className={styles.formList}>
            <li>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                multiple
              />
              <label htmlFor="imageInput">이미지 선택하기</label>
            </li>
            {imagePreviewUrls.length > 3 && (
              <div className={styles.imageIndexIndicator}>
                {`상품 이미지 (${visibleStartIndex + 3} / ${
                  imagePreviewUrls.length
                })`}
              </div>
            )}
            <div className={styles.imagePreviewFrame}>
              {imagePreviewUrls.length > 3 && (
                <button
                  className={styles.prevButton}
                  onClick={prevImage}
                  type="button"
                >
                  &lt;
                </button>
              )}
              <div className={styles.imagePreviewContainer}>
                {Array.isArray(imagePreviewUrls) &&
                  imagePreviewUrls.length > 0 &&
                  imagePreviewUrls
                    .slice(visibleStartIndex, visibleStartIndex + 3)
                    .map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className={styles.imagePreview}
                      />
                    ))}
              </div>
              {imagePreviewUrls.length > 3 && (
                <button
                  className={styles.nextButton}
                  onClick={nextImage}
                  type="button"
                >
                  &gt;
                </button>
              )}
            </div>
            <li>
              <input
                className={styles.formItem}
                placeholder="제목"
                id="tit"
                type="text"
                value={title}
                required
                onChange={handleData}
              />
            </li>

            <li className={styles.formItem}>
              <select
                id="category"
                value={category}
                onChange={handleData}
                required
              >
                <option>카테고리</option>
                <option value="가전">가전</option>
                <option value="여행">여행</option>
                <option value="의류">의류</option>
                <option value="취미">취미</option>
              </select>
            </li>

            <li className={styles.formItem}>
              <input
                placeholder="시간당 가격"
                id="price"
                type="number"
                value={price}
                min="1000"
                step="500"
                required
                onChange={handleData}
              />
            </li>

            <li className={styles.formItem}>
              <input
                placeholder="수량"
                id="ea"
                type="number"
                value={ea}
                min="1"
                step="1"
                required
                onChange={handleData}
              />
            </li>

            <li className={styles.formItem}>
              <textarea
                placeholder="대여하는 사람을 위해 자세히 적어주세요."
                id="txt"
                type="text"
                value={description}
                required
                onChange={handleData}
              />
            </li>
          </ul>

          <button className={styles.register_Btn} type="submit">
            올리기
          </button>
        </fieldset>
      </form>
    </>
  );
};

export default ItemForm;
