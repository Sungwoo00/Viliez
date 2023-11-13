import useFirestore from '../../hooks/useFirestore';
import styles from './MyPage.module.css';

const ItemList = ({ items }) => {
  const { deleteDocument } = useFirestore('Sharemarket');

  return (
    <>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <strong className={styles.title}>{item.title}</strong>
            <p className={styles.description}>{item.description}</p>

            <button
              type='button'
              onClick={() => {
                deleteDocument(item.id);
              }}
            >
              삭제
            </button>
          </li>
        );
      })}
    </>
  );
};

export default ItemList;
