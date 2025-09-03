import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import LogoImg from "../../assets/common/main_salgu.svg"
import BottomButton from "../../components/common/BottomButton";

const CreateLogCompletePage: React.FC = () => {

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    }

    return (
        <Container>
            <Logo src={LogoImg}/>
            <MainText>로그가 생성되었어요!</MainText>
            <SubText>소중한 순간을 로그에 남겨주세요.</SubText>
            
            <HomeLink to="/">홈으로 가기</HomeLink>
            <BottomButton
                text="로그 보러가기"
                onClick={handleGoHome}
            />
        </Container>
    );
}

export default CreateLogCompletePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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