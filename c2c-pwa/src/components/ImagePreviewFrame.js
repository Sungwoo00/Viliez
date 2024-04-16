import React from "react";
import styles from "./ImagePreviewFrame.module.css";

const ImagePreviewFrame = ({
  imagePreviewUrls,
  visibleStartIndex,
  prevImage,
  nextImage,
}) => {
  return (
    <div className={styles.imagePreviewFrame}>
      {imagePreviewUrls.length > 3 && (
        <button className={styles.prevButton} onClick={prevImage} type="button">
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
        <button className={styles.nextButton} onClick={nextImage} type="button">
          &gt;
        </button>
      )}
    </div>
  );
};

export default ImagePreviewFrame;
