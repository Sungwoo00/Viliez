import styles from './MyPage.module.css';

const HomeItemList = ({ items }) => {
  return (
    <>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <strong className={styles.title}>{item.title}</strong>
            <p className={styles.description}>{item.description}</p>
          </li>
        );
      })}
    </>
  );
};

export default HomeItemList;
