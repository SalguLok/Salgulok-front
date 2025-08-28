import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true, // 쿠키
});

// 요청 인터셉터: 매 요청마다 실행
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // localStorage에 저장한 토큰 로드
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러/토큰 만료 등 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("토큰 만료됨! 재로그인 또는 reissue 요청 필요");
      // TODO: reissue 로직 추가
    }
    return Promise.reject(error);
  }
);

export default api;