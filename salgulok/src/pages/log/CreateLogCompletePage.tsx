import styled from "styled-components";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LogoImg from "../../assets/common/main_salgu.svg"
import BottomButton from "../../components/common/BottomButton";
import Header from "../../components/common/Header";

const CreateLogCompletePage: React.FC = () => {

    const location = useLocation();
    const logId = location.state?.logId;
    const navigate = useNavigate();

    const handleGoLog = () => {
       if (logId) {
        navigate(`/log/${logId}`);
      } else {
        navigate("/");
      }
    }

    return (
      <Container>
        <Header title="살구로그 생성"/>

        <ContentWrapper>
          <Logo src={LogoImg}/>
          <MainText>로그가 생성되었어요!</MainText>
          <SubText>소중한 순간을 로그에 남겨주세요.</SubText>
        </ContentWrapper>

        <HomeLink to="/">홈으로 가기</HomeLink>
        <BottomButton
          text="로그 보러가기"
          onClick={handleGoLog}
        />
      </Container>
    );
}

export default CreateLogCompletePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 0 0 95px 0;
  gap: 15px;
`;

const Logo = styled.img`
  width: 98px;
  height: auto;
`;

const MainText = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const SubText = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const HomeLink = styled(Link)`
  position: fixed;
  bottom: 70px;
  font-size: 14px;
  font-weight: 600;
  color: var(--main-pri);
  text-decoration: underline;
  text-decoration-color: var(--main-pri);
`;