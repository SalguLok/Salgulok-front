import { useEffect } from "react";
import { sendKakaoCode } from "../../api/auth/login";
import { useNavigate } from "react-router-dom";

function KakaoRedirectPage() {
  localStorage.removeItem("accessToken"); //헤더의 accessToken 지우기
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    sendKakaoCode(code)
      .then((res) => {
        console.log("로그인 성공", res); // TODO: 배포시에는 콘솔로그 제거

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

  return <div>로그인 처리 중...</div>;
}

export default KakaoRedirectPage;
