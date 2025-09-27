import { useEffect } from "react";
import { sendKakaoCode } from "../../api/auth/login";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

function KakaoRedirectPage() {
  localStorage.removeItem("accessToken"); // 헤더의 accessToken 지우기
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    sendKakaoCode(code)
      .then((res) => {
        // 로그인 성공

        if (res.newUser) {
          navigate("/signup"); // 추가 회원정보 입력 페이지
        } else {
          navigate("/"); // 메인 페이지
        }
      })
      .catch((err) => {
        console.error("로그인 실패", err);
        alert("로그인 중 문제가 발생했습니다.");
        navigate("/login");
      });
  }, []);

  return (
    <Wrapper>
      <Spinner />
      <Text>살구록 로그인 중...</Text>
    </Wrapper>
  );
}

export default KakaoRedirectPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--main-sec);
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 6px solid var(--main-sec);
  border-top: 6px solid var(--main-pri);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: var(--main-pri);
`;