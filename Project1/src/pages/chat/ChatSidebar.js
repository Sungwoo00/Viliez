import { collection, getDocs } from 'firebase/firestore';
import { appFireStore } from '../../firebase/confing';

const ChatSidebar = () => {
  async function getData() {
    const q = await getDocs(collection(appFireStore, 'chatRooms'));
    q.forEach((doc) => {
      console.log(`${doc.id}=>${doc.data()}`);
    });
  }
  getData();
  console.log(getData.length);

  return (
    <>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
    </>
  );
};

export default ChatSidebar;
