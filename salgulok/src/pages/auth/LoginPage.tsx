import styled from "styled-components";
import KakaoLoginImg from "../../assets/auth/KakaoLoginButton.svg"

function LoginPage() {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <KakaoLoginButton
        src={KakaoLoginImg}
        alt="카카오톡 로그인"
        onClick={handleLogin}
      />
    </div>
  );
}

const KakaoLoginButton = styled.img`
  cursor: pointer;
  width: 184px; 
  height: auto;
`;

export default LoginPage;
