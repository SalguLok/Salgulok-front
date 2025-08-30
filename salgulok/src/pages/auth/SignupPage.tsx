import styled from "styled-components";
import LogoImg from "../../assets/common/main_salgu.svg";
import FormField from "../../components/common/FormField";
import ImageUpload from "../../components/common/ImageUpload";

const SignupPage: React.FC = () => {
  const handleCheck = () => alert("중복 확인 버튼 클릭");

  return (
    <Container>
      <Logo src={LogoImg}/>
      <MainInfo>회원정보 입력</MainInfo>
      <SubInfo>살구록 서비스 사용에 필요한 정보를 입력해주세요.</SubInfo>
      <FormWrapper>
        <FormField
          label="닉네임"
          required
          placeholder="닉네임을 입력해주세요."
          buttonText="중복 확인"
          onButtonClick={handleCheck}
          variant="sm"
        />
        <FormField
          label="한 줄 소개"
          placeholder="본인 한 줄 소개를 작성해주세요."
          variant="sm"
        />
        <ImageUpload/>
      </FormWrapper>
    </Container>
  );
}

export default SignupPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 8px;
  padding-top: 50px;  //임시
`;

const Logo = styled.img`
  width: 43px;
`;

const MainInfo = styled.div`
  font-weight: 600;
  font-size: 17px;
`;

const SubInfo = styled.div`
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 20px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;