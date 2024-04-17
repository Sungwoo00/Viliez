import React, { useState } from "react";
import styles from "./ImageSlider.module.css";

const ImageSlider = ({ photoURLs, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [startPosition, setStartPosition] = useState(null);

  const handlePreviousImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photoURLs.length - 1 : prevIndex - 1
    );
  };
  const startDrag = (e) => {
    e.preventDefault();
    const position = e.clientX || e.touches[0].clientX;
    setStartPosition(position);
  };

  const onDrag = (e) => {
    if (startPosition === null) return;
    const currentPos = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = startPosition - currentPos;
    if (diff > 50) {
      handleNextImage();
      setStartPosition(null);
    } else if (diff < -50) {
      handlePreviousImage();
      setStartPosition(null);
    }
  };

  const endDrag = () => {
    setStartPosition(null);
  };

  const handleNextImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === photoURLs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderIndicators = () => {
    return photoURLs.map((_, idx) => (
      <span
        key={idx}
        className={
          idx === currentImageIndex ? styles.activeIndicator : styles.indicator
        }
      ></span>
    ));
  };

  return (
    <div
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={startDrag}
      onTouchMove={onDrag}
      onTouchEnd={endDrag}
    >
      {imageLoaded && (
        <button
          onClick={handlePreviousImage}
          className={`${styles.btn} ${styles.SliderBtn} ${styles.left}`}
        >
          &lt;
        </button>
      )}
      <img
        src={photoURLs[currentImageIndex]}
        alt={`Product ${currentImageIndex + 1}`}
        className={styles.imgSlide}
        onClick={onClick}
        onLoad={() => setImageLoaded(true)}
      />
      {imageLoaded && (
        <button
          onClick={handleNextImage}
          className={`${styles.btn} ${styles.SliderBtn} ${styles.right}`}
        >
          &gt;
        </button>
      )}
      <div className={styles.indicators}>{renderIndicators()}</div>
    </div>
  );
};

export default ImageSlider;
