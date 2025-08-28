import styled from "styled-components";
import BottomButton from "../../components/common/BottomButton.tsx";
const MapPage = () => {
  return (
    <Layout>
      <BottomButton text="다음" />
    </Layout>
  );
};

export default MapPage;

const Layout = styled.div`
  display: flex;
`;
