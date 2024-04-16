import React, { useState } from "react";
import styles from "./ImageSlider.module.css";

const ImageSlider = ({ photoURLs, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photoURLs.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === photoURLs.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <button onClick={handlePreviousImage} className={styles.btn}>
        이전
      </button>
      <img
        src={photoURLs[currentImageIndex]}
        alt={`Product ${currentImageIndex + 1}`}
        // style={styles}
        className={styles.imgSlide}
        onClick={onClick}
      />
      <button onClick={handleNextImage} className={styles.btn}>
        다음
      </button>
    </div>
  );
};

export default ImageSlider;
