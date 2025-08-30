import styled from "styled-components";
import KakaoLoginImg from "../../assets/auth/KakaoLoginButton.svg"
import LogoImg from "../../assets/common/main_salgu.svg"

function LoginPage() {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Container>
      <Logo src={LogoImg}/>
      <WebName>살구록</WebName>
      <SecName>구석구석 살아보는 기록</SecName>
      <KakaoLoginButton
        src={KakaoLoginImg}
        alt="카카오톡 로그인"
        onClick={handleLogin}
      />
    </Container>
  );
}

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--main-sec);
  gap: 15px;
`;

const Logo = styled.img`
  width: 104px;
  height: auto;
`;

const WebName = styled.div`
  font-family: "GyeonggiTitle", sans-serif;
  font-size: 40px;
  font-weight: 500;
  color: var(--main-pri);
`;

const SecName = styled.div`
  font-family: "GyeonggiTitle", sans-serif;
  font-size: 20px;
  font-weight: 300;
  color: #5C4141;
`;

const KakaoLoginButton = styled.img`
  cursor: pointer;
  margin-top: 10px;
  width: 184px;
  height: auto;
`;