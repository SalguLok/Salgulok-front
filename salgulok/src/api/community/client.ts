import axios from 'axios'

// baseURL을 ''로 두면 요청이 상대경로로 나감 (http://localhost:5173/community/..)
// dev 서버가 위 프록시 설정으로 백엔드로 전달해줌.
const communityApi = axios.create({
  //baseURL: '',
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, // ★ 환경 변수에서 API 주소 가져오기
  withCredentials: true,
})

// 요청 인터셉터 - 인증 헤더 추가
communityApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

export default communityApi
