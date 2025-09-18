import axios from 'axios'

// baseURL을 ''로 두면 요청이 상대경로로 나감 (http://localhost:5173/community/..)
// dev 서버가 위 프록시 설정으로 백엔드로 전달해줌.
const communityApi = axios.create({
  baseURL: '',          // ★ 중요: 절대 URL 금지 (상대경로)
  withCredentials: true,
})

// 요청 인터셉터 - 인증 헤더 추가
communityApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("Community API 요청:", config.method?.toUpperCase(), config.url);
  console.log("Access Token:", accessToken ? "존재함" : "없음");
  
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("Authorization 헤더 추가됨");
  }
  
  console.log("요청 헤더:", config.headers);
  return config;
});

export default communityApi
