import styles from './Home.module.css';

const HomeItemList = ({ items }) => {
  return (
    <>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <strong className={styles.title}>{item.title}</strong>
            <p className={styles.description}>{item.description}</p>
            <button className={styles.btn}>상세정보</button>
            {/* 상제정보 ? 빌리기 ? 채팅 ? */}
          </li>
        );
      })}
    </>
  );
};

export default HomeItemList;
