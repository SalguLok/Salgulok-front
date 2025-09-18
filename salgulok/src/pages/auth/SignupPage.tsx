import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoImg from "../../assets/common/main_salgu.svg";
import FormField from "../../components/common/FormField";
import ImageUpload from "../../components/common/ImageUpload";
import BottomButton from "../../components/common/BottomButton";
import Header from "../../components/common/Header";
import { sendUserInfoIfNew } from "../../api/auth/signup";
import { nicknameDuplicate } from "../../api/user/nicknameDuplicate";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // 닉네임 중복 확인
  const [isNicknameValid, setIsNicknameValid] = useState(false); // 사용 가능한 닉네임인지

  const handleCheck = async () => {
    if (!username.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const res = await nicknameDuplicate({ username });

      if (res.duplicate) {
        alert("이미 사용 중인 닉네임입니다.");
        setIsNicknameValid(false);
      } else {
        alert("사용 가능한 닉네임입니다!");
        setIsNicknameValid(true);
      }
    } catch (err) {
      console.error("닉네임 중복 확인 실패", err);
      alert("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 완료
  const [username, setUsername] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImg, setProfileImg] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!username.trim()) {
      alert("닉네임은 필수입니다.");
      return;
    }
    if (!isNicknameValid) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    try {
      await sendUserInfoIfNew({
        username,
        intro: intro.trim() === "" ? null : intro,
        profileImg: profileImg,
      });

      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패", error);
    }
  };

  return (
    <Container>
      <Header title="회원가입" />
      <Logo src={LogoImg} />
      <MainInfo>회원정보 입력</MainInfo>
      <SubInfo>살구록 서비스 사용에 필요한 정보를 입력해주세요.</SubInfo>
      <FormWrapper>
        <FormField
          label="닉네임"
          required
          placeholder="닉네임을 입력해주세요."
          buttonText="중복 확인"
          onButtonClick={handleCheck}
          onChange={(e) => setUsername(e.target.value)}
          variant="sm"
        />
        <FormField
          label="한 줄 소개"
          placeholder="본인 한 줄 소개를 작성해주세요."
          onChange={(e) => setIntro(e.target.value)}
          variant="sm"
        />
        <ImageUpload
          label="프로필 이미지"
          //TODO: s3에 이미지 업로드 로직 추가
        />
      </FormWrapper>

      <BottomButton text="회원가입 완료하기" onClick={handleSignup} />
    </Container>
  );
};

export default SignupPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Logo = styled.img`
  width: 43px;
  margin: 20px 20px 0 20px;
`;

const MainInfo = styled.div`
  font-weight: 600;
  font-size: 17px;
  margin: 0 20px;
`;

const SubInfo = styled.div`
  font-weight: 500;
  font-size: 13px;
  margin: 0 20px 20px 20px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 0 20px;
`;
