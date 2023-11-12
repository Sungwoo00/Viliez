import PageContent from '../components/PageContent';

function HomePage({ event }) {
  console.log(event);
  return (
    <PageContent title='Welcome to C2C service!'>
      <p>'여기에 닉네임을 출력하기 Home.js' 환영합니다.</p>
      <p>이곳을 편집하려면 Home.js을 편집하세요.</p>
    </PageContent>
  );
}

export default HomePage;
